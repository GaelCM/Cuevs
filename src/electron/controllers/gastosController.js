import { ipcMain } from "electron";
import db from "../db.js";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function gastosController(){

    ipcMain.handle('insertar-gasto', (event, gasto) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');

        const stmt = db.prepare('INSERT INTO gastos (fechaRegistro, monto, concepto) VALUES  (?, ?, ?)');
        const res = stmt.run(fechaFormateada, gasto.monto, gasto.concepto);
        return {
            success: true,
            message: 'gasto insertada correctamente',
            data: res
        };
    });

    ipcMain.handle('reporte-total-gastos', (event,fechaDesde, fechaHasta) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaHoy = format(zonedDate, 'yyyy-MM-dd');
        const gastos = db.prepare('SELECT SUM(monto) as total FROM gastos WHERE DATE(fechaRegistro) BETWEEN ? AND ?').all(fechaDesde, fechaHasta);
        return gastos; 
    }); 

    ipcMain.handle('obtener-gastos', (event,fechaDesde, fechaHasta) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');

        const gastos = db.prepare('SELECT * FROM gastos WHERE DATE(fechaRegistro) BETWEEN ? AND ?').all(fechaDesde, fechaHasta);

        return {
            success: true,
            message: 'gastos obtenidas correctamente',
            data: gastos
        };
    });

}

export {gastosController};