import { ipcMain } from 'electron';
import db  from '../db.js';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function registerProductosController() {

    ipcMain.handle('get-productos', () => {
        const stmt = db.prepare('SELECT * FROM productos');
        const res = stmt.all();
        return res;
    });

    ipcMain.handle('get-producto', (event, id) => {
        const stmt = db.prepare('SELECT * FROM productos WHERE idProducto = ?');
        const res = stmt.get(id); // si esperas 1 resultado
        return res;
    });

    ipcMain.handle('insertar-producto', (event, producto, idUsuario) => {
    const stmtCheck = db.prepare('SELECT * FROM productos WHERE idProducto = ?');
    const productoExistente = stmtCheck.get(producto.idProducto);
    
    if (productoExistente) {
        return {
            success: false,
            message: 'El producto con este ID ya existe',
            data: productoExistente
        };
    }

    const stmt = db.prepare(`
        INSERT INTO productos (
            idProducto, nombreProducto, precio, descripcion, idCategoria, idEstado,
            stockActual, stockMinimo, stockMaximo, unidadMedida
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const res = stmt.run(
        producto.idProducto,
        producto.nombreProducto,
        producto.precio,
        producto.descripcion,
        producto.idCategoria,
        producto.idEstado,
        producto.stockActual || 0,           // Stock inicial, por defecto 0
        producto.stockMinimo || 3,           // Stock mínimo por defecto 3
        producto.stockMaximo || 30,          // Stock máximo por defecto 30
        producto.unidadMedida || 'unidad'    // Unidad por defecto 'unidad'
    );

    // Registrar movimiento inicial si hay stock inicial
    if (producto.stockActual && producto.stockActual > 0) {

        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');

        const stmtMovimiento = db.prepare(`
            INSERT INTO movimientosInventario (
                idProducto, tipoMovimiento, cantidad, stockAnterior, stockNuevo,
                fechaMovimiento, motivo, idUsuario, referencia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmtMovimiento.run(
            producto.idProducto,
            'entrada',
            producto.stockActual,
            0,
            producto.stockActual,
            fechaFormateada,
            'Stock inicial',
            idUsuario,
            'INICIAL-' + producto.idProducto
        );
    }

    return {
        success: true,
        message: 'Producto insertado correctamente',
        data: res
    };
    });

    ipcMain.handle('update-producto', (event, producto,idUsuario) => {
    // Obtener el stock actual antes de la actualización
    const stmtGetStock = db.prepare('SELECT stockActual FROM productos WHERE idProducto = ?');
    const stockAnterior = stmtGetStock.get(producto.idProducto);
    
    const stmt = db.prepare(`
        UPDATE productos SET 
            nombreProducto = ?, precio = ?, descripcion = ?, idCategoria = ?, idEstado = ?,
            stockActual = ?, stockMinimo = ?, stockMaximo = ?, unidadMedida = ?
        WHERE idProducto = ?
    `);
    
    const res = stmt.run(
        producto.nombreProducto,
        producto.precio,
        producto.descripcion,
        producto.idCategoria,
        producto.idEstado,
        producto.stockActual !== undefined ? producto.stockActual : stockAnterior?.stockActual || 0,
        producto.stockMinimo !== undefined ? producto.stockMinimo : 3,
        producto.stockMaximo !== undefined ? producto.stockMaximo : 30,
        producto.unidadMedida || 'unidad',
        producto.idProducto
    );

    // Si se modificó el stock, registrar el movimiento
    if (producto.stockActual !== undefined && stockAnterior && producto.stockActual !== stockAnterior.stockActual) {
        const diferencia = producto.stockActual - stockAnterior.stockActual;
        const tipoMovimiento = diferencia > 0 ? 'entrada' : 'salida';

        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');
        
        const stmtMovimiento = db.prepare(`
            INSERT INTO movimientosInventario (
                idProducto, tipoMovimiento, cantidad, stockAnterior, stockNuevo,
                fechaMovimiento, motivo, idUsuario, referencia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmtMovimiento.run(
            producto.idProducto,
            tipoMovimiento,
            Math.abs(diferencia),
            stockAnterior.stockActual,
            producto.stockActual,
            fechaFormateada,
            'Ajuste de stock manual',
            idUsuario,
            'AJUSTE-' + producto.idProducto
        );
    }

    return {
        success: true,
        message: 'Producto actualizado correctamente',
        data: res
    };
    });


    ipcMain.handle('delete-producto', (event, id) => {
        const stmt = db.prepare('DELETE FROM productos WHERE idProducto = ?');
        const res = stmt.run(id);
        if(res.changes===0){
            return {
                success: false,
                message: 'Producto no eliminado',
                data: res
            };
        }
        return {
            success: true,
            message: 'Producto eliminado correctamente',
            data: res
        };
    });
    
    
    ipcMain.handle('get-productos-x-categoria', (event, idCategoria) => {
        const stmt = db.prepare('SELECT * FROM productos WHERE idCategoria = ?');
        const res = stmt.all(idCategoria);
        return res;
    });
     

}

export { registerProductosController };