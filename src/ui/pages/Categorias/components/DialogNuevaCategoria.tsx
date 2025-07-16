"use client";

import { insertarCategoria } from "@/api/categoriasLocal/categoriasLocal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Solo los campos de Categorias
const nuevaCategoriaForm = z.object({
    idCategoria: z.number(),
    categoriaName: z.string().min(2, {
        message: "El nombre de la categoría debe tener al menos 2 caracteres",
    }),
});

export function DialogNuevaCategoria({ open, onOpenChange }: dialogProps) {
    const [estado, setEstado] = useState<EstadoVenta>("inicio");

    const form = useForm<z.infer<typeof nuevaCategoriaForm>>({
        resolver: zodResolver(nuevaCategoriaForm),
        defaultValues: {
            idCategoria: 0,
            categoriaName: "",
        },
    });

    const registrarCategoria = async (values: z.infer<typeof nuevaCategoriaForm>) => {
        setEstado("cargando");
        const response = await insertarCategoria({
            idCategoria: values.idCategoria,
            categoriaName: values.categoriaName,
        });
        if (!response?.success) {
            toast.error('Error al registrar la categoría', {
                description: `${response?.message}`,
            });
            setEstado("inicio");
            onOpenChange(false);
            return;
        } else {
            setEstado("finalizado");
            toast.success('Categoría registrada correctamente', {
                description: `La categoría se ha registrado correctamente`,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => { onOpenChange(false) }}>
            {estado === "inicio" && (
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={form.handleSubmit(registrarCategoria)}>
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-center p-3">Agregar Nueva Categoría</DialogTitle>
                            <DialogDescription className="text-center text-gray-500">
                                Complete los campos para registrar una nueva categoría.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div>
                                <Label htmlFor="idCategoria">Código</Label>
                                <Input
                                    type="number"
                                    id="idCategoria"
                                    {...form.register("idCategoria",{valueAsNumber: true})}
                                    className="mt-1"
                                />
                                <p className="text-red-500 text-xs">{form.formState.errors.idCategoria?.message}</p>
                            </div>
                            <div>
                                <Label htmlFor="categoriaName">Nombre</Label>
                                <Input
                                    id="categoriaName"
                                    {...form.register("categoriaName")}
                                    className="mt-1"
                                />
                                <p className="text-red-500 text-xs">{form.formState.errors.categoriaName?.message}</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Guardar Categoría</Button>
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
                        <DialogDescription>Por favor, espere mientras se registra la categoría.</DialogDescription>
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
                            ✅ Categoría registrada correctamente
                        </DialogTitle>
                        <DialogDescription className="text-lg text-center">La categoría ha sido registrada con éxito.</DialogDescription>
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