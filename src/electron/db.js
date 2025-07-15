import { app } from 'electron';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(app.getPath("userData"), "sistema-cuevs.db"); // aqui se guarda la base de datos 
const db = new Database(dbPath);
console.log("Base de datos creada en: ", dbPath);

// Crear tabla
db.prepare(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT
  )`).run();

export default db;