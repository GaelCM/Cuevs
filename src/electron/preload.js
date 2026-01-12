import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {

    //aqui se exponen las funciones que se van a usar en el frontend para comunicarse con el backend
    getNotes: () => ipcRenderer.invoke('get-notes'),
    addNote: (note) => ipcRenderer.invoke('add-note', note),
    //////////////productos/////////////////
    getProductos: () => ipcRenderer.invoke('get-productos'),
    getProducto: (id) => ipcRenderer.invoke('get-producto', id),
    getProductoForVenta: (id) => ipcRenderer.invoke('get-producto-for-venta', id),
    insertarProducto: (producto,idUsuario) => ipcRenderer.invoke('insertar-producto', producto, idUsuario),
    updateProducto: (producto, idUsuario) => ipcRenderer.invoke('update-producto', producto, idUsuario),
    deleteProducto: (id) => ipcRenderer.invoke('delete-producto', id),
    getProductosXCategoria: (idCategoria) => ipcRenderer.invoke('get-productos-x-categoria',idCategoria),
    /////////////home//////////////////
    nuevaVenta: (totalVenta, idUsuario, tipoPago, status, productos, pago) => ipcRenderer.invoke('nueva-venta', totalVenta, idUsuario, tipoPago, status, productos, pago),
    /////////////categorias//////////////////
    getCategorias: () => ipcRenderer.invoke('get-categorias'),
    insertarCategoria: (categoria) => ipcRenderer.invoke('insertar-categoria', categoria),
    getCategoriaById: (idCategoria) => ipcRenderer.invoke('get-categoria-by-id', idCategoria),
    updateCategoria: (categoria) => ipcRenderer.invoke('update-categoria', categoria),
    deleteCategoria: (idCategoria) => ipcRenderer.invoke('delete-categoria', idCategoria),
    //////////////ventas/////////////////
    reporteVentas: (fechaDesde, fechaHasta) => ipcRenderer.invoke('reporte-ventas', fechaDesde, fechaHasta),
    reporteTotalVentas:(fechaDesde, fechaHasta)=> ipcRenderer.invoke('reporte-total-ventas',fechaDesde, fechaHasta),
    detalleVenta: (idVenta) => ipcRenderer.invoke('detalle-venta', idVenta),
    ///////////////////////////////
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    /////////////dashboard//////////////////
    obtenerDatosVentaPorDIa: () => ipcRenderer.invoke('obtenerDatosVentaPorDIa'),
    obtenerTopProductosVendidos: () => ipcRenderer.invoke('obtenerTopProductosVendidos'),
    obtenerVentasPorHora: () => ipcRenderer.invoke('obtenerVentasPorHora'),
    obtenerProductosMasVendidosPorCategoria: () => ipcRenderer.invoke('obtenerProductosMasVendidosPorCategoria'),
    obtenerProductosBajoInventario: () => ipcRenderer.invoke('obtenerProductosBajoInventario'),
    ///////////////////////////////
    obtenerUsuariosPublicos:()=>ipcRenderer.invoke('get-usuarios'),
    insertarUsuario: (usuario) => ipcRenderer.invoke('insertar-usuario', usuario),

    ///////////proveedores////////////////
    getProveedores: () => ipcRenderer.invoke('get-proveedores'),
    getProveedorById: (idProveedor) => ipcRenderer.invoke('get-proveedor-by-id', idProveedor),
    addProveedor: (proveedor) => ipcRenderer.invoke('add-proveedor', proveedor),
    updateProveedor: (proveedor) => ipcRenderer.invoke('update-proveedor', proveedor),
    deleteProveedor: (idProveedor) => ipcRenderer.invoke('delete-proveedor', idProveedor),
    ///////////inventario/////////////////
    obtenerDatosStockPorCategorias: () => ipcRenderer.invoke('obtenerDatosStockPorCategorias'),
    obtenerDatosStockGeneral: () => ipcRenderer.invoke('obtenerDatosStockGeneral'),
    productosConMayorRotacionPorMes: () => ipcRenderer.invoke('productosConMayorRotacionPorMes'),
    productosConMenorRotacionPorMes: () => ipcRenderer.invoke('productosConMenorRotacionPorMes'),
    movimientosInventarioPorDia:()=> ipcRenderer.invoke('movimientosInventarioPorDia'),
    ///////////deudores/////////////////
    obtenerDeudores: () => ipcRenderer.invoke('obtenerDeudores'),
    obtenerDetalleDeudor:(idDeudor)=>ipcRenderer.invoke('obtenerDetalleDeudor',idDeudor),
    obtenerDeudor:(idDeudor)=> ipcRenderer.invoke('obtenerDeudor',idDeudor),
    insertarDeudor: (deudor) => ipcRenderer.invoke('insertarDeudor', deudor),
    insertarProductoDeudor:(idDeudor,producto,cantidad)=>ipcRenderer.invoke('insertarProductoDeudor',idDeudor,producto,cantidad),
    //updateDeudor: (deudor) => ipcRenderer.invoke('update-deudor', deudor),
    eliminarDeudor: (idDeudor) => ipcRenderer.invoke('eliminarDeudor', idDeudor),
    eliminarProductoDeudor:(idDeudor,idProducto)=>ipcRenderer.invoke('eliminarProductoDeudor',idDeudor,idProducto),
  
    ////////////compras////////////////
    insertarCompra:(compra)=>ipcRenderer.invoke('insertar-compra',compra),
    reporteTotalCompras:(fechaDesde, fechaHasta)=> ipcRenderer.invoke('reporte-total-compras',fechaDesde, fechaHasta),
    obtenerCompras:(fechaDesde, fechaHasta)=>ipcRenderer.invoke('obtener-compras',fechaDesde, fechaHasta),
    ////////////gastos////////////////
    insertarGasto:(gasto)=>ipcRenderer.invoke('insertar-gasto',gasto),
    reporteTotalGastos:(fechaDesde, fechaHasta)=> ipcRenderer.invoke('reporte-total-gastos',fechaDesde, fechaHasta),
    obtenerGastos:(fechaDesde, fechaHasta)=>ipcRenderer.invoke('obtener-gastos',fechaDesde, fechaHasta),
    ///////////cortes/////////////////
    insertarNuevoCorte:(idUsuario, montoInicialEfectivo)=>ipcRenderer.invoke('insertar-nuevo-corte',idUsuario, montoInicialEfectivo),
    cerrarCorte:(dataCierre)=>ipcRenderer.invoke('cerrar-turno',dataCierre),
    detalleCortes:(fechaDesde, fechaHasta)=>ipcRenderer.invoke('detalle-cortes',fechaDesde,fechaHasta),
    resumenDiarioCortes:(fechaDesde, fechaHasta)=>ipcRenderer.invoke('resumen-diario-cortes',fechaDesde,fechaHasta),

    /////////reportesGenerales////////////
    getReporteVentasPorMes:(fechaDesde,fechaHasta)=>ipcRenderer.invoke('get-reporteVentasPorMes',fechaDesde,fechaHasta),
    getListaVentasPorMes:(fechaDesde,fechaHasta)=>ipcRenderer.invoke('get-listaVentasPorMes',fechaDesde,fechaHasta),

    //////////alertas/////////////////
    alertarUser:()=>ipcRenderer.invoke('generar-reporte-stock'),
    
  });
