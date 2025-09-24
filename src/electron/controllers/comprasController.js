import { ipcMain } from "electron";
import db from "../db.js";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function comprasController(){

    ipcMain.handle('insertar-compra', (event, compra) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');

        const stmt = db.prepare('INSERT INTO compras (idProveedor, fechaCompra, totalCompra, idUsuario, numeroFactura, idEstado, concepto) VALUES  (?, ?, ?, ?, ?, ?, ?)');
        const res = stmt.run(compra.idProveedor, fechaFormateada, compra.totalCompra, compra.idUsuario, compra.numeroFactura, compra.idEstado, compra.concepto);
        return {
            success: true,
            message: 'Compra insertada correctamente',
            data: res
        };
    });

    ipcMain.handle('reporte-total-compras', (event,fechaDesde, fechaHasta) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaHoy = format(zonedDate, 'yyyy-MM-dd');
        const compras = db.prepare('SELECT SUM(totalCompra) as total FROM compras WHERE DATE(fechaCompra) BETWEEN ? AND ?').all(fechaDesde, fechaHasta);
        return compras; 
    }); 

    ipcMain.handle('obtener-compras', (event,fechaDesde, fechaHasta) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');

        const compras = db.prepare('SELECT * FROM compras WHERE DATE(fechaCompra) BETWEEN ? AND ?').all(fechaDesde, fechaHasta);

        return {
            success: true,
            message: 'Compras obtenidas correctamente',
            data: compras
        };
    });

}


export {comprasController};