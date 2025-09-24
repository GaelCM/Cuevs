import { obtenerComprasApi, obtenerTotalComprasApi } from "@/api/compras/comprasLocal";
import { Button } from "@/components/ui/button";
import type { compra } from "@/types/compras";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import ListaCompras from "./components/listaCompras";


export default function ComprasPage(){
    const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd');
    
        const [fechaDesde, setFechaDesde] = useState<string>(fechaFormateada);
        const [fechaHasta, setFechaHasta] = useState<string>(fechaFormateada);
        const [totalCompras, setTotalCompras]=useState<number>(0.00);
        const [compras, setCompras] = useState<compra[]>([]);

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

        },[fechaDesde,fechaHasta])
    
    return(
        <div className="flex flex-col items-center bg-white ">
            <section className="py-5 text-center">
                <h1 className="text-3xl font-bold text-red-500 mb-6">Mis Compras</h1> 
            </section>
            <div className="flex w-full justify-end px-14">   
            <Link to={"/compras/nuevaCompra"}  className="text-md bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2">
                <CirclePlus size={20}  />
                Nueva compra
            </Link>
            </div>
            <section>
                <div className="flex gap-2 items-center">
                    <p className="text-xl font-bold text-red-500 p-5">Fecha desde</p>
                    <input type="date" defaultValue={fechaDesde} onChange={(e)=>setFechaDesde(e.target.value)} />
                    <p>-</p>
                    <p className="text-xl font-bold text-red-500 p-5">Fecha hasta</p>
                    <input type="date" defaultValue={fechaHasta} onChange={(e)=>setFechaHasta(e.target.value)} />
                    <Button className="bg-red-500 hover:bg-red-600 text-white p-2 ml-5 rounded-md" >Buscar</Button>
                 </div>
            </section>
            <section className="w-full">
                <section className="px-10 mb-5">
                {totalCompras>0 &&(
                    <div className="flex justify-end">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-md">
                        <p className="text-lg font-bold">Total de ventas: {totalCompras.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                    </div>)
                }
            </section>
            </section>
            <section className="w-full px-15">
                    <ListaCompras compras={compras}></ListaCompras>
            </section>
        </div>
    )
}