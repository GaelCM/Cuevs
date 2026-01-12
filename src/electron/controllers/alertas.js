import { ipcMain } from 'electron';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { getDatosVentaPorDia, getTopProductosVendidos,getProductosBajoInventario,getProductosMasVendidosPorCategoria,getVentasPorHora,getFechaHoy } from './dashboardController.js';
import db from '../db.js';


async function generarReporteStock() {
    try {
        // Usamos la función helper
        const fechaHoy = getFechaHoy();

        // 1. Llamamos a las funciones de servicio directamente
        // No necesitas 'await' si usas better-sqlite3 (que es síncrono)
        // Tampoco necesitas Promise.all
        const ventas = getDatosVentaPorDia(fechaHoy);
        const productos = getTopProductosVendidos(fechaHoy);
        const horas = getVentasPorHora(fechaHoy);
        const categorias = getProductosMasVendidosPorCategoria(fechaHoy);
        const stock = getProductosBajoInventario();
        const ventasHoy=await getVentasHoy(fechaHoy, fechaHoy);

        // 2. Enviamos el reporte
        const res = await fetch("https://cuevstiendas-n8n.xj7zln.easypanel.host/webhook/3da69f85-2ea0-4091-ab80-8f7e35cd6133", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fecha: fechaHoy, // 'fechaHoy' ya está definida
                ventasReporte: ventas,
                topProductosReporte: productos,
                ventasPorHoraReporte: horas,
                productosPorCategoriaReporte: categorias,
                productosBajoStockReporte: stock
            })
        });

        if (!res.ok) {
            return {
                success: false,
                message: `Error en la solicitud HTTP: ${res.status} ${res.statusText}`
            };
        }

        return {
            success: true,
            message: 'Reporte generado y enviado exitosamente'
        };

    } catch (error) {
        console.error('Error al generar reporte de stock:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Esta función también necesita 'db' para pasársela a generarReporteStock
function registerAlertasController(db) {
    ipcMain.handle('generar-reporte-stock', async () => {
        // Pasamos 'db' a la función
        return await generarReporteStock(db);
    });
}

export { registerAlertasController, generarReporteStock };


async function getVentasHoy(fechaDesde, fechaHasta){
    const ventas = db.prepare('SELECT * FROM ventas WHERE DATE(fechaVenta) BETWEEN ? AND ?').all(fechaDesde, fechaHasta);
    return ventas; 
}