import type { listaVentasPorMes, ventasPorMesReporte } from "@/types/reportesGenetal";

// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

export const getTotalVentasPorMesApi=async(fechaDesde:string,fechaHasta:string)=>{
if (isClient && window.electronApi?.getReporteVentasPorMes) {
          const res = await window.electronApi.getReporteVentasPorMes(fechaDesde,fechaHasta);
          if (!res) {
            console.log("Reportes no encontrado:", res);
            return null
          }
          console.log("Reportes encontrado:", res);
          return res as ventasPorMesReporte[];
        } else {
          console.warn("electronAPI no está disponible.");
          return null;
        }
}


export const getListaVentasPorMesApi=async(fechaDesde:string,fechaHasta:string)=>{
if (isClient && window.electronApi?.getListaVentasPorMes) {
          const res = await window.electronApi.getListaVentasPorMes(fechaDesde,fechaHasta);
          if (!res) {
            console.log("Reportes no encontrado:", res);
            return null
          }
          console.log("Reportes encontrado:", res);
          return res as listaVentasPorMes[];
        } else {
          console.warn("electronAPI no está disponible.");
          return null;
        }
}