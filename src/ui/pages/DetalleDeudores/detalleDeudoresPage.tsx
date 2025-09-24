import { useNavigate, useSearchParams } from "react-router"
import DetalleReportDeudores from "./components/detalleReport";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { obtenerDeudor } from "@/api/deudores/deudores";
import type { Deudores } from "@/types/deudores";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Busqueda } from "../Home/components/busqueda";

export default function DetalleDeudoresPage(){

  const [searchParams] = useSearchParams();
  const idDeudor = searchParams.get("id");
  const [deudor,setDeudor]=useState<Deudores>();
  const navigate=useNavigate();

    useEffect(()=>{
        obtenerDeudor(Number(idDeudor)).then(res=>{
            if(res){
              setDeudor(res)
            }
        })
    },[idDeudor])
  
    if (!idDeudor) {
        return (
          <div className="bg-white pt-10 flex flex-col items-center justify-center">
            <div className="text-center text-red-500">
              <h2 className="text-2xl font-bold mb-4">Error</h2>
              <p>ID de venta no especificado</p>
            </div>
          </div>
        );
    }

    return(
        <div>
            <div className="bg-white px-10 py-5">
                <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600 hover:text-white cursor-pointer"
                    onClick={()=>navigate("/deudores")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Regresar
                </Button>
            </div>
            <section className="bg-white p-10">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-red-500">Detalle de Deudas</h2>
                <div className="flex flex-wrap gap-4 items-center">
                <span className="font-semibold">Deudor:{deudor?.idDeudor}</span>
                <span>{deudor?.nombreDeudor}</span>
                <Badge variant={"outline"} className={`${deudor?.isActivo==1?"bg-green-500 p-2 text-white":"bg-gray-600"}`} >{deudor?.isActivo==1?"Activo":"Inactivo"}</Badge>
                </div>
            </div>
            </section>
            <section className="bg-white px-10 py-5">
              <Busqueda id={Number(idDeudor)} ></Busqueda>
            </section>
            <section>
            <DetalleReportDeudores id={Number(idDeudor)}></DetalleReportDeudores> 
            </section>
             
        </div>
        
    )
}