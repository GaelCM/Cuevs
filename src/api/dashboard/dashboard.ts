import type { DatosVentaPorDia, ProductoMasVendidoPorCategoria, ProductosBajoStock, TopProductoVendido, VentasPorHora } from "@/types/dashboardResponse";

// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

export const obtenerDatosVentaPorDIaApi = async (): Promise<DatosVentaPorDia[]|null> => {
    if (isClient && window.electronApi?.obtenerDatosVentaPorDIa) {
      const res = await window.electronApi?.obtenerDatosVentaPorDIa()
      return res as DatosVentaPorDia[]
    }
    return null;
}

export const obtenerTopProductosVendidosApi = async (): Promise<TopProductoVendido[]|null> => {
    if (isClient && window.electronApi?.obtenerTopProductosVendidos) {
      const res = await window.electronApi?.obtenerTopProductosVendidos()
      return res as TopProductoVendido[]
    }
    return null;
}

export const obtenerVentasPorHoraApi = async (): Promise<VentasPorHora[]|null> => {
    if (isClient && window.electronApi?.obtenerVentasPorHora) {
      const res = await window.electronApi?.obtenerVentasPorHora()
      return res as VentasPorHora[]
    }
    return null;
}

export const obtenerProductosMasVendidosPorCategoriaApi = async (): Promise<ProductoMasVendidoPorCategoria[]|null> => {
    if (isClient && window.electronApi?.obtenerProductosMasVendidosPorCategoria) {
      const res = await window.electronApi?.obtenerProductosMasVendidosPorCategoria()
      return res as ProductoMasVendidoPorCategoria[]
    }
    return null;
}

export const obtenerProductosBajoInventarioApi = async (): Promise<ProductosBajoStock[]|null> => {
    if (isClient && window.electronApi?.obtenerProductosBajoInventario) {
      const res = await window.electronApi?.obtenerProductosBajoInventario()
      return res as ProductosBajoStock[]
    }
    return null;
}