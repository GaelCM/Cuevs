import type { DetalleDeudorResponse, Deudores } from "@/types/deudores";
import type { Producto } from "@/types/Productos";

// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';


export const obtenerDeudoresApi=async():Promise<Deudores[] | null> => {
    if (isClient && window.electronApi?.obtenerDeudores) {
              const res = await window.electronApi?.obtenerDeudores();
              return res as Deudores[]
            }
    return null;
}

export const insertarDeudorApi=async(deudor:Deudores):Promise<{success:boolean, message:string, data:string} | null> => {
    if (isClient && window.electronApi?.insertarDeudor) {
              const res = await window.electronApi?.insertarDeudor(deudor);
              return res as {success:boolean, message:string, data:string}
            }
    return null;
}

export const insertarProductoDeudorApi=async(idDeudor:number,producto:Producto,cantidad:number):Promise<{success:boolean, message:string, data:string} | null> => {
    if (isClient && window.electronApi?.insertarProductoDeudor) {
              const res = await window.electronApi?.insertarProductoDeudor(idDeudor,producto,cantidad);
              return res as {success:boolean, message:string, data:string}
            }
    return null;
}

export const obtenerDetalleDeudorApi = async (idDeudor: number): Promise<DetalleDeudorResponse[] | null> => {
    if (isClient && window.electronApi?.obtenerDetalleDeudor) {
              const res = await window.electronApi?.obtenerDetalleDeudor(idDeudor);
              return res as DetalleDeudorResponse[]
            }
    return null;
}

export const obtenerDeudor= async (idDeudor: number): Promise<DetalleDeudorResponse | null> =>{
  if (isClient && window.electronApi?.obtenerDeudor) {
              const res = await window.electronApi?.obtenerDeudor(idDeudor);
              return res as DetalleDeudorResponse
            }
    return null;
}

export const eliminarDeudorApi= async (idDeudor:number): Promise<{success:boolean, message:string} | null> =>{
  if (isClient && window.electronApi?.eliminarDeudor) {
              const res = await window.electronApi?.eliminarDeudor(idDeudor); // Aquí debes pasar el idProducto correcto
              return res as {success:boolean, message:string}
            }
    return null;
}

export const eliminarProductoDeudor= async (idDeudor:number,idProducto:string): Promise<{success:boolean, message:string} | null> =>{
  if (isClient && window.electronApi?.eliminarProductoDeudor) {
              const res = await window.electronApi?.eliminarProductoDeudor(idDeudor,idProducto); // Aquí debes pasar el idProducto correcto
              return res as {success:boolean, message:string}
            }
    return null;
}

