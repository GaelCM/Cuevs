import { obtenerComprasApi, obtenerTotalComprasApi } from "@/api/compras/comprasLocal";
import { Button } from "@/components/ui/button";
import type { compra } from "@/types/compras";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CirclePlus, Receipt, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import ListaCompras from "./compras/components/listaCompras";
import type { Gasto } from "@/types/gastos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ListaGastos from "./egresos/components/listaGastos";
import { obtenergastosApi, obtenerTotalgastosApi } from "@/api/gastos/gastosLocal";


export default function EgresosPage(){
    const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd');
    
        const [fechaDesde, setFechaDesde] = useState<string>(fechaFormateada);
        const [fechaHasta, setFechaHasta] = useState<string>(fechaFormateada);
        const [totalCompras, setTotalCompras]=useState<number>(0.00);
        const [compras, setCompras] = useState<compra[]>([]);
        const [totalGastos, setTotalGastos]=useState<number>(0.00);
        const [gastos, setGastos] = useState<Gasto[]>([]);

        useEffect(()=>{
            obtenerComprasApi(fechaDesde,fechaHasta).then(res=>{
                if(res?.success){
                    setCompras(res.data)
                }
            })
            
            obtenerTotalComprasApi(fechaDesde,fechaHasta).then(res=>{
                if(res){
                    setTotalCompras(res[0].total)
                }
            })

            obtenergastosApi(fechaDesde,fechaHasta).then(res=>{
                if(res?.success){
                    setGastos(res.data)
                }
            })
            
            obtenerTotalgastosApi(fechaDesde,fechaHasta).then(res=>{
                if(res){
                    setTotalGastos(res[0].total)
                }
            })

        },[fechaDesde,fechaHasta])

        const totalEgresos = totalCompras + totalGastos;
    
    return (
    <div className="flex flex-col items-center bg-white">
      <section className="py-5 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Mis Egresos</h1> 
      </section>
      
      {/* Filtros de fecha */}
      <section className="w-full px-4 mb-6">
        <div className="flex gap-4 items-end justify-center flex-wrap">
          <div className="space-y-2">
            <Label htmlFor="fecha-desde" className="text-sm font-medium text-red-500">
              Fecha desde
            </Label>
            <Input
              id="fecha-desde"
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-40"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fecha-hasta" className="text-sm font-medium text-red-500">
              Fecha hasta
            </Label>
            <Input
              id="fecha-hasta"
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-40"
            />
          </div>
          
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            Buscar
          </Button>
        </div>
      </section>

      {/* Resumen total */}
      {totalEgresos > 0 && (
        <section className="w-full flex justify-end px-15 mb-6">
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 rounded-md">
              <p className="text-lg font-bold">
                Total Egresos: {totalEgresos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tabs para Compras y Gastos */}
      <section className="w-full px-15">
        <Tabs defaultValue="compras" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="compras" className="flex items-center gap-2">
                <ShoppingCart size={16} />
                Compras
              </TabsTrigger>
              <TabsTrigger value="gastos" className="flex items-center gap-2">
                <Receipt size={16} />
                Gastos
              </TabsTrigger>
            </TabsList>
            
            {/* Botones de acción */}
            <div className="flex gap-2">
              <Link 
                to="/compras/nuevaCompra" 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 text-sm"
              >
                <CirclePlus size={16} />
                Nueva compra
              </Link>
              
              <Link 
                to="/gastos/nuevoGasto" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 text-sm"
              >
                <CirclePlus size={16} />
                Nuevo gasto
              </Link>
            </div>
          </div>

          {/* Contenido de Compras */}
          <TabsContent value="compras" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Lista de Compras</h2>
              {totalCompras > 0 && (
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md">
                  <p className="font-medium">
                    Total: {totalCompras.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                  </p>
                </div>
              )}
            </div>
            <ListaCompras compras={compras} />
          </TabsContent>

          {/* Contenido de Gastos */}
          <TabsContent value="gastos" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Lista de Gastos</h2>
              {totalGastos > 0 && (
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-md">
                  <p className="font-medium">
                    Total: {totalGastos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                  </p>
                </div>
              )}
            </div>
            <ListaGastos gastos={gastos} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}