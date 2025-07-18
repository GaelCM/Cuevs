import { useUserData } from "@/hooks/globalUser";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import mascota from "../../../res/mascota.png"
import logo from "../../../res/logo.png"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { iniciarSesion } from "@/api/authentication/authentication";


const loginForm = z.object({
    username: z.string().min(2, {
    message: "El usuario debe tener al menos 2 caracteres",
    }),  
    password: z.string().min(2, {
        message: "La contraseña debe tener al menos 2 caracteres",
    }),
})

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useUserData();
    const navigate=useNavigate()
    const form = useForm<z.infer<typeof loginForm>>({
        resolver: zodResolver(loginForm),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof loginForm>) => {
        setIsLoading(true);
        try {
            const res = await iniciarSesion(data.username, data.password);
            if(!res?.success){
                toast.error(res?.message);
                setIsLoading(false);
            }else{

                // Guarda el token en una cookie
                //Cookies.set('token', res.token, { expires: 1, sameSite: 'strict' }); // expires: 1 día
                localStorage.setItem('token',res.token)
                setUser(res.data);
                localStorage.setItem('currentUser', JSON.stringify({
                    idUsuario: res.data.idUsuario,
                    usuario: res.data.usuario,
                    email: res.data.email,
                    nombre: res.data.nombre,
                    apellidos: res.data.apellidos,
                    activo: res.data.activo,
                    fecha_creacion: res.data.fecha_creacion,
                }));
                console.log('✅ Login exitoso, redirigiendo a:', res?.path);
                
                // Usar replace para evitar historial de navegación
                navigate(res?.path || '/dashboard');
                toast.success(res?.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('❌ Error en login:', error);
            toast.error('Error al iniciar sesión');
            setIsLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[340px] max-w-xl w-full flex flex-col items-center">
        <img src={mascota} alt="Mascota" className="w-10 mb-4" />
        <img src={logo} alt="Logo" className="w-200 mb-4" />
        <h1 className="text-br-red-500 font-bold text-2xl mb-2 py-10">Iniciar sesión</h1>
       
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-[60%] items-center gap-4">
          <Input {...form.register("username")} placeholder="Usuario" className="" type="text" />
          <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.username?.message}</p>
          <Input {...form.register("password")} placeholder="Contraseña" className="" type="password" />
          <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.password?.message}</p>
          <div>
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-semibold text-base mt-2 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </Button>
          </div>
        </form>
        <div className="mt-6 text-red-400 font-medium">
          <span>¿Olvidaste tu contraseña?</span>
        </div>
      </div>
    </div>
  );
}