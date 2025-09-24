import type { compra } from "@/types/compras";


export const insertarCompraApi=async(compra:compra)=>{
    if (window.electronApi?.insertarCompra) {
        const res = await window.electronApi.insertarCompra(compra);
        if (!res) {
          console.log("Producto no encontrado:", res);
          return null
        }
        return res as {success:boolean, message:string};
      } else {
        console.warn("electronAPI no está disponible.");
        return null;
      }
}

export const obtenerComprasApi=async(fechaDesde:string,fechaHasta:string)=>{
    if (window.electronApi?.obtenerCompras) {
        const res = await window.electronApi.obtenerCompras(fechaDesde,fechaHasta);
        if (!res) {
          console.log("Producto no encontrado:", res);
          return null
        }
        return res as {success:boolean, message:string, data:compra[]};
      } else {
        console.warn("electronAPI no está disponible.");
        return null;
      }
}

export const obtenerTotalComprasApi=async(fechaDesde:string,fechaHasta:string)=>{
    if (window.electronApi?.reporteTotalCompras) {
        const res = await window.electronApi.reporteTotalCompras(fechaDesde,fechaHasta);
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

