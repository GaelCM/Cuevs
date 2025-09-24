import type { CorteCajaReporte, ResumenDiarioCorteReporte } from "@/types/cortesResponse";

// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

export const obtenerDetalleCortesApi=async(fechaDesde:string,fechaHasta:string)=>{
    if (isClient && window.electronApi?.detalleCortes) {
              const res = await window.electronApi.detalleCortes(fechaDesde,fechaHasta);
              if (!res) {
                console.log("Proveedores no encontrado:", res);
                return null
              }
              console.log("Proveedores encontrado:", res);
              return res as  {
                    success: boolean;
                    message: string;
                    data: CorteCajaReporte[];
            };
            } else {
              console.warn("electronAPI no está disponible.");
              return null;
    }
}


export const obtenerResumenDiarioCortesApi=async(fechaDesde:string,fechaHasta:string)=>{
    if (isClient && window.electronApi?.resumenDiarioCortes) {
              const res = await window.electronApi.resumenDiarioCortes(fechaDesde,fechaHasta);
              if (!res) {
                console.log("resumen no encontrado:", res);
                return null
              }
              console.log("resumen de cortes encontrado:", res);
              return res as  {
                    success: boolean;
                    message: string;
                    data: ResumenDiarioCorteReporte[];
            };
            } else {
              console.warn("electronAPI no está disponible.");
              return null;
    }
}