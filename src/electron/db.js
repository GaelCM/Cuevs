import bcrypt from 'bcryptjs';
import { app } from 'electron';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(app.getPath("userData"), "sistema-cuevs.db"); // aqui se guarda la base de datos 
const db = new Database(dbPath);
console.log("Base de datos creada en: ", dbPath);


// Tabla de Notes
db.prepare(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT
)`).run();

// Tabla de Proveedores
db.prepare(`CREATE TABLE IF NOT EXISTS proveedores (
  idProveedor INTEGER PRIMARY KEY AUTOINCREMENT,
  nombreProveedor TEXT NOT NULL,
  contacto TEXT,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  idEstado INTEGER DEFAULT 1
)`).run();

// Tabla de Productos
db.prepare(`CREATE TABLE IF NOT EXISTS productos (
  idProducto INTEGER PRIMARY KEY AUTOINCREMENT,
  nombreProducto TEXT NOT NULL,
  descripcion TEXT,
  precio REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  idProveedor INTEGER,
  idCategoria INTEGER,
  FOREIGN KEY (idProveedor) REFERENCES proveedores(idProveedor),
  FOREIGN KEY (idCategoria) REFERENCES categorias(idCategoria)
)`).run();

// Tabla de Categorías
db.prepare(`CREATE TABLE IF NOT EXISTS categorias (
  idCategoria INTEGER PRIMARY KEY AUTOINCREMENT,
  nombreCategoria TEXT NOT NULL
)`).run();

// Tabla de Usuarios
db.prepare(`CREATE TABLE IF NOT EXISTS usuarios (
  idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nombreUsuario TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol TEXT DEFAULT 'usuario',
  activo INTEGER DEFAULT 1
)`).run();

// Insertar usuario genérico si la tabla usuarios está vacía
try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get().count;
  if (userCount === 0) {
    const hash = bcrypt.hashSync('1234', 10);
    db.prepare(`INSERT INTO usuarios (usuario, password_hash, email, activo, fecha_creacion, fecha_actualizacion, nombre, apellidos) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)`)
      .run('Test', hash, 'test@example.com', 1, 'Test', 'Genérico');
    console.log('Usuario genérico creado: Test / 1234');
  }
} catch (e) {
  console.error('Error al crear usuario genérico:', e);
}

// Tabla de Ventas
db.prepare(`CREATE TABLE IF NOT EXISTS ventas (
  idVenta INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  total REAL NOT NULL,
  idUsuario INTEGER,
  FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
)`).run();

// Tabla de Detalle de Ventas (ajustada a MCP)
db.prepare(`CREATE TABLE IF NOT EXISTS detalleVentas (
  idVenta INTEGER NOT NULL,
  idProducto TEXT NOT NULL,
  cantidadProducto INTEGER NOT NULL,
  precioUnitario FLOAT NOT NULL,
  subtotal FLOAT NOT NULL
)`).run();

// Tabla de Compras
db.prepare(`CREATE TABLE IF NOT EXISTS compras (
  idCompra INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  total REAL NOT NULL,
  idProveedor INTEGER,
  FOREIGN KEY (idProveedor) REFERENCES proveedores(idProveedor)
)`).run();

// Tabla de Detalle de Compras (mantener nombre MCP si aplica)
db.prepare(`CREATE TABLE IF NOT EXISTS detalleCompras (
  idDetalle INTEGER PRIMARY KEY AUTOINCREMENT,
  idCompra INTEGER,
  idProducto INTEGER,
  cantidad INTEGER NOT NULL,
  precioUnitario REAL NOT NULL,
  FOREIGN KEY (idCompra) REFERENCES compras(idCompra),
  FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
)`).run();

// Tabla de Movimientos de Inventario
db.prepare(`CREATE TABLE IF NOT EXISTS movimientosInventario (
  idMovimiento INTEGER PRIMARY KEY AUTOINCREMENT,
  idProducto TEXT NOT NULL,
  tipoMovimiento TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  stockAnterior INTEGER NOT NULL,
  stockNuevo INTEGER NOT NULL,
  fechaMovimiento TEXT NOT NULL,
  motivo TEXT,
  idUsuario INTEGER,
  referencia TEXT
)`).run();

// Tabla de Alertas de Stock
db.prepare(`CREATE TABLE IF NOT EXISTS alertasStock (
  idAlerta INTEGER PRIMARY KEY AUTOINCREMENT,
  idProducto TEXT NOT NULL,
  tipoAlerta TEXT NOT NULL,
  fechaAlerta TEXT NOT NULL,
  mensaje TEXT,
  leida INTEGER DEFAULT 0
)`).run();

export default db;