import { ipcMain } from 'electron';
import db  from '../db.js';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';



const timeZone = 'America/Mexico_City';

// --- LÓGICA DE SERVICIO (REUTILIZABLE) ---

export function getFechaHoy() {
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    return format(zonedDate, 'yyyy-MM-dd');
}

// Cada consulta es ahora su propia función exportable
export function getDatosVentaPorDia(fecha) {
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
    return stmt.all(fecha);
}

export function getTopProductosVendidos(fecha) {
    const stmt = db.prepare(`
        SELECT p.nombreProducto, SUM(dv.cantidadProducto) as total_vendido, SUM(dv.subtotal) as ingresos_totales FROM detalleVentas dv 
        JOIN productos p ON dv.idProducto = p.idProducto 
        JOIN ventas v ON dv.idVenta = v.idVenta 
        WHERE DATE(v.fechaVenta) = ?
        GROUP BY p.idProducto, p.nombreProducto 
        ORDER BY total_vendido DESC LIMIT 10;
    `);
    return stmt.all(fecha);
}

export function getVentasPorHora(fecha) {
    const stmt = db.prepare(`
        SELECT CAST(strftime('%H', fechaVenta) AS INTEGER) as hora, COUNT(*) as numero_ventas, SUM(totalVenta) as total_ventas FROM ventas 
        WHERE DATE(fechaVenta) = ?
        GROUP BY CAST(strftime('%H', fechaVenta) AS INTEGER) 
        ORDER BY hora;
    `);
    return stmt.all(fecha);
}

export function getProductosMasVendidosPorCategoria(fecha) {
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
    return stmt.all(fecha);
}

export function getProductosBajoInventario() {
    const stmt = db.prepare(`
        SELECT
        idProducto, 
        nombreProducto AS nombre,
        stockActual AS stock,
        stockMinimo AS minimo,
        CASE 
            WHEN stockActual < stockMinimo * 0.3 THEN 'Agotado'
            WHEN stockActual < stockMinimo THEN 'Crítico'
            ELSE 'Normal'
        END AS criticidad
        FROM productos
        WHERE stockActual < stockMinimo
        AND idEstado = 1
        ORDER BY 
        CASE 
            WHEN stockActual < stockMinimo * 0.3 THEN 1
            ELSE 2
        END,
        stockActual ASC
        LIMIT ?;
    `);
    return stmt.all(15);
}


export function registerDashboardController(db) {

    ipcMain.handle('obtenerDatosVentaPorDIa', () => {
        const fechaHoy = getFechaHoy();
        // Simplemente llamamos a la función de servicio
        return getDatosVentaPorDia(fechaHoy);
    });

    ipcMain.handle('obtenerTopProductosVendidos', () => {
        const fechaHoy = getFechaHoy();
        return getTopProductosVendidos(fechaHoy);
    });

    ipcMain.handle('obtenerVentasPorHora', () => {
        const fechaHoy = getFechaHoy();
        return getVentasPorHora(fechaHoy);
    });

    ipcMain.handle('obtenerProductosMasVendidosPorCategoria', () => {
        const fechaHoy = getFechaHoy();
        return getProductosMasVendidosPorCategoria(fechaHoy);
    });

    ipcMain.handle('obtenerProductosBajoInventario', () => {
        // Esta no necesita fecha
        return getProductosBajoInventario();
    });
}