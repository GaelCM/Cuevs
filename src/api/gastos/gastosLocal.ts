import type { Gasto, GastoInput } from "@/types/gastos";



export const insertargastoApi=async(gasto:GastoInput)=>{
    if (window.electronApi?.insertarGasto) {
        const res = await window.electronApi.insertarGasto(gasto);
        if (!res) {
          console.log("Producto no encontrado:", res);
          return null
        }
        return res as {success:boolean, message:string, data:string};
      } else {
        console.warn("electronAPI no está disponible.");
        return null;
      }
}

export const obtenergastosApi=async(fechaDesde:string,fechaHasta:string)=>{
    if (window.electronApi?.obtenerGastos) {
        const res = await window.electronApi.obtenerGastos(fechaDesde,fechaHasta);
        if (!res) {
          console.log("Producto no encontrado:", res);
          return null
        }
        return res as {success:boolean, message:string, data:Gasto[]};
      } else {
        console.warn("electronAPI no está disponible.");
        return null;
      }
}

export const obtenerTotalgastosApi=async(fechaDesde:string,fechaHasta:string)=>{
    if (window.electronApi?.reporteTotalGastos) {
        const res = await window.electronApi.reporteTotalGastos(fechaDesde,fechaHasta);
        if (!res) {
          console.log("Producto no encontrado:", res);
          return null
        }
        return res
      } else {
        console.warn("electronAPI no está disponible.");
        return null;
      }
}

