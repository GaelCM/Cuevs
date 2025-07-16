import { getCategoriaById} from "@/api/categoriasLocal/categoriasLocal";
import { useEffect} from "react";
import { useNavigate, useSearchParams} from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";


const categoriaSchema = z.object({
    idCategoria: z.number(),
    categoriaName: z.string().min(2, {
        message: "El nombre de la categoría debe tener al menos 2 caracteres",
    }),
});

export default function EditCategoriasPage() {
    const [searchParams] = useSearchParams();
    const idCategoria = searchParams.get("id");
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof categoriaSchema>>({
        resolver: zodResolver(categoriaSchema),
        defaultValues: {
            idCategoria: 0,
            categoriaName: "",
        },
    });

    useEffect(() => {
        if (idCategoria) {
            getCategoriaById(Number(idCategoria)).then((res) => {
                if (res) {
                    form.reset({
                        idCategoria: res.idCategoria,
                        categoriaName: res.categoriaName,
                    });
                } else {
                    console.error("Error al obtener la categoría");
                }
            });
        }
    }, [idCategoria, form]);

    const onSubmit = async (values: z.infer<typeof categoriaSchema>) => {
       console.log("Valores del formulario:", values);
    };

    return (
        <div className="min-h-screen bg-white px-4 py-5 flex flex-col">
            <section className="flex justify-between pt-8">
                <div>
                    <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600 hover:text-white cursor-pointer"
                    onClick={()=>navigate("/categorias")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Regresar
                    </Button>
                </div>
                <div className="flex flex-grow justify-center">
                    <h1 className="text-red-500 text-3xl font-bold mr-20">Editar Categoría</h1>
                </div>
            </section>

            <section className="flex justify-center mt-8">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="rounded-xl shadow-md p-8 w-full max-w-md space-y-6"
                >
                    <div>
                        <Label htmlFor="idCategoria">Código</Label>
                        <Input
                            type="number"
                            id="idCategoria"
                            {...form.register("idCategoria", { valueAsNumber: true })}
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
                    <Button type="submit" className="w-full bg-red-500 hover:bg-red-700 cursor-pointer">Guardar Cambios</Button>
                </form>
            </section>
        </div>
    );
}