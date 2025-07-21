import { ipcMain } from 'electron';
import db  from '../db.js';

function registerCategoriasController(){

    ipcMain.handle('get-categorias', () => {
        const stmt = db.prepare('SELECT * FROM categorias');
        const res = stmt.all(); // aqui se obtiene todas las categorias el .all() es para obtener todas las categorias
        return res;
    });

    ipcMain.handle('insertar-categoria', (event, categoria) => {

        const stmtCheck = db.prepare('SELECT * FROM categorias WHERE categoriaName == ? OR idCategoria == ?');
        const categoriaExistente = stmtCheck.get(categoria.categoriaName,categoria.idCategoria); //el get es para obtener un solo resultado de la consulta y el all es para obtener todos los resultados de la consulta y 
        //lo que esta dentro del get es el idProducto que se esta pasando por el producto esto

        if (categoriaExistente) {
            return {
                success: false,
                message: 'La categoria con este ID ya existe o el nombre de la categoria ya existe',
                data: categoriaExistente
            };
        }

        const stmt = db.prepare('INSERT INTO categorias VALUES (?, ?)');
        const res = stmt.run(categoria.idCategoria, categoria.categoriaName);
        return {
            success: true,
            message: 'Categoria insertada correctamente',
            data: res
        };
    });

    ipcMain.handle('get-categoria-by-id', (event, idCategoria) => {
        const stmt = db.prepare('SELECT * FROM categorias WHERE idCategoria = ?');
        const res = stmt.get(idCategoria);
        return res;
    });

    ipcMain.handle('update-categoria', (event, categoria) => {
        const stmtCheck = db.prepare('SELECT * FROM categorias WHERE idCategoria = ?');
        const categoriaExistente = stmtCheck.get(categoria.idCategoria);

        if (!categoriaExistente) {
            return {
                success: false,
                message: 'La categoria no existe',
                data: null
            };
        }

        const stmt = db.prepare('UPDATE categorias SET categoriaName = ? WHERE idCategoria = ?');
        const res = stmt.run(categoria.categoriaName, categoria.idCategoria);
        return {
            success: true,
            message: 'Categoria actualizada correctamente',
            data: res
        };
    });

    ipcMain.handle('delete-categoria', (event, idCategoria) => {
        const stmtCheck = db.prepare('SELECT * FROM productos WHERE idCategoria = ?');
        const productoExistente = stmtCheck.get(idCategoria);

        if (productoExistente) {
            return {
                success: false,
                message: 'No se puede eliminar la categoria porque tiene productos asociados',
                data: null
            };
        }

        const stmt = db.prepare('DELETE FROM categorias WHERE idCategoria = ?');
        const res = stmt.run(idCategoria);
        return {
            success: true,
            message: 'Categoria eliminada correctamente',
            data: res
        };
    });



}



export {registerCategoriasController};

