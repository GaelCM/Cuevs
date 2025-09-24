import { toZonedTime } from "date-fns-tz";
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CortesDetail from "./components/cortesDetail";
import type { CorteCajaReporte, ResumenDiarioCorteReporte } from "@/types/cortesResponse";
import { obtenerDetalleCortesApi, obtenerResumenDiarioCortesApi } from "@/api/cortesDashboard/cortesDashboard";

export default function CortesPage(){
    const timeZone = 'America/Mexico_City';
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone);
        const fechaFormateada = format(zonedDate, 'yyyy-MM-dd');
    
        const [fechaDesde, setFechaDesde] = useState<string>(fechaFormateada);
        const [fechaHasta, setFechaHasta] = useState<string>(fechaFormateada);
        const [detalleCortes,setDetalleCortes]=useState<CorteCajaReporte[]>();
        const [resumenCortes,setResumenCortes]=useState<ResumenDiarioCorteReporte[]>();

        useEffect(()=>{
            obtenerDetalleCortesApi(fechaDesde,fechaHasta).then(res => {
                  if (res) {
                    setDetalleCortes(res.data);
                  } else {
                    setDetalleCortes([]);
                  }
                });

            obtenerResumenDiarioCortesApi(fechaDesde,fechaHasta).then(res => {
                  if (res) {
                    setResumenCortes(res.data);
                  } else {
                    setResumenCortes([]);
                  }
                });    
            
        },[fechaDesde,fechaHasta])


    return(
        <div className="bg-white px-10 py-10">
            <section className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl font-bold text-red-500">Mis Cortes</h1>
                 <div className="flex gap-2 items-center p-5">
                    <p className="text-xl font-bold text-red-500 p-5">Fecha desde</p>
                    <input type="date" defaultValue={fechaDesde} onChange={(e)=>setFechaDesde(e.target.value)} />
                    <p>-</p>
                    <p className="text-xl font-bold text-red-500 p-5">Fecha hasta</p>
                    <input type="date" defaultValue={fechaHasta} onChange={(e)=>setFechaHasta(e.target.value)} />
                    <Button className="bg-red-500 hover:bg-red-600 text-white p-2 ml-5 rounded-md" >Buscar</Button>
                 </div>
            </section>

            <section>
                <CortesDetail cortes={detalleCortes||[]} resumenDiarioCortes={resumenCortes||[]} ></CortesDetail>
            </section>
        
        </div>
    )
}