import { ipcMain } from 'electron';
import db  from '../db.js';


function registerDashboardController(){

    ipcMain.handle('obtenerDatosVentaPorDIa', () => {
        const stmt = db.prepare(`
            SELECT 
                DATE(fechaVenta) as fecha, 
                SUM(totalVenta) as monto_total_ventas, 
                COUNT(*) as numero_ventas 
            FROM ventas 
            WHERE DATE(fechaVenta) BETWEEN '2025-07-09' AND '2025-07-09' 
            GROUP BY DATE(fechaVenta) 
            ORDER BY fecha;
        `);
        const res = stmt.all();
        return res;
    });

    ipcMain.handle('obtenerTopProductosVendidos', () => {
        const stmt = db.prepare(`
            SELECT p.nombreProducto, SUM(dv.cantidadProducto) as total_vendido, SUM(dv.subtotal) as ingresos_totales FROM detalleVentas dv 
            JOIN productos p ON dv.idProducto = p.idProducto 
            JOIN ventas v ON dv.idVenta = v.idVenta 
            WHERE DATE(v.fechaVenta) 
            BETWEEN '2025-07-09' AND '2025-07-09' 
            GROUP BY p.idProducto, p.nombreProducto 
            ORDER BY total_vendido DESC LIMIT 10;
        `);
        const res = stmt.all();
        return res;
    });


    ipcMain.handle('obtenerVentasPorHora', () => {
        const stmt = db.prepare(`
            SELECT CAST(strftime('%H', fechaVenta) AS INTEGER) as hora, COUNT(*) as numero_ventas, SUM(totalVenta) as total_ventas FROM ventas 
            WHERE DATE(fechaVenta) 
            BETWEEN '2025-07-09' AND '2025-07-09' 
            GROUP BY CAST(strftime('%H', fechaVenta) AS INTEGER) 
            ORDER BY hora;
        `);
        const res = stmt.all();
        return res;
    });

    ipcMain.handle('obtenerProductosMasVendidosPorCategoria', () => {
        const stmt = db.prepare(`
            WITH ProductosPorCategoria AS ( SELECT c.categoriaName, p.nombreProducto, SUM(dv.cantidadProducto) as total_vendido, ROW_NUMBER() OVER (PARTITION BY c.idCategoria ORDER BY SUM(dv.cantidadProducto) DESC) as rn 
            FROM detalleVentas dv JOIN productos p ON dv.idProducto = p.idProducto 
            JOIN categorias c ON p.idCategoria = c.idCategoria 
            JOIN ventas v ON dv.idVenta = v.idVenta WHERE DATE(v.fechaVenta) 
            BETWEEN '2025-07-01' AND '2025-07-04' 
            GROUP BY c.idCategoria, c.categoriaName, p.idProducto, p.nombreProducto ) 
            SELECT categoriaName, nombreProducto, total_vendido FROM ProductosPorCategoria 
            WHERE rn = 1 
            ORDER BY total_vendido DESC;
        `);
        const res = stmt.all();
        return res;
    });




}

export {registerDashboardController};