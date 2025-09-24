import { ipcMain } from 'electron';
import db  from '../db.js';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function registerDashboardController(){
    const timeZone = 'America/Mexico_City';

    ipcMain.handle('obtenerDatosVentaPorDIa', () => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaHoy = format(zonedDate, 'yyyy-MM-dd');
        
        const stmt = db.prepare(`
            SELECT 
                DATE(fechaVenta) as fecha, 
                SUM(totalVenta) as monto_total_ventas, 
                COUNT(*) as numero_ventas,
                SUM(CASE WHEN tipoPago = 0 THEN totalVenta ELSE 0 END) as ventasEfectivo,
                SUM(CASE WHEN tipoPago = 1 THEN totalVenta ELSE 0 END) as ventasTarjeta 
            FROM ventas 
            WHERE DATE(fechaVenta) = ? 
            GROUP BY DATE(fechaVenta) 
            ORDER BY fecha;
        `);
        const res = stmt.all(fechaHoy);
        return res;
    });

    ipcMain.handle('obtenerTopProductosVendidos', () => {
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaHoy = format(zonedDate, 'yyyy-MM-dd');
        
        const stmt = db.prepare(`
            SELECT p.nombreProducto, SUM(dv.cantidadProducto) as total_vendido, SUM(dv.subtotal) as ingresos_totales FROM detalleVentas dv 
            JOIN productos p ON dv.idProducto = p.idProducto 
            JOIN ventas v ON dv.idVenta = v.idVenta 
            WHERE DATE(v.fechaVenta) = ?
            GROUP BY p.idProducto, p.nombreProducto 
            ORDER BY total_vendido DESC LIMIT 10;
        `);
        const res = stmt.all(fechaHoy);
        return res;
    });


    ipcMain.handle('obtenerVentasPorHora', () => {
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaHoy = format(zonedDate, 'yyyy-MM-dd');
        
        const stmt = db.prepare(`
            SELECT CAST(strftime('%H', fechaVenta) AS INTEGER) as hora, COUNT(*) as numero_ventas, SUM(totalVenta) as total_ventas FROM ventas 
            WHERE DATE(fechaVenta) = ?
            GROUP BY CAST(strftime('%H', fechaVenta) AS INTEGER) 
            ORDER BY hora;
        `);
        const res = stmt.all(fechaHoy);
        return res;
    });

    ipcMain.handle('obtenerProductosMasVendidosPorCategoria', () => {
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaHoy = format(zonedDate, 'yyyy-MM-dd');
        const stmt = db.prepare(`
            WITH ProductosPorCategoria AS ( SELECT c.categoriaName, p.nombreProducto, SUM(dv.cantidadProducto) as total_vendido, ROW_NUMBER() OVER (PARTITION BY c.idCategoria ORDER BY SUM(dv.cantidadProducto) DESC) as rn 
            FROM detalleVentas dv JOIN productos p ON dv.idProducto = p.idProducto 
            JOIN categorias c ON p.idCategoria = c.idCategoria 
            JOIN ventas v ON dv.idVenta = v.idVenta WHERE DATE(v.fechaVenta) = ? 
            GROUP BY c.idCategoria, c.categoriaName, p.idProducto, p.nombreProducto ) 
            SELECT categoriaName, nombreProducto, total_vendido FROM ProductosPorCategoria 
            WHERE rn = 1 
            ORDER BY total_vendido DESC;
        `);
        const res = stmt.all(fechaHoy);
        return res;
    });




}

export {registerDashboardController};