export interface Gasto {
  idGasto: number;
  fechaRegistro: string;
  monto: number;
  concepto: string;
}

// O si prefieres hacer el ID opcional para inserts
export interface GastoInput {
  idGasto?: number;
  fechaRegistro: string;
  monto: number;
  concepto: string;
}