"use client";

import { getCategoriasLocal } from "@/api/categoriasLocal/categoriasLocal";
import { insertarProductoLocal } from "@/api/productosLocal/productosLocal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/globalUser";
import type { Categorias } from "@/types/Productos";
import type { EstadoVenta } from "@/types/ventas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
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
    }),
    stockActual: z.number().min(0, { message: "Stock actual debe ser positivo" }),
    stockMinimo: z.number().min(0, { message: "Stock mínimo debe ser positivo" }),
    stockMaximo: z.number().min(0, { message: "Stock máximo debe ser positivo" }),
    unidadMedida: z.string().min(1, { message: "Debe ingresar la unidad de medida" }),
});

export function DialogNuevoProducto({open, onOpenChange}: dialogProps) {

    const [estado, setEstado] = useState<EstadoVenta>("inicio");
    const [categorias, setCategorias] = useState<Categorias[]>([]);

    const {getUser}=useUserData();



    const form = useForm<z.infer<typeof nuevoProductoForm>>({
        resolver: zodResolver(nuevoProductoForm),
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

    const registrarProduto =async(values: z.infer<typeof nuevoProductoForm>)=> {
        setEstado("cargando"); // Iniciar loading
        const user = getUser();
        console.log("Usuario actual:", user);
        const response=await insertarProductoLocal({
            idProducto: values.idProducto,
            nombreProducto:values.nombreProducto,
            precio: values.precio,
            descripcion: values.descripcion || "",
            idCategoria: parseInt(values.idCategoria),
            idEstado: parseInt(values.idEstado),
            stockActual: values.stockActual,
            stockMinimo: values.stockMinimo,
            stockMaximo: values.stockMaximo,
            unidadMedida: values.unidadMedida,
        },user.idUsuario);
        if(!response?.success){
            toast.error('Error al registrar el producto', {
                description:`${response?.message}`,})
            setEstado("inicio")
            onOpenChange(false)
            return
        }else{
            console.log(response.data) // Maneja la respuesta según sea necesario
            setEstado("finalizado"); 
            form.reset();
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
            
        {estado === "inicio" && (
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={form.handleSubmit(registrarProduto)}>
            <DialogHeader className="pb-6">
                <DialogTitle className="text-3xl font-bold text-center">
                Agregar Nuevo Producto
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                Complete todos los campos requeridos para registrar un nuevo producto en el sistema.
                </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
                {/* Columna Izquierda - Información Básica */}
                <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Información Básica
                    </h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="idProducto" className="text-sm font-medium">
                    Código del Producto <span className="text-red-500">*</span>
                    </Label>
                    <Input
                    id="idProducto"
                    {...form.register("idProducto")}
                    placeholder="Ingrese el código del producto"
                    className="w-full"
                    />
                    {form.formState.errors.idProducto && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.idProducto.message}
                    </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nombreProducto" className="text-sm font-medium">
                    Nombre del Producto <span className="text-red-500">*</span>
                    </Label>
                    <Input
                    id="nombreProducto"
                    {...form.register("nombreProducto")}
                    placeholder="Ingrese el nombre del producto"
                    className="w-full"
                    />
                    {form.formState.errors.nombreProducto && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.nombreProducto.message}
                    </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="idCategoria" className="text-sm font-medium">
                    Categoría <span className="text-red-500">*</span>
                    </Label>
                    <Select
                    onValueChange={value => form.setValue("idCategoria", value)}
                    value={form.watch("idCategoria")}
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
                    {form.formState.errors.idCategoria && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.idCategoria.message}
                    </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="idEstado" className="text-sm font-medium">
                    Estado <span className="text-red-500">*</span>
                    </Label>
                    <Select
                    onValueChange={value => form.setValue("idEstado", value as "0" | "1")}
                    value={form.watch("idEstado")}
                    >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Activo
                        </div>
                        </SelectItem>
                        <SelectItem value="0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Inactivo
                        </div>
                        </SelectItem>
                    </SelectContent>
                    </Select>
                    {form.formState.errors.idEstado && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.idEstado.message}
                    </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="descripcion" className="text-sm font-medium">
                    Descripción
                    </Label>
                    <Textarea
                    id="descripcion"
                    {...form.register("descripcion")}
                    placeholder="Ingrese una descripción detallada del producto..."
                    className="w-full min-h-[100px] resize-none"
                    />
                    {form.formState.errors.descripcion && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.descripcion.message}
                    </p>
                    )}
                </div>
                </div>

                {/* Columna Derecha - Precios e Inventario */}
                <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Precios e Inventario
                    </h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="precio" className="text-sm font-medium">
                    Precio <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                    </span>
                    <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        min="0"
                        {...form.register("precio", { valueAsNumber: true })}
                        className="w-full pl-8"
                        placeholder="0.00"
                    />
                    </div>
                    {form.formState.errors.precio && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.precio.message}
                    </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="unidadMedida" className="text-sm font-medium">
                    Unidad de Medida <span className="text-red-500">*</span>
                    </Label>
                    <Input
                    id="unidadMedida"
                    {...form.register("unidadMedida")}
                    placeholder="Ej: kg, pieza, caja, litro"
                    className="w-full"
                    />
                    {form.formState.errors.unidadMedida && (
                    <p className="text-red-500 text-sm">
                        {form.formState.errors.unidadMedida.message}
                    </p>
                    )}
                </div>

                <div className="space-y-4">
                    <h4 className="text-md font-medium text-foreground">Gestión de Stock</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="stockActual" className="text-sm font-medium">
                        Stock Actual <span className="text-red-500">*</span>
                        </Label>
                        <Input
                        id="stockActual"
                        type="number"
                        min="0"
                        {...form.register("stockActual", { valueAsNumber: true })}
                        className="w-full"
                        placeholder="0"
                        />
                        {form.formState.errors.stockActual && (
                        <p className="text-red-500 text-sm">
                            {form.formState.errors.stockActual.message}
                        </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stockMinimo" className="text-sm font-medium">
                        Stock Mínimo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                        id="stockMinimo"
                        type="number"
                        min="0"
                        {...form.register("stockMinimo", { valueAsNumber: true })}
                        className="w-full"
                        placeholder="0"
                        />
                        {form.formState.errors.stockMinimo && (
                        <p className="text-red-500 text-sm">
                            {form.formState.errors.stockMinimo.message}
                        </p>
                        )}
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="stockMaximo" className="text-sm font-medium">
                        Stock Máximo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="stockMaximo"
                        type="number"
                        min="0"
                        {...form.register("stockMaximo", { valueAsNumber: true })}
                        className="w-full"
                        placeholder="0"
                    />
                    {form.formState.errors.stockMaximo && (
                        <p className="text-red-500 text-sm">
                        {form.formState.errors.stockMaximo.message}
                        </p>
                    )}
                    </div>
                </div>
                </div>
            </div>

            <DialogFooter className="pt-6 border-t">
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={()=>onOpenChange(false)}>
                    Cancelar
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                    <span className="flex items-center gap-2">
                    Guardar Producto
                    </span>
                </Button>
                </div>
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
                                    <Link to={"/productos"} className="mt-6">
                                        <Button onClick={()=>{
                                            onOpenChange(false)
                                            setEstado("inicio")  // Reiniciar estado al cerrar el diálogo
                                        }}>
                                            Finalizar
                                        </Button>
                                    </Link>
                                </div>
                </DialogContent>
            )}


        </Dialog>
    )
}