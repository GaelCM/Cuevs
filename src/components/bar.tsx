

import cartel from "@/res/Cartel.png"
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import DialogConfirmVenta from "./confirmVenta";
import React from "react";
import { useListaProductos } from "@/hooks/listaProductos";



export default function Bar(){
   
   const[isOpen, setIsOpen]=React.useState(false)


   const {getTotalPrice, getTotalItems, carrito}=useListaProductos()
   
   

   const crearVenta=()=>{
      console.log("este es tu carrito")
      setIsOpen(!isOpen)
   }


    return(
         <aside id="sidebar" className="fixed hidden z-20 h-full top-0 right-0 pt-24 md:flex flex-shrink-0 flex-col w-74 transition-width duration-75" aria-label="Sidebar">
         <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
               <div className="flex-1 px-3 bg-white divide-y space-y-1">

                  <div>
                  <div className="text-center text-2xl font-bold text-gray-900 p-2">
                    <h1>TOTAL</h1>
                  </div>             
                  <input 
                  className="text-5xl w-full font-bold border bg-red-100 border-amber-700 text-center "
                  value={formatCurrency(getTotalPrice())}
                  readOnly
                    />

                  <div className="text-center mt-2 text-sm text-gray-600">
                    <p>Productos en carrito: {getTotalItems()} ({carrito.length} tipos)</p>
                  </div>

                  <div className="mt-8 flex justify-center">
                     <Button onClick={crearVenta} className="text-3xl h-20 w-full bg-red-400 hover:bg-red-600 text-black font-bold">Venta</Button>
                  </div>
                    
                  </div>

                  <div className="space-y-6 pt-4">
                     
                     <img src={cartel} alt={""} height={500}></img>
                                                                         
                  </div>

               </div>
            </div>
         </div>
         <DialogConfirmVenta isOpen={isOpen} onOpenChange={setIsOpen}></DialogConfirmVenta>
      </aside>
    )
}