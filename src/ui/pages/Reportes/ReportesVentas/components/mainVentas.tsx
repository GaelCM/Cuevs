"use client"

import { Button } from "@/components/ui/button";
import TablaVentas from "./tablaVentas";
import { useEffect, useState } from "react";
import { obtenerReporteVentas } from "@/api/ventasLocal/ventasLocal";
import type { Venta } from "@/types/ventas";



export default function MainVentas(){
 

    const [fechaDesde, setFechaDesde] = useState<string>(new Date().toISOString().split('T')[0]);
    const [fechaHasta, setFechaHasta] = useState<string>(new Date().toISOString().split('T')[0]);
    const [ventas, setVentas] = useState<Venta[]>([]);


    useEffect(()=>{
        const buscarVentas=async()=>{
            const res=await obtenerReporteVentas(fechaDesde,fechaHasta);
            if(res){
                setVentas(res);
            }
        }   
        buscarVentas();
    },[fechaDesde,fechaHasta]);

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

            <section className="px-10">
                <TablaVentas ventas={ventas} />
            </section>
        </>
    )
}