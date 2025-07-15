import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import bcrypt from "bcryptjs";
import { useState } from "react";
import { insertarNuevoUsuario } from "@/api/usuarios/usuarios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

type dialogProps = {
  open: boolean,
  onOpenChange: (open: boolean) => void;
}

const nuevoUsuarioForm = z.object({
  usuario: z.string().min(2, { message: "El usuario debe tener al menos 2 caracteres" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  email: z.string().email({ message: "Debe ser un email válido" }),
  nombre: z.string().min(2, { message: "El nombre es obligatorio" }),
  apellidos: z.string().min(2, { message: "Los apellidos son obligatorios" }),
  activo: z.enum(["1", "0"], { errorMap: () => ({ message: "Debe seleccionar un estado" }) }),
});

export function DialogNuevoUsuario({ open, onOpenChange }: dialogProps) {
  const [estado, setEstado] = useState<"inicio" | "cargando" | "finalizado">("inicio");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof nuevoUsuarioForm>>({
    resolver: zodResolver(nuevoUsuarioForm),
    defaultValues: {
      usuario: "",
      password: "",
      email: "",
      nombre: "",
      apellidos: "",
      activo: "1",
    },
  });

  const registrarUsuario = async (values: z.infer<typeof nuevoUsuarioForm>) => {
    setEstado("cargando");
    const password_hash = await bcrypt.hash(values.password, 10);
    const res=await insertarNuevoUsuario({
      id: 0, // Este campo será autogenerado por la base de datos
      usuario: values.usuario,
      password_hash: password_hash,
      email: values.email,
      nombre: values.nombre,
      apellidos: values.apellidos,
      activo: values.activo,
      fecha_creacion: "",
      fecha_actualizacion: "",
    });
    if(!res?.success){
            toast.error('Error al registrar el usuario', {
                description:`${res?.message}`,})
            setEstado("inicio")
            onOpenChange(false)
            return
    }else{
            console.log(res.data) // Maneja la respuesta según sea necesario
            setEstado("finalizado"); 
            toast.success('Producto registrado correctamente', {
                description:`El producto se ha registrado correctamente`,})  
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => { onOpenChange(false) }}>

      {estado === "inicio" && (
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={form.handleSubmit(registrarUsuario)}>
            <DialogHeader>
              <DialogTitle className="text-4xl font-bold text-center p-3">Agregar Nuevo Usuario</DialogTitle>
              <DialogDescription className="text-center text-gray-500">
                Complete todos los campos para registrar un nuevo usuario.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-3">
              {/* Columna Izquierda */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4 py-3">
                  <Label htmlFor="usuario" className="text-right">Usuario</Label>
                  <Input id="usuario" {...form.register("usuario")} className="col-span-2" />
                  <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.usuario?.message}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 py-3">
                  <Label htmlFor="password" className="text-right">Contraseña</Label>
                  <Input id="password" type="password" {...form.register("password")} className="col-span-2" />
                  <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.password?.message}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 py-3">
                  <Label htmlFor="activo" className="text-right">Estado</Label>
                  <Select
                    onValueChange={value => form.setValue("activo", value as "1" | "0")}
                    value={form.watch("activo")}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Activo</SelectItem>
                      <SelectItem value="0">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.activo?.message}</p>
                </div>
              </div>
              {/* Columna Derecha */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4 py-3">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" {...form.register("email")} className="col-span-2" />
                  <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.email?.message}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 py-3">
                  <Label htmlFor="nombre" className="text-right">Nombre</Label>
                  <Input id="nombre" {...form.register("nombre")} className="col-span-2" />
                  <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.nombre?.message}</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 py-3">
                  <Label htmlFor="apellidos" className="text-right">Apellidos</Label>
                  <Input id="apellidos" {...form.register("apellidos")} className="col-span-2" />
                  <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.apellidos?.message}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Guardar Usuario</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}

      {estado === "cargando" && (
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="p-6 pb-4 text-center">
            <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              Guardando usuario...
            </DialogTitle>
            <DialogDescription>Por favor, espere mientras se procesa el registro.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-20 h-20 border-4 border-t-blue-400 border-transparent rounded-full animate-spin" />
          </div>
        </DialogContent>
      )}

      {estado === "finalizado" && (
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader className="p-6 pb-4 text-center">
            <DialogTitle className="text-4xl text-center text-green-500">
              ✅ Usuario registrado correctamente
            </DialogTitle>
            <DialogDescription className="text-xl text-center">El usuario ha sido registrado con éxito.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={() => {
              setEstado("inicio");
              onOpenChange(false);
              navigate("/usuarios"); // Redirige a la página de usuarios
            }}>
              Finalizar
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}