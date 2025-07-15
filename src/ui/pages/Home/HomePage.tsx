import Bar from "@/components/bar";
import { Reloj } from "./components/reloj";
import { ListaProductos } from "./components/listaProductos";

export function HomePage(){
    return (
        <div className="p-10 mr-64">
          <Bar></Bar>
          <section>
            <Reloj></Reloj>
          </section>
          <section>
            <ListaProductos></ListaProductos>
          </section>
          <section>
            
          </section>
        </div>
      );
}