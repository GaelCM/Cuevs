import { ipcMain } from "electron";
import db from "../db.js";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function CortesController(){

    ipcMain.handle('insertar-nuevo-corte', (event, idUsuario, montoInicialEfectivo) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');

        // Insertar en la tabla cortesCaja
        const stmt = db.prepare(`
            INSERT INTO cortesCaja 
            (idUsuario, fechaApertura, montoInicialEfectivo, ventasEfectivo, ventasTarjeta, 
             totalVentas, totalCompras, totalGastos, totalEgresos, montoFinalEfectivo, diferencia, 
             observaciones, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const res = stmt.run(
            idUsuario,
            fechaFormateada, // fechaApertura
            montoInicialEfectivo,
            0, // ventasEfectivo (inicia en 0)
            0, // ventasTarjeta (inicia en 0)
            0, // totalVentas (inicia en 0)
            0, // totalCompras (inicia en 0)
            0, // totalGastos (inicia en 0)
            0, // totalEgresos (inicia en 0)
            0, // montoFinalEfectivo (se llena al cerrar)
            0, // diferencia (se calcula al cerrar)
            '', // observaciones de apertura
            'ABIERTO' // estado inicial
        );

        return {
            success: true,
            message: 'Turno iniciado correctamente',
            data: {
                idCorte: res.lastInsertRowid,
                fechaApertura: fechaFormateada,
                montoInicialEfectivo: montoInicialEfectivo,
                idUsuario: idUsuario
            }
        };
    });

    ipcMain.handle('cerrar-turno', (event, dataCierre) => {
    const timeZone = 'America/Mexico_City';
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');

    try {
        // Obtener datos del corte actual
        const corteStmt = db.prepare(`
            SELECT fechaApertura, montoInicialEfectivo 
            FROM cortesCaja 
            WHERE idCorte = ?
        `);
        const corteData = corteStmt.get(dataCierre.idCorte); //primero OBTENEMOS LA DATA DEL CORTE ACTUAL QUE ESTA USANDO EL USUARIO.

        // Calcular ventas del día para este corte
        const ventasStmt = db.prepare(`
            SELECT 
                COUNT(*) as totalTransacciones,
                SUM(totalVenta) as totalVentas,
                SUM(CASE WHEN tipoPago = 0 THEN totalVenta ELSE 0 END) as ventasEfectivo,
                SUM(CASE WHEN tipoPago = 1 THEN totalVenta ELSE 0 END) as ventasTarjeta
            FROM ventas 
            WHERE DATE(fechaVenta) = DATE(?) AND idUsuario = ? 
        `);
        const ventasData = ventasStmt.get(corteData.fechaApertura, dataCierre.idUsuario); //HACEMOS UNA CONSULTA A TODAS LA VENTAS HECHAS EL DÍA EN EL QUE SE ABRIO EL TURNO

        // Calcular compras del día para este corte
        const comprasStmt = db.prepare(`
            SELECT 
                COUNT(*) as totalTransaccionesCompras,
                SUM(totalCompra) as totalCompras
            FROM compras 
            WHERE DATE(fechaCompra) = DATE(?) AND idUsuario = ?
        `);
        const comprasData = comprasStmt.get(corteData.fechaApertura, dataCierre.idUsuario); //HACEMOS UNA CONSULTA A TODAS LAS COMPRAS HECHAS EL DÍA EN EL QUE SE ABRIO EL TURNO

        const gastosStmt = db.prepare(`
            SELECT 
                COUNT(*) as totalTransaccionesGastos,
                SUM(monto) as totalGastos
            FROM gastos 
            WHERE DATE(fechaRegistro) = DATE(?)
        `);
        const gastosData = gastosStmt.get(corteData.fechaApertura); // Consulta a todos los gastos hechos el día en el que se abrió el turno

        // Calcular el monto esperado en efectivo
       const montoEsperado = ( corteData.montoInicialEfectivo + (ventasData.ventasEfectivo || 0) ) - ((comprasData.totalCompras || 0)+(gastosData.totalGastos || 0)); // RESTAMOS compras
            
        // Calcular diferencia
        const diferencia = dataCierre.montoFinalEfectivo - montoEsperado;//AQUI HACEMOS LA RESTA DE LO SE SUPONE QUE TENEMOS CONTRA LO QUE REALEMNTE TENEMOS DE EFECTIVO.

        // Actualizar el corte con todos los datos calculados
        const updateStmt = db.prepare(`
            UPDATE cortesCaja SET 
                fechaCierre = ?,
                ventasEfectivo = ?,
                ventasTarjeta = ?,
                totalVentas = ?,
                totalCompras = ?,
                totalGastos = ?,
                totalEgresos = ?,
                montoFinalEfectivo = ?,
                diferencia = ?,
                observaciones = ?,
                estado = 'CERRADO'
            WHERE idCorte = ?
        `);

        updateStmt.run(
            fechaFormateada,
            ventasData.ventasEfectivo || 0,
            ventasData.ventasTarjeta || 0,
            ventasData.totalVentas || 0,
            comprasData.totalCompras || 0,
            gastosData.totalGastos || 0,
            (comprasData.totalCompras || 0) + (gastosData.totalGastos || 0),
            dataCierre.montoFinalEfectivo,
            diferencia,
            dataCierre.observaciones || '',
            dataCierre.idCorte
        );

        return {
            success: true,
            message: 'Turno cerrado correctamente',
            data: {
                idCorte: dataCierre.idCorte,
                fechaCierre: fechaFormateada,
                totalVentas: ventasData.totalVentas || 0,
                ventasTarjeta: ventasData.ventasTarjeta || 0,
                ventasEfectivo: ventasData.ventasEfectivo || 0,
                montoInicial: corteData.montoInicialEfectivo,
                totalCompras: comprasData.totalCompras || 0,
                totalGastos: gastosData.totalGastos || 0,
                totalEgresos: (comprasData.totalCompras || 0) + (gastosData.totalGastos || 0),
                montoEsperado: montoEsperado,
                montoFinal: dataCierre.montoFinalEfectivo,
                diferencia: diferencia,  
                totalTransacciones: ventasData.totalTransacciones || 0
            }
        };
    } catch (error) {
        console.error('Error al cerrar turno:', error);
        return {
            success: false,
            message: 'Error al cerrar turno',
            error: error.message
        };
    }
    });

}

export {CortesController};