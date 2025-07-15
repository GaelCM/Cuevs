import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useListaProductos } from "@/hooks/listaProductos";
import { formatCurrency } from "@/lib/utils";
import type { Producto } from "@/types/Productos";
import { Barcode, CircleX, Info, Package } from "lucide-react";



type DialogProductoProps ={
    product:Producto | null 
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}


export default function DialogProducto({product, isOpen, onOpenChange} :DialogProductoProps) {

    const {addProduct}=useListaProductos()

    const agregarProducto=()=>{
        if(product){
            addProduct(product)
        }
        onOpenChange(false)
    }

    return(
      <Dialog open={isOpen} onOpenChange={() => onOpenChange(!isOpen)}>
      <DialogContent className="sm:max-w-[750px] p-0 "> {/* Ajusta max-w si es necesario, quitamos padding general */}
          <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Package size={24} /> {/* Icono de paquete */}
                  Información del Producto
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                  Detalles del producto escaneado o buscado.
              </DialogDescription>
          </DialogHeader>

          {!product ? (
              // --- Estado Producto No Encontrado ---
              <div className="flex flex-col items-center justify-center p-10 gap-4 text-center min-h-[200px]">
                  <CircleX width={60} height={60} className="text-red-500" />
                  <h2 className="text-xl font-semibold text-gray-700">Producto no encontrado</h2>
                  <p className="text-gray-500">El código o nombre buscado no está registrado en el sistema.</p>
              </div>
          ) : (
              // --- Estado Producto Encontrado ---
              <div className="gap-6 p-6 pt-0 flex flex-col items-center "> {/* Grid para layout */}

                  {/* Columna 2 y 3: Detalles */}
                  <div className=" w-[100%] flex flex-col items-center space-y-4">
                      {/* Nombre del Producto */}
                      <h2 className="text-7xl text-center font-semibold p-2">{product.nombreProducto}</h2>

                      {/* Precio */}
                      <div className="flex items-center gap-2 bg-green-100  px-4 py-2 rounded-md ">
                          <span className="text-6xl font-extrabold">
                              {formatCurrency(product.precio)}
                          </span>
                      </div>

                      {/* Descripción */}
                      {product.descripcion && (
                          <div className="flex items-start gap-2 pt-2">
                              <Info size={18} className="text-gray-500 mt-1 flex-shrink-0" />
                              <p className="text-m text-gray-600">{product.descripcion}</p>
                          </div>
                      )}

                      {/* ID del Producto / Código */}
                      <div className="flex items-center gap-2 text-m text-gray-500 pt-2">
                          <Barcode size={18} />
                          <span>Código: {product.idProducto}</span>
                      </div>

                      
                  </div>
              </div>
          )}

          {/* --- Footer --- */}
          <DialogFooter className="bg-gray-50 p-4 border-t"> {/* Fondo sutil para el footer */}
              
              {!product?(
                 <Button variant="outline" onClick={() => onOpenChange(false)}> {/* Variante outline puede ser más suave */}
                 cerrar
             </Button>
              ):(
                <Button variant="outline" className="bg-green-200"  onClick={() => agregarProducto()}> {/* Variante outline puede ser más suave */}
                  Agregar producto
              </Button>
              )}
              
          </DialogFooter>
      </DialogContent>
  </Dialog>
    )
}
    