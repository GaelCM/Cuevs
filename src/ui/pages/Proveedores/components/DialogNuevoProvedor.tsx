"use client";

import { insertarProveedor } from "@/api/proveedores/proveedoresLocal";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EstadoVenta } from "@/types/ventas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type dialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void;
}


// Esquema de validación para nuevo proveedor
const nuevoProveedorForm = z.object({
    nombreProveedor: z.string().min(2, { message: "El nombre del proveedor debe tener al menos 2 caracteres" }),
    contacto: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),
    email: z.string().email({ message: "Email inválido" }).optional().nullable(),
    direccion: z.string().optional().nullable(),
    idEstado: z.enum(["1", "0"], {
            errorMap: () => ({ message: "Debe seleccionar un estado" }),
    }),
});

export default function DialogNuevoProveedor({ open, onOpenChange }: dialogProps) {

    const [estado, setEstado] = useState<EstadoVenta>("inicio");

    const form = useForm<z.infer<typeof nuevoProveedorForm>>({
        resolver: zodResolver(nuevoProveedorForm),
        defaultValues: {
            nombreProveedor: "",
            contacto: "",
            telefono: "",
            email: "",
            direccion: "",
            idEstado: "1",
        },
    });

    const registrarProveedor = async (values: z.infer<typeof nuevoProveedorForm>) => {
        setEstado("cargando");
        // Convertir idEstado a número antes de enviar
        const response = await insertarProveedor({ ...values, idEstado: Number(values.idEstado) });
        if (!response?.success) {
            toast.error('Error al registrar el proveedor', {
                description: `${response?.message}`,
            });
            setEstado("inicio");
            onOpenChange(false);
            return;
        } else {
            setEstado("finalizado");
            toast.success('Proveedor registrado correctamente', {
                description: `El proveedor se ha registrado correctamente`,
            });
        }
    };


    return (
        <Dialog open={open} onOpenChange={() => { onOpenChange(false) }}>
            {estado === "inicio" && (
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={form.handleSubmit(registrarProveedor)}>
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-center p-3">Agregar Nuevo proveedor</DialogTitle>
                            <DialogDescription className="text-center text-gray-500">
                                Complete los campos para registrar un nuevo proveedor.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div>
                                <Label htmlFor="nombreProveedor">Nombre del proveedor</Label>
                                <Input
                                    id="nombreProveedor"
                                    {...form.register("nombreProveedor")}
                                    className="mt-1"
                                />
                                <p className="text-red-500 text-xs">{form.formState.errors.nombreProveedor?.message}</p>
                            </div>
                            <div>
                                <Label htmlFor="contacto">Contacto</Label>
                                <Input
                                    id="contacto"
                                    {...form.register("contacto")}
                                    className="mt-1"
                                />
                                <p className="text-red-500 text-xs">{form.formState.errors.contacto?.message}</p>
                            </div>
                            <div>
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    {...form.register("telefono")}
                                    className="mt-1"
                                />
                                <p className="text-red-500 text-xs">{form.formState.errors.telefono?.message}</p>
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    {...form.register("email")}
                                    className="mt-1"
                                />
                                <p className="text-red-500 text-xs">{form.formState.errors.email?.message}</p>
                            </div>
                            <div>
                                <Label htmlFor="direccion">Dirección</Label>
                                <Input
                                    id="direccion"
                                    {...form.register("direccion")}
                                    className="mt-1"
                                />
                                <p className="text-red-500 text-xs">{form.formState.errors.direccion?.message}</p>
                            </div>
                            <div>
                                <Label htmlFor="idEstado">Estado</Label>
                                <Select
                                    value={form.watch("idEstado")}
                                    onValueChange={value => form.setValue("idEstado", value as "1" | "0")}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Selecciona el estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Activo</SelectItem>
                                        <SelectItem value="0">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-red-500 text-xs">{form.formState.errors.idEstado?.message}</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Guardar Proveedor</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            )}

            {estado === "cargando" && (
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="p-6 pb-4 text-center">
                        <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                            Guardando...
                        </DialogTitle>
                        <DialogDescription>Por favor, espere mientras se registra el proveedor.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-16 h-16 border-4 border-t-blue-400 border-transparent rounded-full animate-spin" />
                    </div>
                </DialogContent>
            )}

            {estado === "finalizado" && (
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="p-6 pb-4 text-center">
                        <DialogTitle className="text-3xl text-center text-green-500">
                            ✅ Proveedor registrada correctamente
                        </DialogTitle>
                        <DialogDescription className="text-lg text-center">Proveedor registrado con éxito.</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center">
                        <Button onClick={() =>{
                            setEstado("inicio");
                            onOpenChange(false);
                            form.reset();
                        }}>
                            Finalizar
                        </Button>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
}
