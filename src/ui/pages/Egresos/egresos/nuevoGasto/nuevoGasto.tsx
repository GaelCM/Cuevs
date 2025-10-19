
import { insertargastoApi } from "@/api/gastos/gastosLocal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import type { GastoInput } from "@/types/gastos";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Receipt, } from "lucide-react";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";


// Schema de validación para gastos
const gastoSchema = z.object({
  monto: z.string()
    .min(1, "El monto es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Debe ser un número mayor a 0"),
  concepto: z.string().min(1, "El concepto es requerido")
});




export default function NuevoGasto() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof gastoSchema>>({
    resolver: zodResolver(gastoSchema),
    defaultValues: {
      monto: "",
      concepto: ""
    },
  });

  const registrarGasto = async (values: z.infer<typeof gastoSchema>) => {
    setIsLoading(true);
    
    try {
      const nuevoGasto: GastoInput = {
        fechaRegistro: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        monto: Number(values.monto),
        concepto: values.concepto
      };

      // Aquí llamarías a tu API para insertar el gasto
      const res = await insertargastoApi(nuevoGasto);
      
      if (!res?.success) {
        toast.error('Error al registrar el gasto', {
          description: `${res?.message}`,
        });
      } else {
        form.reset();
        toast.success('Gasto registrado correctamente', {
          description: `El gasto se ha registrado correctamente`,
        });
        navigate("/compras");
      }
    } catch (error) {
      toast.error('Error al registrar el gasto', {
        description: 'Ocurrió un error inesperado ',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center space-x-2">
              <Receipt className="h-8 w-8 text-orange-500" />
              <h1 className="text-3xl text-center font-bold text-gray-900">Nuevo Gasto</h1>
            </div>
          </div>
          <Button 
            variant="destructive" 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[40dvh]">
          <h1>Cargando...</h1>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-orange-500" />
              <span>Registrar Nuevo Gasto</span>
            </CardTitle>
            <CardDescription>
              Complete los datos del gasto. La fecha se generará automáticamente al guardar.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={form.handleSubmit(registrarGasto)} className="space-y-6">
              
              {/* Monto */}
              <div className="space-y-2">
                <Label htmlFor="monto" className="text-sm font-medium">
                  Monto <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...form.register("monto")}
                    className="w-full pl-8"
                  />
                </div>
                {form.formState.errors.monto && (
                  <p className="text-sm text-red-600">{form.formState.errors.monto.message}</p>
                )}
              </div>

              {/* Concepto */}
              <div className="space-y-2">
                <Label htmlFor="concepto" className="text-sm font-medium">
                  Concepto <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="concepto"
                  placeholder="Describe el motivo o concepto del gasto"
                  {...form.register("concepto")}
                  className="w-full min-h-[120px]"
                />
                {form.formState.errors.concepto && (
                  <p className="text-sm text-red-600">{form.formState.errors.concepto.message}</p>
                )}
              </div>

              {/* Información adicional */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Receipt className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="text-sm text-orange-700">
                    <p className="font-medium">Información del registro:</p>
                    <p>• La fecha se registrará automáticamente como hoy</p>
                    <p>• Asegúrate de que el monto y concepto sean correctos</p>
                    <p>• Este gasto aparecerá en la sección de Egresos</p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isLoading}
                >
                  Limpiar
                </Button>
                <Button 
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isLoading ? 'Guardando...' : 'Guardar Gasto'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}