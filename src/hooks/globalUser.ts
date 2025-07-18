
import type { UsuarioPublico } from "@/types/Usuarios";
import { create } from "zustand";



type globalUserModel = {

    user: UsuarioPublico; // <--- Usuario publico
    setUser: (user: UsuarioPublico) => void; // Añade o incrementa cantidad
    clearUser: () => void; // Elimina el usuario

    getUser: () => UsuarioPublico; // <--- Obtiene el usuario publico

};

export const useUserData = create<globalUserModel>((set, get) => ({
    user: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') as string) : {
        idUsuario: 0,
        usuario: "",
        email: "",
        nombre: "",
        apellidos: "",
        activo: "1",
        fecha_creacion: "",
    },
    setUser: (user: UsuarioPublico) => set({ user }),
    clearUser: () => set({ user: {idUsuario: 0, usuario: "", email: "", nombre: "", apellidos: "", activo: "1", fecha_creacion: ""} }),
    getUser: () => get().user,
}));