import type { Usuario } from "@/types/Usuarios";


// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';


export const insertarNuevoUsuario=async(usuario:Usuario)=>{

  if (isClient && window.electronApi?.insertarUsuario) {
    const res = await window.electronApi.insertarUsuario(usuario);
    if (!res) {
      console.log("Error al obtener los usuarios:", res);
      return null
    }
    //console.log("Usuarios:", res);
    return res
  } else {
    console.warn("electronAPI no está disponible.");
    return null;
  }      
}

export const obtenerUsuariosPublicos=async()=>{

    if (isClient && window.electronApi?.obtenerUsuariosPublicos) {
        const res = await window.electronApi.obtenerUsuariosPublicos();
        if (!res) {
          console.log("Error al obtener los usuarios:", res);
          return null
        }
        console.log("Usuarios:", res);
        return res
      } else {
        console.warn("electronAPI no está disponible.");
        return null;
    }
}



