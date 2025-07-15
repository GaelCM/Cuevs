export type EstadoVenta = "inicio" | "cargando" | "finalizado";

export type VentaResponse = {
  success: boolean;
  message: string;
  data: number;
};

export type Venta = {
  idVenta: number;
  fechaVenta: string;
  totalVenta: number;
  idUsuario: number;
  idStatusVenta: number;
  pagoVenta: number;
  cambioVenta: number;
}

export type DetalleVenta = {
  idVenta: number;
  fechaVenta: string;
  totalVenta: number;
  pagoVenta: number;
  cambioVenta: number;
  idUsuario: number;
  idStatusVenta: number;
  nombreProducto: string;
  cantidadProducto: number;
  precioUnitario: number;
  subtotal: number;
  descripcion: string;
}

