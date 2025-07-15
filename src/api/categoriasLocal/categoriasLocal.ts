import type { Categorias } from "@/types/Productos";




export const getCategoriasLocal = async () :Promise<Categorias[]|null>=> {
    if (window.electronApi?.getCategorias) {
        const res = await window.electronApi.getCategorias();
        if (!res) {
          console.log("Producto no encontrado:", res);
          return null
        }
        return res as Categorias[];
      } else {
        console.warn("electronAPI no está disponible.");
        return null;
      }
}