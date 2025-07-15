import { ipcMain } from 'electron';
import db  from '../db.js';

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

    ipcMain.handle('insertar-producto', (event, producto) => {
        const stmtCheck = db.prepare('SELECT * FROM productos WHERE idProducto = ?');
        const productoExistente = stmtCheck.get(producto.idProducto); //el get es para obtener un solo resultado de la consulta y el all es para obtener todos los resultados de la consulta y 
        //lo que esta dentro del get es el idProducto que se esta pasando por el producto esto

        if (productoExistente) {
            return {
                success: false,
                message: 'El producto con este ID ya existe',
                data: productoExistente
            };
        }

        const stmt = db.prepare('INSERT INTO productos (idProducto, nombreProducto, precio, descripcion, idCategoria, idEstado) VALUES (?, ?, ?, ?, ?, ?)');
        const res = stmt.run(producto.idProducto, producto.nombreProducto, producto.precio, producto.descripcion, producto.idCategoria, producto.idEstado);
        return {
            success: true,
            message: 'Producto insertado correctamente',
            data: res
        };
    });

    ipcMain.handle('update-producto', (event, producto) => {
        const stmt = db.prepare('UPDATE productos SET nombreProducto = ?, precio = ?, descripcion = ?, idCategoria = ?, idEstado = ? WHERE idProducto = ?');
        const res = stmt.run(producto.nombreProducto, producto.precio, producto.descripcion, producto.idCategoria, producto.idEstado, producto.idProducto);
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
    
    
}

export { registerProductosController };