


export interface ventasPorMesReporte {
  /** Mes en formato YYYY-MM, p.ej. "2025-10" */
  mes: string;
  /** Cantidad de ventas (COUNT) */
  totalVentas: number;
  /** Suma total de ventas en el mes (SUM) */
  montoTotal: number;
  /** Suma de ventas en efectivo (tipoPago = 1) */
  ventasEfectivo: number;
  /** Suma de ventas en tarjeta (tipoPago = 2) */
  ventasTarjeta: number;
  /** Promedio de monto de venta (AVG) */
  promedioVenta: number;
}

export interface listaVentasPorMes {
  /** Fecha en formato YYYY-MM-DD */
  fecha: string;
  /** Cantidad de ventas en ese día */
  cantidadVentas: number;
  /** Suma total de ventas en el día */
  totalDia: number;
  /** Suma de ventas en efectivo */
  efectivo: number;
  /** Suma de ventas en tarjeta */
  tarjeta: number;
}

export interface TopProducto {
  idMedicamento: number;
  nombreMedicamento: string;
  categoriaName: string;
  totalUnidadesVendidas: number;
  montoTotalVendido: number;
  numeroVentas: number;
  precioPromedio: number;
}

export interface VentasPorCategoria {
  categoriaName: string;
  productosVendidos: number;
  unidadesVendidas: number;
  montoTotal: number;
}

export interface ProductoBajoMovimiento {
  idMedicamento: number;
  nombreMedicamento: string;
  stockActual: number;
  unidadesVendidas: number;
  montoVendido: number;
}

export interface TodosReportes {
  topProductos: TopProducto[];
  ventasCategoria: VentasPorCategoria[];
  productosBajoMovimiento: ProductoBajoMovimiento[];
}

