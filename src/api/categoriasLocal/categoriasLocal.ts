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

export const insertarCategoria=async(categoria:Categorias)=>{
    if (window.electronApi?.insertarCategoria) {
        const res = await window.electronApi.insertarCategoria(categoria);
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

export const getCategoriaById = async (idCategoria: number): Promise<Categorias|null> => {
  if (window.electronApi?.getCategoriaById) {
        const res = await window.electronApi.getCategoriaById(idCategoria);
        if (!res) {
          console.log("Categoria no encontrada:", res);
          return null
        }
        return res as Categorias;
  } else {
        console.warn("electronAPI no está disponible.");
        return null;
  }
}