import { Dialog, DialogContent } from "@/components/ui/dialog";
import TablaDeProductos from "../../Productos/components/TablaDeProductos";



type DialogProductoProps ={
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}


export default function DialogProductos({isOpen, onOpenChange} :DialogProductoProps){
    return(
        <Dialog open={isOpen} onOpenChange={()=>onOpenChange(!isOpen)} >
            <DialogContent className="p-0 w-full max-w-[95vw] sm:max-w-[950px]" style={{ maxWidth: '95vw', width: '100%', minWidth: 0 }}>
                <div className="py-4" style={{maxHeight: '70vh', overflowY: 'auto', minHeight: 0}}>
                    <TablaDeProductos />
                </div>
            </DialogContent>
        </Dialog>
    )
}