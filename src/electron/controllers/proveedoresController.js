
import { ipcMain } from 'electron';
import db from '../db.js';

function registerProveedoresController() {


    // Obtener todos los proveedores
    ipcMain.handle('get-proveedores', () => {
        const stmt = db.prepare('SELECT * FROM proveedores');
        return stmt.all();
    });

    // Obtener proveedor por ID
    ipcMain.handle('get-proveedor-by-id', (event, idProveedor) => {
        const stmt = db.prepare('SELECT * FROM proveedores WHERE idProveedor = ?');
        return stmt.get(idProveedor);
    });


    // Agregar proveedor
    ipcMain.handle('add-proveedor', (event, proveedor) => {
        const stmtCheck = db.prepare('SELECT * FROM proveedores WHERE nombreProveedor = ?');
        const proveedorExistente = stmtCheck.get(proveedor.nombreProveedor);
        if (proveedorExistente) {
            return {
                success: false,
                message: 'El proveedor con este nombre ya existe',
                data: proveedorExistente
            };
        }
        const stmt = db.prepare('INSERT INTO proveedores (nombreProveedor, contacto, telefono, email, direccion, idEstado) VALUES (?, ?, ?, ?, ?, ?)');
        const info = stmt.run(proveedor.nombreProveedor, proveedor.contacto, proveedor.telefono, proveedor.email, proveedor.direccion, proveedor.idEstado);
        return {
            success: true,
            message: 'Proveedor insertado correctamente',
            data: { idProveedor: info.lastInsertRowid, ...proveedor }
        };
    });

    // Actualizar proveedor
    ipcMain.handle('update-proveedor', (event, proveedor) => {
        const stmt = db.prepare('UPDATE proveedores SET nombreProveedor = ?, contacto = ?, telefono = ?, email = ?, direccion = ?, idEstado = ? WHERE idProveedor = ?');
        const info = stmt.run(proveedor.nombreProveedor, proveedor.contacto, proveedor.telefono, proveedor.email, proveedor.direccion, proveedor.idEstado, proveedor.idProveedor);
        return {
            success: info.changes > 0,
            message: info.changes > 0 ? 'Proveedor actualizado correctamente' : 'No se encontró el proveedor',
            data: proveedor
        };
    });

    // Eliminar proveedor
    ipcMain.handle('delete-proveedor', (event, idProveedor) => {
        const stmt = db.prepare('DELETE FROM proveedores WHERE idProveedor = ?');
        const info = stmt.run(idProveedor);
        return {
            success: info.changes > 0,
            message: info.changes > 0 ? 'Proveedor eliminado correctamente' : 'No se encontró el proveedor',
            data: idProveedor
        };
    });



}

export {registerProveedoresController};