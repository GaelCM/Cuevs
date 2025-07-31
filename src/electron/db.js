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
  idProveedor INTEGER PRIMARY KEY,
  nombreProveedor TEXT NOT NULL,
  contacto TEXT,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  idEstado INTEGER DEFAULT 1
)`).run();

// Tabla de Categorías
db.prepare(`CREATE TABLE IF NOT EXISTS categorias (
  idCategoria INT PRIMARY KEY,
  categoriaName varchar(50)
)`).run();

// Tabla de Productos
db.prepare(`CREATE TABLE IF NOT EXISTS productos (
  idProducto TEXT PRIMARY KEY,
  nombreProducto TEXT,
  precio REAL,
  descripcion TEXT,
  idCategoria INTEGER,
  idEstado INTEGER,
  stockActual INTEGER DEFAULT 0,
  stockMinimo INTEGER DEFAULT 0,
  stockMaximo INTEGER DEFAULT 0,
  unidadMedida TEXT DEFAULT 'unidad'
)`).run();

// Tabla de Usuarios
db.prepare(`CREATE TABLE IF NOT EXISTS usuarios (
  idUsuario INTEGER PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(100),
  activo BOOLEAN DEFAULT 1,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  nombre VARCHAR(100),
  apellidos VARCHAR(100)
)`).run();

// Insertar usuario genérico si la tabla usuarios está vacía
try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get().count;
  if (userCount === 0) {
    const hash = bcrypt.hashSync('1234', 10);
    db.prepare(`INSERT INTO usuarios (usuario, password_hash, email, activo, nombre, apellidos) VALUES (?, ?, ?, ?, ?, ?)`)
      .run('Test', hash, 'test@example.com', 1, 'Test', 'Genérico');
    console.log('Usuario genérico creado: Test / 1234');
  }
} catch (e) {
  console.error('Error al crear usuario genérico:', e);
}


// Tabla de Ventas
db.prepare(`CREATE TABLE IF NOT EXISTS ventas (
  idVenta INTEGER PRIMARY KEY,
  fechaVenta TEXT NOT NULL,
  totalVenta float NOT NULL,
  idUsuario INTEGER,
  idStatusVenta INTEGER,
  pagoVenta REAL,
  cambioVenta REAL
)`).run();

// Tabla de Detalle de Ventas
db.prepare(`CREATE TABLE IF NOT EXISTS detalleVentas (
  idVenta INTEGER NOT NULL,
  idProducto TEXT NOT NULL,
  cantidadProducto INTEGER NOT NULL,
  precioUnitario float NOT NULL,
  subtotal float NOT NULL
)`).run();

// Tabla de Compras
db.prepare(`CREATE TABLE IF NOT EXISTS compras (
  idCompra INTEGER PRIMARY KEY,
  idProveedor INTEGER NOT NULL,
  fechaCompra TEXT NOT NULL,
  totalCompra REAL NOT NULL,
  idUsuario INTEGER,
  numeroFactura TEXT,
  idEstado INTEGER DEFAULT 1
)`).run();

// Tabla de Detalle de Compras
db.prepare(`CREATE TABLE IF NOT EXISTS detalleCompras (
  idDetalle INTEGER PRIMARY KEY,
  idCompra INTEGER,
  idProducto INTEGER,
  cantidad INTEGER NOT NULL,
  precioUnitario REAL NOT NULL
)`).run();

// Tabla de Movimientos de Inventario
db.prepare(`CREATE TABLE IF NOT EXISTS movimientosInventario (
  idMovimiento INTEGER PRIMARY KEY,
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
  idAlerta INTEGER PRIMARY KEY,
  idProducto TEXT NOT NULL,
  tipoAlerta TEXT NOT NULL,
  fechaAlerta TEXT NOT NULL,
  mensaje TEXT,
  leida INTEGER DEFAULT 0
)`).run();

export default db;