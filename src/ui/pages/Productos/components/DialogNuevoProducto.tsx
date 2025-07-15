"use client";

import { getCategoriasLocal } from "@/api/categoriasLocal/categoriasLocal";
import { insertarProductoLocal } from "@/api/productosLocal/productosLocal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Categorias } from "@/types/Productos";
import type { EstadoVenta } from "@/types/ventas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";


type dialogProps={
    open:boolean,
    onOpenChange: (open: boolean) => void;
}

const nuevoProductoForm = z.object({

    idProducto: z.string().min(2, {
    message: "El código del producto debe tener al menos 2 caracteres",
    }),  
    nombreProducto: z.string().min(2, {
        message: "El nombre del producto debe tener al menos 2 caracteres",
    }),
    precio: z.number().min(0, {
        message: "El precio debe ser un número positivo",
    }),
    descripcion: z.string().optional(),
    idCategoria: z.string().min(1, {
        message: "Debe seleccionar una categoría",
    }),
    idEstado: z.enum(["1", "0"], {
        errorMap: () => ({ message: "Debe seleccionar un estado" }),
    })
})

export function DialogNuevoProducto({open, onOpenChange}: dialogProps) {

    const [estado, setEstado] = useState<EstadoVenta>("inicio");
    const [categorias, setCategorias] = useState<Categorias[]>([]);


    const form = useForm<z.infer<typeof nuevoProductoForm>>({
        resolver: zodResolver(nuevoProductoForm),
        defaultValues: {
            idProducto: "",
            nombreProducto: "",
            precio: 0,
            descripcion: "",
            idCategoria: "",
            idEstado: "1",
        },
    });

    const registrarProduto =async(values: z.infer<typeof nuevoProductoForm>)=> {
        setEstado("cargando"); // Iniciar loading
        const response=await insertarProductoLocal({
            idProducto: values.idProducto,
            nombreProducto:values.nombreProducto,
            precio: values.precio,
            descripcion: values.descripcion || "",
            idCategoria: parseInt(values.idCategoria),
            idEstado: parseInt(values.idEstado)
        })
        if(!response?.success){
            toast.error('Error al registrar el producto', {
                description:`${response?.message}`,})
            setEstado("inicio")
            onOpenChange(false)
            return
        }else{
            console.log(response.data) // Maneja la respuesta según sea necesario
            setEstado("finalizado"); 
            toast.success('Producto registrado correctamente', {
                description:`El producto se ha registrado correctamente`,})  
        }
    }

    useEffect(()=>{
        const obtenerCategorias=async()=>{
            const categos=await getCategoriasLocal()
            if(categos){
                setCategorias(categos)
            }
        }
        obtenerCategorias()
    },[])

    return (
        <Dialog open={open} onOpenChange={() => { onOpenChange(false) }}>
            {estado==="inicio"&& (
                <DialogContent className="sm:max-w-4xl">
                <form onSubmit={form.handleSubmit(registrarProduto)}>
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-bold text-center p-3">Agregar Nuevo Producto</DialogTitle>
                        <DialogDescription className="text-center text-gray-500">
                            Inserte un nuevo producto en el sistema. Asegúrese de completar todos los campos requeridos.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-3">
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4 py-3">
                                <Label htmlFor="idProducto" className="text-right">
                                    Código
                                </Label>
                                <Input
                                    id="idProducto"
                                    {...form.register("idProducto")}
                                    className="col-span-2"
                                />
                                <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.idProducto?.message}</p>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4 py-3">
                                <Label htmlFor="idCategoria" className="text-right">
                                    Categoría
                                </Label>
                                <Select
                                    onValueChange={value => form.setValue("idCategoria", value)}
                                    value={form.watch("idCategoria")}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecciona la categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((categoria) => (
                                            <SelectItem key={categoria.idCategoria} value={categoria.idCategoria.toString()}>
                                                {categoria.categoriaName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.idCategoria?.message}</p>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4 py-3">
                                <Label htmlFor="idEstado" className="text-right">
                                    Estado
                                </Label>
                                <Select
                                    onValueChange={value => form.setValue("idEstado", value as "0" | "1")}
                                    value={form.watch("idEstado")}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecciona el estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Activo</SelectItem>
                                        <SelectItem value="0">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.idEstado?.message}</p>
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4 py-3">
                                <Label htmlFor="nombreProducto" className="text-right">
                                    Nombre
                                </Label>
                                <Input
                                    id="nombreProducto"
                                    {...form.register("nombreProducto")}
                                    className="col-span-2"
                                />
                                <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.nombreProducto?.message}</p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4 py-3">
                                <Label htmlFor="precio" className="text-right">
                                    Precio
                                </Label>
                                <Input
                                    id="precio"
                                    type="number"
                                    step="0.01"
                                    {...form.register("precio", { valueAsNumber: true })}
                                    className="col-span-2"
                                />
                                <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.precio?.message}</p>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="descripcion" className="text-right">
                                    Descripción
                                </Label>
                                <Textarea
                                    id="descripcion"
                                    {...form.register("descripcion")}
                                    className="col-span-3"
                                    placeholder="Una breve descripción del producto..."
                                />
                                <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.descripcion?.message}</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit">Guardar Producto</Button>
                    </DialogFooter>
                </form>
                </DialogContent>
            )}

            {estado==="cargando"&& (
                <DialogContent className="sm:max-w-4xl">
                <DialogHeader className="p-6 pb-4 text-center">
                    <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Package size={24} /> Generando venta...
                    </DialogTitle>
                    <DialogDescription>Por favor, espere mientras se procesa su venta.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-20 h-20 border-4 border-t-blue-400 border-transparent rounded-full animate-spin" />
                </div>
                </DialogContent>
            )}

             {estado==="finalizado"&& (
                <DialogContent className="sm:max-w-2xl">
                                <DialogHeader className="p-6 pb-4 text-center">
                                    <DialogTitle className="text-4xl text-center text-green-500">
                                        ✅ Producto registrado correctamente
                                    </DialogTitle>
                                    
                                    <DialogDescription className="text-xl text-center">Su producto ha sido procesado con éxito.</DialogDescription>
                                    
                                </DialogHeader>
                                <div className="flex justify-center">
                                    <a href={"/productos"} className="mt-6">
                                        <Button>
                                            Finalizar
                                        </Button>
                                    </a>
                                </div>
                </DialogContent>
            )}


        </Dialog>
    )
}