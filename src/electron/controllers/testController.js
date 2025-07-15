import { ipcMain } from 'electron';
import db from '../db.js';


function registerTestController() {
    //esta funcion se ejecuta al iniciar la aplicacion electron y se encarga de registrar los eventos ipcMain
    ipcMain.handle('get-notes', () => { // el nombre de la funcion es el que se va a usar en el frontend para llamar a esta funcion
      const stmt = db.prepare('SELECT * FROM notes'); // esta consulta se va a ejecutar en la base de datos y se va a guardar en la variable stmt
      const res= stmt.all() ; // esta funcion se encarga de ejecutar la consulta y devolver todos los resultados
      return res; // se devuelve el resultado de la consulta
    });
  
    ipcMain.handle('add-note', (event, note) => {
      const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
      const info = stmt.run(note.title, note.content);
      return { id: info.lastInsertRowid };
    });
  
  }

export { registerTestController };