

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { insertarDeudorApi } from "@/api/deudores/deudores";
import { toast } from "sonner";

type DialogNuevoDeudorProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const nuevoDeudorSchema = z.object({
    nombreDeudor: z.string().min(2, {
        message: "El nombre del deudor debe tener al menos 2 caracteres",
    }),
    isActivo: z.enum(["1", "0"], {
        errorMap: () => ({ message: "Debe seleccionar un estado" }),
    }),
});



export default function DialogNuevoDeudor({ open, onOpenChange }: DialogNuevoDeudorProps) {
    const form = useForm<z.infer<typeof nuevoDeudorSchema>>({
        resolver: zodResolver(nuevoDeudorSchema),
        defaultValues: {
            nombreDeudor: "",
            isActivo: "1",
        },
    });

    const insertarNuevoDeudor = async (data: z.infer<typeof nuevoDeudorSchema>) => {
    console.log(data)
    const res=await insertarDeudorApi({
        idDeudor: 0, // Asignar un ID temporal, el backend debería manejar la creación del ID
        nombreDeudor: data.nombreDeudor,
        isActivo: data.isActivo === "1" ? 1 : 0,
    });
    if(res?.success){
        toast.success("Deudor agregado correctamente");
        onOpenChange(false);
    }else{
        toast.error("Error al agregar el deudor: " + res?.message);
        onOpenChange(false);
    }
}

    return (
        <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
            <DialogContent className="sm:max-w-lg">
                <form  onSubmit={form.handleSubmit(insertarNuevoDeudor)}>
                    <DialogHeader className="pb-6">
                        <DialogTitle className="text-2xl font-bold text-center">
                            Agregar Nuevo Deudor
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            Complete los campos requeridos para registrar un nuevo deudor.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombreDeudor" className="text-sm font-medium">
                                Nombre del Deudor <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nombreDeudor"
                                {...form.register("nombreDeudor")}
                                placeholder="Ingrese el nombre del deudor"
                                className="w-full"
                            />
                            {form.formState.errors.nombreDeudor && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.nombreDeudor.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="isActivo" className="text-sm font-medium">
                                Estado <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="1"
                                        {...form.register("isActivo")}
                                        checked={form.watch("isActivo") === "1"}
                                    />
                                    Activo
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="0"
                                        {...form.register("isActivo")}
                                        checked={form.watch("isActivo") === "0"}
                                    />
                                    Inactivo
                                </label>
                            </div>
                            {form.formState.errors.isActivo && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.isActivo.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-6 border-t">
                        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => {
                                onOpenChange(false); 
                                form.reset();
                            }}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="w-full sm:w-auto">
                                Guardar Deudor
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}