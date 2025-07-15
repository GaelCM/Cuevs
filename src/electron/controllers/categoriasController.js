import { ipcMain } from 'electron';
import db  from '../db.js';

function registerCategoriasController(){

    ipcMain.handle('get-categorias', () => {
        const stmt = db.prepare('SELECT * FROM categorias');
        const res = stmt.all(); // aqui se obtiene todas las categorias el .all() es para obtener todas las categorias
        return res;
    });
}



export {registerCategoriasController};

