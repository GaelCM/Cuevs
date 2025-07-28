import type { Proveedor } from "@/types/proveedores";

// Función helper para verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

export const getProveedores = async (): Promise<Proveedor[]|null> => {
     if (isClient && window.electronApi?.getProveedores) {
          const res = await window.electronApi.getProveedores();
          if (!res) {
            console.log("Proveedores no encontrado:", res);
            return null
          }
          console.log("Proveedores encontrado:", res);
          return res as Proveedor[];
        } else {
          console.warn("electronAPI no está disponible.");
          return null;
        }
}


export const insertarProveedor = async (proveedor: Proveedor) => {
    if (isClient && window.electronApi?.addProveedor) {
        const res = await window.electronApi.addProveedor(proveedor);
        return res;
    } else {
        console.warn("electronAPI no está disponible para insertar proveedor.");
        return null;
    }
};

export const deleteProveedor = async (id: number) => {
    if (isClient && window.electronApi?.deleteProveedor) {
        const res = await window.electronApi.deleteProveedor(id);
        return res;
    } else {
        console.warn("electronAPI no está disponible para eliminar proveedor.");
        return null;
    }
}

