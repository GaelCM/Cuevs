// Tipos para el dashboard
   export interface DatosVentaPorDia {
    fecha: string;
    monto_total_ventas: number;
    numero_ventas: number;
    ventasEfectivo:number;
    ventasTarjeta:number;
  }
  
  export interface TopProductoVendido {
    nombreProducto: string;
    total_vendido: number;
    ingresos_totales: number;
  }
  
  export interface VentasPorHora {
    hora: number;
    numero_ventas: number;
    total_ventas: number;
  }
  
  export interface ProductoMasVendidoPorCategoria {
    categoriaName: string;
    nombreProducto: string;
    total_vendido: number;
  }