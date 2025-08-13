import { ipcMain } from "electron";
import db from "../db.js";

function registerInventarioController(){

    ipcMain.handle('obtenerDatosStockPorCategorias', () => {
        const stmt = db.prepare(`
            SELECT 
                COALESCE(c.categoriaName, 'Sin Categoría') as categoria,
                COUNT(p.idProducto) as total_productos,
                SUM(p.stockActual) as stock_total,
                SUM(p.stockActual * p.precio) as valor_inventario,
                ROUND(AVG(p.stockActual), 2) as stock_promedio,
                SUM(CASE WHEN p.stockActual <= p.stockMinimo THEN 1 ELSE 0 END) as productos_bajo_minimo,
                SUM(CASE WHEN p.stockActual >= p.stockMaximo THEN 1 ELSE 0 END) as productos_sobre_maximo
            FROM productos p
            LEFT JOIN categorias c ON p.idCategoria = c.idCategoria
            WHERE p.idEstado = 1 -- Solo productos activos
            GROUP BY p.idCategoria, c.categoriaName
            ORDER BY valor_inventario DESC;
        `);
        const res = stmt.all();
        return res;
    });

    ipcMain.handle('obtenerDatosStockGeneral', () => {
        const stmt = db.prepare(`
            SELECT 
                COUNT(idProducto) as total_productos,
                SUM(stockActual) as stock_total_general,
                ROUND(SUM(stockActual * precio), 2) as valor_total_inventario,
                ROUND(AVG(precio), 2) as precio_promedio,
                SUM(CASE WHEN stockActual <= stockMinimo THEN 1 ELSE 0 END) as alertas_stock_minimo,
                SUM(CASE WHEN stockActual = 0 THEN 1 ELSE 0 END) as productos_agotados,
                ROUND(SUM(CASE WHEN stockActual > 0 THEN stockActual * precio ELSE 0 END), 2) as valor_disponible
            FROM productos 
            WHERE idEstado = 1;
        `);
        const res = stmt.all();
        return res;
    });


    ipcMain.handle('productosConMayorRotacionPorMes', () => {
        const stmt = db.prepare(`
           SELECT 
                p.idProducto,
                p.nombreProducto,
                c.categoriaName as categoria,
                p.stockActual,
                COALESCE(SUM(dv.cantidadProducto), 0) as total_vendido,
                ROUND(COALESCE(SUM(dv.subtotal), 0), 2) as ingresos_generados,
                ROUND(COALESCE(AVG(dv.precioUnitario), 0), 2) as precio_promedio_venta,
                COUNT(DISTINCT v.idVenta) as numero_transacciones
            FROM productos p
            LEFT JOIN categorias c ON p.idCategoria = c.idCategoria
            LEFT JOIN detalleVentas dv ON p.idProducto = dv.idProducto
            LEFT JOIN ventas v ON dv.idVenta = v.idVenta 
                AND v.fechaVenta >= date('now', '-30 days')
                AND v.idStatusVenta = 1
            WHERE p.idEstado = 1
            GROUP BY p.idProducto, p.nombreProducto, c.categoriaName, p.stockActual
            ORDER BY total_vendido DESC
            LIMIT 10;
        `);
        const res = stmt.all();
        return res;
    });

    ipcMain.handle('productosConMenorRotacionPorMes', () => {
        const stmt = db.prepare(`
            SELECT 
                p.idProducto,
                p.nombreProducto,
                c.categoriaName as categoria,
                p.stockActual,
                p.stockActual * p.precio as valor_inmovilizado,
                COALESCE(SUM(dv.cantidadProducto), 0) as total_vendido,
                COALESCE(MAX(v.fechaVenta), 'Nunca') as ultima_venta
            FROM productos p
            LEFT JOIN categorias c ON p.idCategoria = c.idCategoria
            LEFT JOIN detalleVentas dv ON p.idProducto = dv.idProducto
            LEFT JOIN ventas v ON dv.idVenta = v.idVenta 
                AND v.idStatusVenta = 1
            WHERE p.idEstado = 1
            GROUP BY p.idProducto, p.nombreProducto, c.categoriaName, p.stockActual, p.precio
            HAVING total_vendido = 0 OR MAX(v.fechaVenta) <= date('now', '-30 days')
            ORDER BY valor_inmovilizado DESC;
        `);
        const res = stmt.all();
        return res;
    });

    
    ipcMain.handle('movimientosInventarioPorDia', () => {
        const stmt = db.prepare(`  
            SELECT 
                DATE(mi.fechaMovimiento) as fecha,
                mi.tipoMovimiento,
                COUNT(*) as numero_movimientos,
                SUM(mi.cantidad) as cantidad_total
            FROM movimientosInventario mi
            WHERE DATE(mi.fechaMovimiento) = date('now')
            GROUP BY DATE(mi.fechaMovimiento), mi.tipoMovimiento
            ORDER BY fecha DESC, mi.tipoMovimiento;
        `);
        const res = stmt.all();
        return res;
    });




}

export { registerInventarioController };