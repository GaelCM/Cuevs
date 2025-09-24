"use client"

import { Button } from "@/components/ui/button";
import TablaVentas from "./tablaVentas";
import { useEffect, useState } from "react";
import { obtenerReporteVentas, obtenerTotalVentasApi } from "@/api/ventasLocal/ventasLocal";
import type { Venta } from "@/types/ventas";
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';



export default function MainVentas(){

    const timeZone = 'America/Mexico_City';
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    const fechaFormateada = format(zonedDate, 'yyyy-MM-dd');

    const [fechaDesde, setFechaDesde] = useState<string>(fechaFormateada);
    const [fechaHasta, setFechaHasta] = useState<string>(fechaFormateada);
    const [totalVentas, setTotalVentas]=useState<number>(0.00);
    const [ventas, setVentas] = useState<Venta[]>([]);


    useEffect(()=>{
        obtenerTotalVentas();
        const buscarVentas=async()=>{
            const res=await obtenerReporteVentas(fechaDesde,fechaHasta);
            if(res){
                setVentas(res);
            }
        }   
        buscarVentas();
    },[fechaDesde,fechaHasta]);

    const obtenerTotalVentas=async()=>{
        const total=await obtenerTotalVentasApi(fechaDesde,fechaHasta);
        if(total && total.length>0){
            setTotalVentas(total[0].total);
        }
    }


    return(
        <>
            <section className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl font-bold text-red-500">Mis ventas</h1>
                 <div className="flex gap-2 items-center p-5">
                    <p className="text-xl font-bold text-red-500 p-5">Fecha desde</p>
                    <input type="date" defaultValue={fechaDesde} onChange={(e)=>setFechaDesde(e.target.value)} />
                    <p>-</p>
                    <p className="text-xl font-bold text-red-500 p-5">Fecha hasta</p>
                    <input type="date" defaultValue={fechaHasta} onChange={(e)=>setFechaHasta(e.target.value)} />
                    <Button className="bg-red-500 hover:bg-red-600 text-white p-2 ml-5 rounded-md" >Buscar</Button>
                 </div>
            </section>

            <section className="px-10 mb-5">
                {totalVentas>0 &&(
                    <div className="flex justify-end">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-md">
                        <p className="text-lg font-bold">Total de ventas: {totalVentas.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                    </div>)
                }
                
            </section>

            <section className="px-10">
                <TablaVentas ventas={ventas} />
            </section>
        </>
    )
}