import type { MovimientoInventarioPorDia, ProductoMayorRotacion, ProductoMenorRotacion, StockGeneral, StockPorCategoria } from "@/types/inventarioResponse";

// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';


export const obtenerDatosStockPorCategoriasApi = async ():Promise<StockPorCategoria[]|null> => {
    if (isClient && window.electronApi?.obtenerDatosStockPorCategorias) {
          const res = await window.electronApi?.obtenerDatosStockPorCategorias();
          return res as StockPorCategoria[]
        }
    return null;
}

export const obtenerDatosStockGeneralApi = async ():Promise<StockGeneral[]|null> => {
    if (isClient && window.electronApi?.obtenerDatosStockGeneral) {
          const res = await window.electronApi?.obtenerDatosStockGeneral();
          return res as StockGeneral[]
        }
    return null;
}

export const productosConMayorRotacionPorMesApi = async ():Promise<ProductoMayorRotacion[]|null> => {
    if (isClient && window.electronApi?.productosConMayorRotacionPorMes) {
          const res = await window.electronApi?.productosConMayorRotacionPorMes();
          return res as ProductoMayorRotacion[]
        }
    return null;
}


export const productosConMenorRotacionPorMesApi = async ():Promise<ProductoMenorRotacion[]|null> => {
    if (isClient && window.electronApi?.productosConMenorRotacionPorMes) {
          const res = await window.electronApi?.productosConMenorRotacionPorMes();
          return res as ProductoMenorRotacion[]
        }
    return null;
}

export const movimientosInventarioPorDiaApi = async ():Promise<MovimientoInventarioPorDia[]|null> => {
    if (isClient && window.electronApi?.movimientosInventarioPorDia) {
          const res = await window.electronApi?.movimientosInventarioPorDia();
          return res as MovimientoInventarioPorDia[]
        }
    return null;
}