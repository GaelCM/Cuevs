import type { Producto, ProductoResponse } from "@/types/Productos";


// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

export const getProducto = async (idProducto:string): Promise<Producto|null> => {
    if (isClient && window.electronApi?.getProducto) {
      const res = await window.electronApi.getProducto(idProducto);
      if (!res) {
        console.log("Producto no encontrado:", res);
        return null
      }
      console.log("Producto encontrado:", res);
      return res as Producto;
    } else {
      console.warn("electronAPI no está disponible.");
      return null;
    }
  };


export const getProductoForVenta = async (idProducto:string): Promise<Producto|null> => {
    if (isClient && window.electronApi?.getProductoForVenta) {
      const res = await window.electronApi.getProductoForVenta(idProducto);
      if (!res) {
        console.log("Producto no encontrado:", res);
        return null
      }
      console.log("Producto encontrado:", res);
      return res as Producto;
    } else {
      console.warn("electronAPI no está disponible.");
      return null;
    }
  }; 
  
export const getProductosLocal = async (): Promise<Producto[]|null> => {
  if (isClient && window.electronApi?.getProductos) {
    const res = await window.electronApi.getProductos();
    return res as Producto[];
  }
  return null;
}


export const insertarProductoLocal = async (producto:Producto,idUsuario:number) => {

  if (isClient && window.electronApi?.insertarProducto) {
    const res = await window.electronApi.insertarProducto(producto,idUsuario);
    if (!res) {
      console.log("Producto no insertado:", res);
      return null
    }
    return res as ProductoResponse;
    
  }
}

export const actualizarProducto= async (producto:Producto, idUsuario:number) => {
  if (isClient && window.electronApi?.updateProducto) {
    const res = await window.electronApi.updateProducto(producto,idUsuario);
    if (!res) {
      console.log("Producto no actualizado:", res);
      return null
    }
    return res as ProductoResponse;
  }
}

export const eliminarProducto= async (idProducto:string) => {
  if (isClient && window.electronApi?.deleteProducto) {
    const res = await window.electronApi.deleteProducto(idProducto);
    if (!res?.success) {
      console.log("Producto no eliminado:", res);
      return null
    }
    return res 
  }
}


export const getProductosXCategoria = async (idCategoria:number): Promise<Producto[]|null> => {
  if (isClient && window.electronApi?.getProductosXCategoria) {
    const res = await window.electronApi.getProductosXCategoria(idCategoria);
    return res as Producto[];
  }
  return null;
}

