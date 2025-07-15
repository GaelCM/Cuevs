"use client";

import { getCategoriasLocal } from "@/api/categoriasLocal/categoriasLocal";
import { actualizarProducto, getProducto } from "@/api/productosLocal/productosLocal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Categorias, Producto } from "@/types/Productos";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";



const productoFormSchema = z.object({
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
});

export function ProductoDetalle({ id }: { id: string }) {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof productoFormSchema>>({
        resolver: zodResolver(productoFormSchema),
        defaultValues: {
            idProducto: "",
            nombreProducto: "",
            precio: 0,
            descripcion: "",
            idCategoria: "",
            idEstado: "1",
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const prod = await getProducto(id);
            setProducto(prod);
            const cats = await getCategoriasLocal();
            setCategorias(cats || []);
            setLoading(false);
            if (prod) {
                form.reset({
                    idProducto: prod.idProducto,
                    nombreProducto: prod.nombreProducto,
                    precio: prod.precio,
                    descripcion: prod.descripcion || "",
                    idCategoria: prod.idCategoria.toString(),
                    idEstado: prod.idEstado.toString() as "1" | "0",
                });
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const updateProducto = async (values: z.infer<typeof productoFormSchema>) => {
        const response=await actualizarProducto({
            idProducto: values.idProducto,
            nombreProducto: values.nombreProducto,
            precio: values.precio,
            descripcion: values.descripcion || "",
            idCategoria: parseInt(values.idCategoria),
            idEstado: parseInt(values.idEstado)
        })

        if(!response?.success){
            toast.error('Error al actualizar el producto', {
                description:`${response?.message}`,})
        }else{
            toast.success('Producto actualizado correctamente', {
                description:`El producto se ha actualizado correctamente`,})

            navigate("/productos")
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-5xl mx-auto">

                {loading === true && (
                    <h1 className="text-2xl font-bold text-gray-600">Cargando...</h1>
                )}

                {!loading && !producto && (
                    <>
                        <h1 className="text-2xl font-bold text-red-600">Producto no encontrado</h1>
                        <p className="text-gray-600 mt-2">El producto con ID {id} no existe.</p>
                    </>
                )}

                {!loading && producto && (
                    <>
                        <h1 className="text-3xl text-center font-bold mb-6">Editar tu producto</h1>
                        <form onSubmit={form.handleSubmit(updateProducto)} className="bg-white rounded-lg shadow-md p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-3">
                                {/* Columna Izquierda */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-4 items-center gap-4 py-3">
                                        <Label htmlFor="idProducto" className="text-right">Código</Label>
                                        <Input id="idProducto" {...form.register("idProducto")} className="col-span-2" disabled />
                                        <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.idProducto?.message}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4 py-3">
                                        <Label htmlFor="idCategoria" className="text-right">Categoría</Label>
                                        <Select onValueChange={value => form.setValue("idCategoria", value)} value={form.watch("idCategoria") || ""}>
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
                                        <Label htmlFor="idEstado" className="text-right">Estado</Label>
                                        <Select onValueChange={value => form.setValue("idEstado", value as "0" | "1")} value={form.watch("idEstado") || "1"}>
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
                                        <Label htmlFor="nombreProducto" className="text-right">Nombre</Label>
                                        <Input id="nombreProducto" {...form.register("nombreProducto")} className="col-span-2" />
                                        <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.nombreProducto?.message}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4 py-3">
                                        <Label htmlFor="precio" className="text-right">Precio</Label>
                                        <Input id="precio" type="number" step="0.01" {...form.register("precio", { valueAsNumber: true })} className="col-span-2" />
                                        <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.precio?.message}</p>

                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="descripcion" className="text-right">Descripción</Label>
                                        <Textarea id="descripcion" {...form.register("descripcion")} className="col-span-3" placeholder="Una breve descripción del producto..." />
                                        <p className="text-red-500 text-center text-xs col-span-4">{form.formState.errors.descripcion?.message}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button className="bg-red-500 hover:bg-red-600 text-white px-4 py-5 rounded-md">Guardar Cambios</Button>
                                <Link to="/productos" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">Volver</Link>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
} 