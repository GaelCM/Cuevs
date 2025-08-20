
import { ipcMain } from "electron";
import db from "../db.js";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function deudoresController() {

    ipcMain.handle('insertarDeudor', (event,deudor) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');
        
        const stmt = db.prepare(`
            insert into deudores (nombreDeudor, isActivo, fechaCreacion) values
            (?, ?, ?)
        `);
        const res = stmt.run(
            deudor.nombreDeudor,
            deudor.isActivo,
            fechaFormateada
        );
        return {
            success: true,
            message: 'Nuevo deudor insertado correctamente',
            data: res
        };
    });

    ipcMain.handle('insertarProductoDeudor', (event,idDeudor,producto,cantidad) => {
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');

        const checkStmt = db.prepare(`SELECT * FROM detalleDeudores WHERE idDeudor = ? AND idProducto = ?`);
        const existProducto = checkStmt.get(idDeudor, producto.idProducto);

        if (existProducto) {
            const nuevaCantidad = existProducto.cantidad + cantidad;
            const nuevoSubtotal = producto.precio * nuevaCantidad;
            const stmt = db.prepare(`
                UPDATE detalleDeudores
                SET cantidad = ?, precioUnitario = ?, subtotal = ?
                WHERE idDeudor = ? AND idProducto = ?
            `);
            const res = stmt.run(
                nuevaCantidad,
                producto.precio,
                nuevoSubtotal,
                idDeudor,
                producto.idProducto
            );
            return {
                success: true,
                message: 'Producto deudor actualizado correctamente',
                data: res
            };
        }

        const stmt = db.prepare(`
            INSERT INTO detalleDeudores (idDeudor, idProducto, cantidad, precioUnitario, subtotal) VALUES
            (?, ?, ?, ?, ?)
        `);
        const res = stmt.run(
            idDeudor,
            producto.idProducto,
            cantidad,
            producto.precio,
            producto.precio * cantidad
        );
        return {
            success: true,
            message: 'Nuevo producto deudor insertado correctamente',
            data: res
        };
    });


    ipcMain.handle('obtenerDeudores', () => {
        const stmt = db.prepare(`
            SELECT*
            FROM deudores  
            ORDER BY fechaCreacion DESC;
        `);
        const res = stmt.all();
        return res;
    });

    ipcMain.handle('obtenerDeudor',(event,idDeudor)=>{
        const stmt = db.prepare(`
            SELECT*
            FROM deudores  
            where idDeudor=?
        `);
        const res = stmt.get(idDeudor);
        return res;
    })

    ipcMain.handle('obtenerDetalleDeudor',(event,idDeudor)=>{
        const stmt= db.prepare(`
            SELECT d.idDeudor, d.nombreDeudor, d.isActivo, d.fechaCreacion, 
                    dd.idProducto, dd.cantidad, dd.subtotal, p.nombreProducto, p.precio, p.descripcion
                FROM deudores d
                JOIN detalleDeudores dd ON d.idDeudor = dd.idDeudor
                JOIN productos p ON dd.idProducto = p.idProducto
                WHERE d.idDeudor = ?
                ORDER BY d.idDeudor;
        `);
        const res = stmt.all(idDeudor);
        return res;
    })

    ipcMain.handle('eliminarDeudor',(event, id) => {
        const checkStmt=db.prepare(`select count(*) as total from detalleDeudores where idDeudor=?`)
        const existDeudor=checkStmt.get(id)
        if(existDeudor.total>0){
            return{
                success: false,
                message: 'El deudor tiene productos asociados y no se puede eliminar',
                data: existDeudor.total
            }
        }
        const stmt = db.prepare('DELETE FROM deudores WHERE idDeudor = ?');
        const info = stmt.run(id);
        return {
            success: info.changes > 0,
            message: info.changes > 0 ? 'Deudor eliminado correctamente' : 'No se encontró el deudor',
            data: id
        }; 
    })

    ipcMain.handle('eliminarProductoDeudor', (event, idDeudor,idProducto) => {
        const stmt = db.prepare('DELETE FROM detalleDeudores WHERE idDeudor = ? and idProducto = ?');
        const info = stmt.run(idDeudor, idProducto);
        return {
            success: info.changes > 0,
            message: info.changes > 0 ? 'Producto eliminado correctamente del deudor' : 'No se encontró el producto para ese deudor',
            data: { idDeudor: idDeudor, idProducto: idProducto }
        };
    })





}

export { deudoresController };