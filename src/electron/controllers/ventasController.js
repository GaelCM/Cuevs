import { ipcMain } from 'electron';
import db  from '../db.js';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function registerVentasController() {

    ipcMain.handle('nueva-venta', (event, totalVenta, idUsuario, status, productos, pago) => {
    
        const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');
      
        let cambioVenta=0
            if(!pago || pago < totalVenta){
                cambioVenta=0
            }else{
                cambioVenta=pago - totalVenta
            }
      
        
        const insertVenta = db.prepare(`
          INSERT INTO ventas (fechaVenta, totalVenta, idUsuario, idStatusVenta, pagoVenta, cambioVenta)
          VALUES (?, ?, ?, ?, ?, ?)
        `); // aqui se prepara la consulta para insertar la venta en la tabla ventas
      
        const getLastId = db.prepare('SELECT last_insert_rowid() as idVenta'); // aqui se prepara la consulta para obtener el id de la venta
      
        const insertDetalle = db.prepare(`
          INSERT INTO detalleVentas (idVenta, idProducto, cantidadProducto, precioUnitario, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `); // aqui se prepara la consulta para insertar los detalles de la venta en la tabla detalleVentas 

        // Nuevas consultas para gestión de stock
        const getStock = db.prepare('SELECT stockActual, nombreProducto FROM productos WHERE idProducto = ?'); // aqui se prepara la consulta para obtener el stock actual de un producto
        const updateStock = db.prepare('UPDATE productos SET stockActual = ? WHERE idProducto = ?');// aqui se prepara la consulta para actualizar el stock de un producto
        const insertMovimiento = db.prepare(` 
          INSERT INTO movimientosInventario (idProducto, tipoMovimiento, cantidad, stockAnterior, stockNuevo, fechaMovimiento, motivo, idUsuario, referencia)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `); // aqui se prepara la consulta para insertar un movimiento de inventario
      
        const transact = db.transaction(() => {

          // 1. Verificar stock disponible antes de procesar la venta
          for (const producto of productos) {
              const productInfo = getStock.get(producto.product.idProducto);
              
              if (!productInfo) {
                  throw new Error(`Producto con ID ${producto.product.idProducto} no encontrado`);
              }
              
              if (productInfo.stockActual < producto.quantity) {
                  throw new Error(
                      `Stock insuficiente para el producto "${productInfo.nombreProducto || 'ID: ' + producto.product.idProducto}". 
                      Stock disponible: ${productInfo.stockActual}, Cantidad solicitada: ${producto.quantity}`
                  );
              }
          }

          insertVenta.run(fechaFormateada, totalVenta, idUsuario, status, pago, cambioVenta);
          const { idVenta } = getLastId.get();
      
          for (const producto of productos) {
            const subtotal = producto.product.precio * producto.quantity; // aqui se calcula el subtotal de la venta
            insertDetalle.run(
              idVenta,
              producto.product.idProducto,
              producto.quantity,
              producto.product.precio,
              subtotal
            );

            // Obtener stock actual y calcular nuevo stock
            const productInfo = getStock.get(producto.product.idProducto);

            const stockAnterior = productInfo.stockActual;

            const stockNuevo = stockAnterior - producto.quantity;

            // Actualizar stock del producto
            updateStock.run(stockNuevo, producto.product.idProducto);

            // Registrar el movimiento de inventario
            insertMovimiento.run(
                producto.product.idProducto,
                'salida',
                producto.quantity,
                stockAnterior,
                stockNuevo,
                fechaFormateada,
                'Venta del producto',
                idUsuario,
                `VENTA-${idVenta}`
            );

          }
      
          return idVenta;
        });
      
        try {
          const idVenta = transact();
          return {
            success: true,
            message: 'Nueva venta creada',
            data: idVenta
          };
        } catch (error) {
          console.error('Error durante la transacción de venta:', error);
          return {
            success: false,
            message: 'ERROR al crear la venta',
            error: error.message
          };
        }
      });

    ipcMain.handle('reporte-ventas', (event, fechaDesde, fechaHasta) => {
        const ventas = db.prepare('SELECT * FROM ventas WHERE DATE(fechaVenta) BETWEEN ? AND ?').all(fechaDesde, fechaHasta);
        return ventas; 
      });  

    ipcMain.handle('detalle-venta', (event, idVenta) => {
        const detalles = db.prepare(`
            SELECT 
                v.idVenta,
                v.fechaVenta,
                v.totalVenta,
                v.pagoVenta,
                v.cambioVenta,
                v.idUsuario,
                v.idStatusVenta,
                p.nombreProducto,
                dv.cantidadProducto,
                dv.precioUnitario,
                dv.subtotal,
                p.descripcion
            FROM ventas v
            INNER JOIN detalleVentas dv ON v.idVenta = dv.idVenta
            INNER JOIN productos p ON dv.idProducto = p.idProducto
            WHERE v.idVenta = ?
            ORDER BY p.nombreProducto
        `).all(idVenta);
        return detalles;
    });
}

export { registerVentasController };