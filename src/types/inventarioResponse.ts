// Respuesta de obtenerDatosStockPorCategorias
export interface StockPorCategoria {
  categoria: string;
  total_productos: number;
  stock_total: number;
  valor_inventario: number;
  stock_promedio: number;
  productos_bajo_minimo: number;
  productos_sobre_maximo: number;
}

// Respuesta de obtenerDatosStockGeneral y productosConMayorRotacionPorMes
export interface StockGeneral {
  total_productos: number;
  stock_total_general: number;
  valor_total_inventario: number;
  precio_promedio: number;
  alertas_stock_minimo: number;
  productos_agotados: number;
  valor_disponible: number;
}

// Respuesta de productosConMayorRotacionPorMes
export interface ProductoMayorRotacion {
  idProducto: number;
  nombreProducto: string;
  categoria: string;
  stockActual: number;
  total_vendido: number;
  ingresos_generados: number;
  precio_promedio_venta: number;
  numero_transacciones: number;
}

// Respuesta de productosConMenorRotacionPorMes
export interface ProductoMenorRotacion {
  idProducto: number;
  nombreProducto: string;
  categoria: string;
  stockActual: number;
  valor_inmovilizado: number;
  total_vendido: number;
  ultima_venta: string;
}

// Respuesta de movimientosInventarioPorDia
export interface MovimientoInventarioPorDia {
  fecha: string;
  tipoMovimiento: string;
  numero_movimientos: number;
  cantidad_total: number;
}



