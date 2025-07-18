// Tipo principal para el usuario completo (como viene de la base de datos)
export interface Usuario {
    idUsuario: number;
    usuario: string;
    password_hash: string;
    email: string | null;
    nombre: string | null;
    apellidos: string | null;
    activo: string; // '1' para activo, '0' para inactivo
    fecha_creacion: string; // ISO string format
    fecha_actualizacion: string; // ISO string format
  }
  
  // Tipo para crear un nuevo usuario (sin campos auto-generados)
  export interface CrearUsuario {
    usuario: string;
    password_hash: string;
    email?: string;
    nombre?: string;
    apellidos?: string;
    activo?: boolean;
  }
  
  // Tipo para login (solo los campos necesarios)
  export interface LoginUsuario {
    usuario: string;
    password: string; // Contraseña sin encriptar para validar
  }
  
  // Tipo para datos públicos del usuario (sin información sensible)
  export interface UsuarioPublico {
    idUsuario: number;
    usuario: string;
    email: string | null;
    nombre: string | null;
    apellidos: string | null;
    activo: string;
    fecha_creacion: string;
  }
  
  // Tipo para actualizar usuario (campos opcionales excepto id)
  export interface ActualizarUsuario {
    id: number;
    usuario?: string;
    email?: string;
    nombre?: string;
    apellidos?: string;
    activo?: boolean;
  }