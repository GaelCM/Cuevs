import { insertarCompraApi } from "@/api/compras/comprasLocal";
import { getProveedores } from "@/api/proveedores/proveedoresLocal";
import { obtenerUsuariosPublicos } from "@/api/usuarios/usuarios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Proveedor } from "@/types/proveedores";
import type { UsuarioPublico } from "@/types/Usuarios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";


// Schema de validación con Zod
const compraSchema = z.object({
  idProveedor: z.string().min(1, "Debe seleccionar un proveedor"),
  totalCompra: z.string()
    .min(1, "El total es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Debe ser un número mayor a 0"),
  idUsuario: z.string().min(1, "Debe seleccionar un proveedor"),
  numeroFactura: z.string(),
  idEstado: z.string().min(1, "Debe seleccionar un estado"),
  concepto: z.string()
});


const estados = [
  { id: "1", nombre: "Activo" },
  { id: "2", nombre: "Cancelado" },
  { id: "3", nombre: "Pendiente" }
];

export default function NuevaCompra() {

    const [isLoading,setIsLoading]=useState(false);
    const [proveedores,setProvedores]=useState<Proveedor[]>([]);
    const [usuarios,setUsuarios]=useState<UsuarioPublico[]>([]);
    const navigate=useNavigate();
   

    useEffect(()=>{
        const obtenerProvedores=async()=>{
                    const prove=await getProveedores()
                    if(prove){
                        setProvedores(prove)
                    }
        }
         const obtenerUsuarios=async()=>{
                    const users=await obtenerUsuariosPublicos()
                    if(users){
                        setUsuarios(users)
                        setIsLoading(false)
                    }
        }
        setIsLoading(false)        
        obtenerProvedores()
        obtenerUsuarios()
    },[])

    const form = useForm<z.infer<typeof compraSchema>>({
            resolver: zodResolver(compraSchema),
            defaultValues: {
                idProveedor:"",
                totalCompra:"",
                idUsuario:"1",
                numeroFactura:"",
                idEstado:"0",
                concepto:""
            },
    });

    const registrarCompra =async(values: z.infer<typeof compraSchema>)=>{
        const res=await insertarCompraApi({
          idCompra:0,
          idProveedor:parseInt(values.idProveedor),
          fechaCompra:"",
          totalCompra:Number(values.totalCompra),
          idUsuario:parseInt(values.idUsuario),
          numeroFactura:values.numeroFactura,
          idEstado:parseInt(values.idEstado),
          concepto:values.concepto
        })
        if(!res?.success){
            toast.error('Error al registrar el producto', {
                description:`${res?.message}`,})
        }else{
            form.reset();
            toast.success('Compra registrado correctamente', {
                description:`La compra se ha registrado correctamente`,})
            navigate("/compras")
        }
    }
  

  return (
    <div className="bg-gray-50 p-6">
      {/* Header similar al diseño */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl text-center font-bold text-gray-900">Nueva Compra</h1>
            </div>
          </div>
          <Button 
            variant="destructive" 
            className="bg-red-500 hover:bg-red-600"
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </div>
      </div>

      {isLoading?(
        <div className="flex justify-center items-center h-[40dvh]">
             <h1>cargandoo.....</h1>
        </div>
        )
        :(
            <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-red-500" />
            <span>Registrar Nueva Compra</span>
          </CardTitle>
          <CardDescription>
            Complete los datos de la compra. La fecha se generará automáticamente al guardar.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(registrarCompra)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Proveedor */}
              <div className="space-y-2">
                <Label htmlFor="proveedor" className="text-sm font-medium">
                  Proveedor <span className="text-red-500">*</span>
                </Label>
                <Select 
                  onValueChange={(value) => form.setValue("idProveedor", value)}
                  value={form.watch("idProveedor")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem key={proveedor.idProveedor} value={proveedor.idProveedor?.toString()||""}>
                        {proveedor.nombreProveedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.idProveedor && (
                  <p className="text-sm text-red-600">{form.formState.errors.idProveedor.message}</p>
                )}
              </div>

              {/* Total de Compra */}
              <div className="space-y-2">
                <Label htmlFor="totalCompra" className="text-sm font-medium">
                  Total de Compra <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalCompra"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...form.register("totalCompra")}
                  className="w-full"
                />
                {form.formState.errors.totalCompra && (
                  <p className="text-sm text-red-600">{form.formState.errors.totalCompra.message}</p>
                )}
              </div>

              {/* Usuario */}
              <div className="space-y-2">
                <Label htmlFor="usuario" className="text-sm font-medium">
                  Usuario
                </Label>
                <Select 
                  onValueChange={(value) => form.setValue("idUsuario", value)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar usuario (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario.idUsuario} value={usuario.idUsuario.toString()}>
                        {usuario.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Número de Factura */}
              <div className="space-y-2">
                <Label htmlFor="numeroFactura" className="text-sm font-medium">
                  Número de Factura
                </Label>
                <Input
                  id="numeroFactura"
                  type="text"
                  placeholder="Ingrese el número de factura"
                  {...form.register("numeroFactura")}
                  className="w-full"
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium">
                  Estado
                </Label>
                <Select 
                  onValueChange={(value) => form.setValue("idEstado", value)}
                  defaultValue="1"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem key={estado.id} value={estado.id}>
                        {estado.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Concepto */}
            <div className="space-y-2">
              <Label htmlFor="concepto" className="text-sm font-medium">
                Concepto
              </Label>
              <Textarea
                id="concepto"
                placeholder="Descripción o concepto de la compra (opcional)"
                {...form.register("concepto")}
                className="w-full min-h-[100px]"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => form.reset()}
              >
                Limpiar
              </Button>
              <Button 
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Guardar Compra
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}
     
    </div>
  );
}