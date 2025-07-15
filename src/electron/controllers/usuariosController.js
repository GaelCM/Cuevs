
import { ipcMain } from 'electron';
import db from '../db.js';

function registerUsuariosController(){

    ipcMain.handle('get-usuarios', () => {
        const stmt = db.prepare('SELECT * FROM usuarios');
        const res = stmt.all(); // aqui se obtiene todas las categorias el .all() es para obtener todas las categorias
       // Mapear a UsuarioPublico (sin password_hash)
        const usuariosPublicos = res.map(usuario => ({
            id: usuario.id,
            usuario: usuario.usuario,
            email: usuario.email,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            activo: !!usuario.activo,
            fecha_creacion: usuario.fecha_creacion,
            fecha_actualizacion: usuario.fecha_actualizacion
        }));

        return usuariosPublicos;
    });


    ipcMain.handle('insertar-usuario', (event, usuario) => {
        // Verificar si el usuario ya existe
        const stmtCheck = db.prepare('SELECT * FROM usuarios WHERE usuario = ?');
        const usuarioExistente = stmtCheck.get(usuario.usuario);

        if (usuarioExistente) {
            return {
                success: false,
                message: 'Este usuario ya existe',
                data: usuarioExistente
            };
        }

        // Fechas en formato ISO
        const fechaActual = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO usuarios 
            (usuario, password_hash, email, nombre, apellidos, activo, fecha_creacion, fecha_actualizacion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const res = stmt.run(
            usuario.usuario,
            usuario.password_hash,
            usuario.email,
            usuario.nombre,
            usuario.apellidos,
            usuario.activo ? 1 : 0,
            fechaActual,
            fechaActual
        );

        return {
            success: true,
            message: 'Usuario insertado correctamente',
            data: res
        };
    });
}

export {registerUsuariosController};