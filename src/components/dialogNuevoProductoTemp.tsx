"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useListaProductos } from "@/hooks/listaProductos";
import type { Producto } from "@/types/Productos";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";


type DialogProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    busquedaRef?: React.RefObject<{ focus: () => void } | null>;
};

const productoTempSchema = z.object({
    nombreProducto: z.string().min(2, { message: "El nombre del producto debe tener al menos 2 caracteres" }),
    precio: z.number().min(0, { message: "El precio debe ser un número positivo" }),
    descripcion: z.string().optional(),
    unidadMedida: z.string().optional(),
});

export default function DialogNuevoProductoTemp({ isOpen, setIsOpen, busquedaRef }: DialogProps) {
    const { addProduct } = useListaProductos();

    const form = useForm<z.infer<typeof productoTempSchema>>({
        resolver: zodResolver(productoTempSchema),
        defaultValues: {
            nombreProducto: "",
            precio: 0,
            descripcion: "",
            unidadMedida: "",
        },
    });

    const onSubmit = (values: z.infer<typeof productoTempSchema>) => {
        // Generar un id temporal único
        const idProducto = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

        const productoTemporal: Producto = {
            idProducto,
            nombreProducto: values.nombreProducto,
            precio: values.precio,
            descripcion: values.descripcion || "",
            idCategoria: 1, // categoría temporal
            idEstado: 1,
            stockActual: 999,
            stockMinimo: 0,
            stockMaximo: 0,
            unidadMedida: values.unidadMedida || "",
        };

        addProduct(productoTemporal);
        toast.success("Producto temporal agregado al carrito");
        form.reset();
        setIsOpen(false);

        setTimeout(() => {
            busquedaRef?.current?.focus();
        }, 100);
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            setIsOpen(!isOpen)
             setTimeout(() => {
                busquedaRef?.current?.focus();
            }, 100);

        }}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-2xl font-bold text-center">Agregar Producto Temporal</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            Crea un producto temporal que se agregará directamente al carrito y solo quedará registrado con la venta.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombreProducto">Nombre del Producto <span className="text-red-500">*</span></Label>
                            <Input id="nombreProducto" {...form.register("nombreProducto")} placeholder="Ej: Gaseosa 500ml" />
                            {form.formState.errors.nombreProducto && (
                                <p className="text-red-500 text-sm">{form.formState.errors.nombreProducto.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="precio">Precio <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                <Input id="precio" type="number" step="0.01" min="0" {...form.register("precio", { valueAsNumber: true })} className="pl-8" placeholder="0.00" />
                            </div>
                            {form.formState.errors.precio && (
                                <p className="text-red-500 text-sm">{form.formState.errors.precio.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unidadMedida">Unidad de medida</Label>
                            <Input id="unidadMedida" {...form.register("unidadMedida")} placeholder="Ej: pieza, kg" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea id="descripcion" {...form.register("descripcion")} placeholder="Opcional" className="min-h-[80px] resize-none" />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        <div className="flex w-full gap-3">
                            
                            <Button type="submit" className="w-full bg-red-600">
                                Agregar al carrito
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
