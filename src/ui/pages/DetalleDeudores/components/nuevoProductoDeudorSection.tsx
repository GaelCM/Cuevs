import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import DialogNuevoDeudor from "../../Deudores/components/dialogNuevoDeudor";


export default function NuevoProductoDeudorSection(){
    const [open, setOpen] = useState(false);
    return(
    
        <div>
            <div className="flex justify-center p-5  md:justify-end md:p-0  ">   

        <Button onClick={()=>{setOpen(!open)}} className="text-md bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 cursor-pointer">
            <CirclePlus size={10}  />
            Agregar Producto
        </Button>
        </div>

        <DialogNuevoDeudor 
            open={open} 
            onOpenChange={setOpen} 
        />
        </div>
    )
}