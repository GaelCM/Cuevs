import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {

    //aqui se exponen las funciones que se van a usar en el frontend para comunicarse con el backend
    getNotes: () => ipcRenderer.invoke('get-notes'),
    addNote: (note) => ipcRenderer.invoke('add-note', note),
    ///////////////////////////////
    getProductos: () => ipcRenderer.invoke('get-productos'),
    getProducto: (id) => ipcRenderer.invoke('get-producto', id),
    getProductoForVenta: (id) => ipcRenderer.invoke('get-producto-for-venta', id),
    insertarProducto: (producto,idUsuario) => ipcRenderer.invoke('insertar-producto', producto, idUsuario),
    updateProducto: (producto, idUsuario) => ipcRenderer.invoke('update-producto', producto, idUsuario),
    deleteProducto: (id) => ipcRenderer.invoke('delete-producto', id),
    getProductosXCategoria: (idCategoria) => ipcRenderer.invoke('get-productos-x-categoria',idCategoria),
    ///////////////////////////////
    nuevaVenta: (totalVenta, idUsuario, status, productos, pago) => ipcRenderer.invoke('nueva-venta', totalVenta, idUsuario, status, productos, pago),
    ///////////////////////////////
    getCategorias: () => ipcRenderer.invoke('get-categorias'),
    insertarCategoria: (categoria) => ipcRenderer.invoke('insertar-categoria', categoria),
    getCategoriaById: (idCategoria) => ipcRenderer.invoke('get-categoria-by-id', idCategoria),
    updateCategoria: (categoria) => ipcRenderer.invoke('update-categoria', categoria),
    deleteCategoria: (idCategoria) => ipcRenderer.invoke('delete-categoria', idCategoria),
    ///////////////////////////////
    reporteVentas: (fechaDesde, fechaHasta) => ipcRenderer.invoke('reporte-ventas', fechaDesde, fechaHasta),
    detalleVenta: (idVenta) => ipcRenderer.invoke('detalle-venta', idVenta),
    ///////////////////////////////
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    ///////////////////////////////
    obtenerDatosVentaPorDIa: () => ipcRenderer.invoke('obtenerDatosVentaPorDIa'),
    obtenerTopProductosVendidos: () => ipcRenderer.invoke('obtenerTopProductosVendidos'),
    obtenerVentasPorHora: () => ipcRenderer.invoke('obtenerVentasPorHora'),
    obtenerProductosMasVendidosPorCategoria: () => ipcRenderer.invoke('obtenerProductosMasVendidosPorCategoria'),
    ///////////////////////////////
    obtenerUsuariosPublicos:()=>ipcRenderer.invoke('get-usuarios'),
    insertarUsuario: (usuario) => ipcRenderer.invoke('insertar-usuario', usuario),

    ///////////////////////////
    getProveedores: () => ipcRenderer.invoke('get-proveedores'),
    getProveedorById: (idProveedor) => ipcRenderer.invoke('get-proveedor-by-id', idProveedor),
    addProveedor: (proveedor) => ipcRenderer.invoke('add-proveedor', proveedor),
    updateProveedor: (proveedor) => ipcRenderer.invoke('update-proveedor', proveedor),
    deleteProveedor: (idProveedor) => ipcRenderer.invoke('delete-proveedor', idProveedor),
    ////////////////////////////
    obtenerDatosStockPorCategorias: () => ipcRenderer.invoke('obtenerDatosStockPorCategorias'),
    obtenerDatosStockGeneral: () => ipcRenderer.invoke('obtenerDatosStockGeneral'),
    productosConMayorRotacionPorMes: () => ipcRenderer.invoke('productosConMayorRotacionPorMes'),
    productosConMenorRotacionPorMes: () => ipcRenderer.invoke('productosConMenorRotacionPorMes'),
    movimientosInventarioPorDia:()=> ipcRenderer.invoke('movimientosInventarioPorDia'),


  
  });
