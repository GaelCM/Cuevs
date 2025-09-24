import Bar from "@/components/bar";
import { Reloj } from "./components/reloj";
import { ListaProductos } from "./components/listaProductos";
import { useRef, useState } from "react";
import DialogProductos from "./components/DialogProductos";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { IniciarTurno } from "./components/iniciarTurno";
import { useTurnoStore } from "@/hooks/turno";


export function HomePage(){
  const [isOpen,setIsOpen]=useState(false)
  const {turnoActivo}=useTurnoStore();
  const busquedaRef = useRef<{ focus: () => void } | null>(null);

    return (
      <>
        {turnoActivo?(<div className="p-10 mr-64">
          <Bar busquedaRef={busquedaRef}></Bar>
          <section>
            <Reloj></Reloj>
          </section>
          <section>
            <Button onClick={()=>{setIsOpen(true)}} className="text-md bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 hover:cursor-pointer">
              <Search></Search>
              Buscar Productos
            </Button>
          </section>
          <section>
            <ListaProductos busquedaRef={busquedaRef}></ListaProductos>
          </section>
          <section>
            <DialogProductos isOpen={isOpen} onOpenChange={setIsOpen}></DialogProductos>
          </section>
        </div>)

        :(
          <IniciarTurno></IniciarTurno>
        )}

        
      </>
      );
}