import type { Usuario } from "@/types/Usuarios";



// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';


export const iniciarSesion=async(username:string, password:string):Promise<{success:boolean, message:string, data:Usuario, token:string, path:string}|null>=>{
    if (isClient && window.electronApi?.login) {
        const res = await window.electronApi.login(username, password);
        if (!res.success) {
          console.log("Error al iniciar sesión:", res);
          return {success:false, message:res.message, data:res.data, token:res.token, path:res.path}
        }
        console.log("Sesión iniciada correctamente:", res);
        return res as {success:boolean, message:string, data:Usuario, token:string, path:string};
      } else {
        return null;
      }
}