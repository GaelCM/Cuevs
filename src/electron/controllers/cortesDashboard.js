import { ipcMain } from "electron";
import db from "../db.js";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function cortesDashboardController(){

    ipcMain.handle("detalle-cortes",(event,fechaInicio,fechaFin)=>{
        // Detalle de cortes
        const cortesStmt = db.prepare(`
            SELECT 
                c.idCorte,
                u.nombre as usuario,
                c.fechaApertura,
                c.fechaCierre,
                ROUND((julianday(c.fechaCierre) - julianday(c.fechaApertura)) * 24 * 60, 2) as duracion_minutos,
                c.montoInicialEfectivo,
                c.totalVentas,
                c.totalCompras,
                (c.ventasEfectivo - c.totalCompras) as balance_operacional,
                c.ventasEfectivo,
                c.ventasTarjeta,
                c.montoFinalEfectivo,
                c.diferencia,
                CASE 
                    WHEN c.diferencia > 100 THEN 'ALTA DIFERENCIA'
                    WHEN c.diferencia > 50 THEN 'DIFERENCIA MEDIA'
                    WHEN c.diferencia > 0 THEN 'DIFERENCIA BAJA'
                    WHEN c.diferencia = 0 THEN 'EXACTO'
                    ELSE 'FALTANTE'
                END as categoria_diferencia,
                c.observaciones,
                c.estado
            FROM cortesCaja c 
            LEFT JOIN usuarios u ON c.idUsuario = u.idUsuario
            WHERE DATE(c.fechaApertura) BETWEEN ? AND ?
            ORDER BY c.fechaApertura DESC
        `);
        
        const cortes = cortesStmt.all(fechaInicio, fechaFin);

        return {
            success: true,
            messagge:"reporte obtenido correctamente",
            data: cortes
        };
    })

    ipcMain.handle("resumen-diario-cortes",(event,fechaInicio,fechaFin)=>{
        // Detalle de cortes
        const cortesStmt = db.prepare(`
            SELECT 
                DATE(fechaApertura) as fecha,
                COUNT(*) as total_cortes,
                AVG(totalVentas) as promedio_ventas_por_corte,
                MAX(totalVentas) as mejor_venta,
                MIN(totalVentas) as menor_venta,
                SUM(CASE WHEN diferencia > 0 THEN 1 ELSE 0 END) as cortes_con_sobrante,
                SUM(CASE WHEN diferencia < 0 THEN 1 ELSE 0 END) as cortes_con_faltante,
                SUM(CASE WHEN diferencia = 0 THEN 1 ELSE 0 END) as cortes_exactos,
                AVG(ROUND((julianday(fechaCierre) - julianday(fechaApertura)) * 24 * 60, 2)) as duracion_promedio_minutos,
                ROUND((SUM(ventasEfectivo) / SUM(totalVentas)) * 100, 2) as porcentaje_efectivo,
                ROUND((SUM(ventasTarjeta) / SUM(totalVentas)) * 100, 2) as porcentaje_tarjeta
            FROM cortesCaja
            WHERE DATE(fechaApertura) BETWEEN ? AND ?
            AND totalVentas > 0
            GROUP BY DATE(fechaApertura)
            ORDER BY fecha DESC;
        `);
        
        const cortes = cortesStmt.all(fechaInicio, fechaFin);

        return {
            success: true,
            messagge:"reporte diario de cortes obtenido correctamente",
            data: cortes
        };
    })


}

export {cortesDashboardController}