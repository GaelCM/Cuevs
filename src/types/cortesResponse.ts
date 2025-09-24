
export type CorteResponse={
    idCorte: number,
    fechaApertura: string,
    montoInicialEfectivo: number,
    idUsuario: number
}

export type CorteDataCierre={
    idCorte: number,
    montoFinalEfectivo: number,
    idUsuario: number,
    observaciones:string
}

export type CorteFinalResponse={
    idCorte: number
    fechaCierre: string,
    montoInicial: number,
    montoEsperado: number,
    montoFinal: number,
    diferencia: number,
    ventasEfectivo: number,
    ventasTarjeta: number,
    totalVentas: number,
    totalCompras: number,
    totalTransacciones: number
}



export type CorteCajaReporte = {
  idCorte: number;
  usuario: string | null; // LEFT JOIN puede dar null si no existe el usuario
  fechaApertura: string; // ISO string, viene como TEXT/Datetime en SQLite
  fechaCierre: string | null; // Puede ser null si no está cerrado
  duracion_minutos: number | null; // ROUND puede devolver null si fechaCierre es null
  montoInicialEfectivo: number | null;
  totalVentas: number | null;
  totalCompras: number | null;
  balance_operacional: number | null; // totalVentas - totalCompras
  ventasEfectivo: number | null;
  ventasTarjeta: number | null;
  montoFinalEfectivo: number | null;
  diferencia: number | null;
  categoria_diferencia: 
    | "ALTA DIFERENCIA" 
    | "DIFERENCIA MEDIA" 
    | "DIFERENCIA BAJA" 
    | "EXACTO" 
    | "FALTANTE";
  observaciones: string | null;
  estado: "ABIERTO" | "CERRADO"; // según tu lógica en cortesCaja
};

export type ResumenDiarioCorteReporte= {
  fecha: string;
  total_cortes: number;
  promedio_ventas_por_corte: number;
  mejor_venta: number;
  menor_venta: number;
  cortes_con_sobrante: number;
  cortes_con_faltante: number;
  cortes_exactos: number;
  duracion_promedio_minutos: number;
  porcentaje_efectivo: number;
  porcentaje_tarjeta: number;
}