"use client";

import { getCategoriasLocal } from "@/api/categoriasLocal/categoriasLocal";
import { actualizarProducto, getProducto } from "@/api/productosLocal/productosLocal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/globalUser";
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
    }),
    stockActual: z.number().min(0, { message: "Stock actual debe ser positivo" }),
    stockMinimo: z.number().min(0, { message: "Stock mínimo debe ser positivo" }),
    stockMaximo: z.number().min(0, { message: "Stock máximo debe ser positivo" }),
    unidadMedida: z.string().min(1, { message: "Debe ingresar la unidad de medida" }),
});

export function ProductoDetalle({ id }: { id: string }) {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [loading, setLoading] = useState(true);
    const { getUser } = useUserData();
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
            stockActual: 0,
            stockMinimo: 0,
            stockMaximo: 0,
            unidadMedida: "",
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
                    stockActual: prod.stockActual,
                    stockMinimo: prod.stockMinimo,
                    stockMaximo: prod.stockMaximo,
                    unidadMedida: prod.unidadMedida,
                });
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const updateProducto = async (values: z.infer<typeof productoFormSchema>) => {
        const user = getUser();
        const response = await actualizarProducto({
            idProducto: values.idProducto,
            nombreProducto: values.nombreProducto,
            precio: values.precio,
            descripcion: values.descripcion || "",
            idCategoria: parseInt(values.idCategoria),
            idEstado: parseInt(values.idEstado),
            stockActual: values.stockActual,
            stockMinimo: values.stockMinimo,
            stockMaximo: values.stockMaximo,
            unidadMedida: values.unidadMedida,
        }, user.idUsuario);

        if (!response?.success) {
            toast.error('Error al actualizar el producto', {
                description: `${response?.message}`,
            });
        } else {
            toast.success('Producto actualizado correctamente', {
                description: `El producto se ha actualizado correctamente`,
            });
            navigate("/productos");
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 w-4xl gap-8">
                        {/* Columna Izquierda */}
                        <div className="space-y-6">
                            {/* Código */}
                            <div className="space-y-2">
                                <Label htmlFor="idProducto" className="text-sm font-medium">Código</Label>
                                <Input 
                                    id="idProducto" 
                                    {...form.register("idProducto")} 
                                    className="w-full" 
                                    disabled 
                                />
                                {form.formState.errors.idProducto?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.idProducto?.message}</p>
                                )}
                            </div>

                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="nombreProducto" className="text-sm font-medium">Nombre del Producto</Label>
                                <Input 
                                    id="nombreProducto" 
                                    {...form.register("nombreProducto")} 
                                    className="w-full" 
                                    placeholder="Ingresa el nombre del producto"
                                />
                                {form.formState.errors.nombreProducto?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.nombreProducto?.message}</p>
                                )}
                            </div>

                            {/* Categoría */}
                            <div className="space-y-2">
                                <Label htmlFor="idCategoria" className="text-sm font-medium">Categoría</Label>
                                <Select 
                                    onValueChange={value => form.setValue("idCategoria", value)} 
                                    value={form.watch("idCategoria") || ""}
                                >
                                    <SelectTrigger className="w-full">
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
                                {form.formState.errors.idCategoria?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.idCategoria?.message}</p>
                                )}
                            </div>

                            {/* Estado */}
                            <div className="space-y-2">
                                <Label htmlFor="idEstado" className="text-sm font-medium">Estado</Label>
                                <Select 
                                    onValueChange={value => form.setValue("idEstado", value as "0" | "1")} 
                                    value={form.watch("idEstado") || "1"}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona el estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Activo</SelectItem>
                                        <SelectItem value="0">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.idEstado?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.idEstado?.message}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="descripcion" className="text-sm font-medium">Descripción</Label>
                                <Textarea 
                                    id="descripcion" 
                                    {...form.register("descripcion")} 
                                    className="w-full min-h-[100px]" 
                                    placeholder="Una breve descripción del producto..."
                                />
                                {form.formState.errors.descripcion?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.descripcion?.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-6">
                            {/* Precio */}
                            <div className="space-y-2">
                                <Label htmlFor="precio" className="text-sm font-medium">Precio</Label>
                                <Input 
                                    id="precio" 
                                    type="number" 
                                    step="0.01" 
                                    {...form.register("precio", { valueAsNumber: true })} 
                                    className="w-full" 
                                    placeholder="0.00"
                                />
                                {form.formState.errors.precio?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.precio?.message}</p>
                                )}
                            </div>

                            {/* Unidad de Medida */}
                            <div className="space-y-2">
                                <Label htmlFor="unidadMedida" className="text-sm font-medium">Unidad de Medida</Label>
                                <Input 
                                    id="unidadMedida" 
                                    {...form.register("unidadMedida")} 
                                    className="w-full" 
                                    placeholder="Ej: kg, pieza, caja, litro"
                                />
                                {form.formState.errors.unidadMedida?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.unidadMedida?.message}</p>
                                )}
                            </div>

                            {/* Stock Actual */}
                            <div className="space-y-2">
                                <Label htmlFor="stockActual" className="text-sm font-medium">Stock Actual</Label>
                                <Input 
                                    id="stockActual" 
                                    type="number" 
                                    min="0" 
                                    {...form.register("stockActual", { valueAsNumber: true })} 
                                    className="w-full" 
                                    placeholder="0"
                                />
                                {form.formState.errors.stockActual?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.stockActual?.message}</p>
                                )}
                            </div>

                            {/* Stock Mínimo */}
                            <div className="space-y-2">
                                <Label htmlFor="stockMinimo" className="text-sm font-medium">Stock Mínimo</Label>
                                <Input 
                                    id="stockMinimo" 
                                    type="number" 
                                    min="0" 
                                    {...form.register("stockMinimo", { valueAsNumber: true })} 
                                    className="w-full" 
                                    placeholder="0"
                                />
                                {form.formState.errors.stockMinimo?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.stockMinimo?.message}</p>
                                )}
                            </div>

                            {/* Stock Máximo */}
                            <div className="space-y-2">
                                <Label htmlFor="stockMaximo" className="text-sm font-medium">Stock Máximo</Label>
                                <Input 
                                    id="stockMaximo" 
                                    type="number" 
                                    min="0" 
                                    {...form.register("stockMaximo", { valueAsNumber: true })} 
                                    className="w-full" 
                                    placeholder="0"
                                />
                                {form.formState.errors.stockMaximo?.message && (
                                    <p className="text-red-500 text-xs">{form.formState.errors.stockMaximo?.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
                        <Link 
                            to="/productos" 
                            className="inline-flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors order-2 sm:order-1"
                        >
                            Volver
                        </Link>
                        <Button 
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md order-1 sm:order-2"
                        >
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </>
        )}
            </div>
        </div>
    );
}