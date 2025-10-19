"use client";


import { Busqueda } from "./busqueda";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListaProductos } from "@/hooks/listaProductos";


interface ListaProductosProps {
    busquedaRef: React.RefObject<{ focus: () => void } | null>;
}

export function ListaProductos({ busquedaRef }: ListaProductosProps) {

    const {carrito,incrementQuantity,decrementQuantity,removeProduct}=useListaProductos()
   
    return(
        <div className="mx-auto max-w-screen-2xl px-4 py-5 2xl:px-0">
    <div className="mx-18">
        <div className="py-10">
        <Busqueda ref={busquedaRef}></Busqueda>
        </div>
        <h2 className="text-xl text-center font-light text-gray-900 dark:text-white sm:text-2xl">Lista de productos</h2>
    </div>
    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
      <div className="mx-auto w-full flex-none lg:w-[90%]">

        {carrito.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">No hay productos en el carrito</h1>
          </div>
        )}

        <div className="space-y-6">

         {carrito.map(producto=>(

        <div
        key={producto.product.idProducto}
        className="flex items-center gap-4 py-3 px-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
        >
            {/* 2. Nombre y Precio Unitario */}
            <div className="flex-grow min-w-0"> {/* min-w-0 previene que el flex item se desborde */}
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate"> {/* truncate para nombres largos */}
                    {producto.product.nombreProducto}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatCurrency(producto.product.precio)} c/u {/* "c/u" = cada uno */}
                </p>
            </div>

            {/* 3. Contador de Cantidad */}
            <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={()=>decrementQuantity(producto.product.idProducto)} 
                    //disabled={quantity <= 1} // Deshabilitar botón de resta si la cantidad es 1
                >
                    <Minus size={14} />
                </Button>

                {/* Opción A: Mostrar cantidad como texto (más simple) */}
                <span className="text-sm font-medium w-8 text-center text-gray-900 dark:text-gray-100">
                    {producto.quantity}
                </span>

                {/* Opción B: Usar un Input (si necesitas entrada directa) */}
                {/* <Input
                    type="number"
                    className="w-12 h-7 text-center border-gray-300 dark:border-gray-600 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={quantity}
                    onChange={handleInputChange}
                    min="1"
                /> */}

                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={()=>incrementQuantity(producto.product.idProducto)}
                >
                    <Plus size={14} />
                </Button>
            </div>

            {/* 4. Subtotal del Item */}
            <div className="w-24 text-right flex-shrink-0"> {/* Ancho fijo ayuda a alinear */}
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(producto.product.precio * producto.quantity)}
                </p>
            </div>

            {/* 5. Botón Eliminar */}
            <div className="flex-shrink-0">
                <Button
                    variant="ghost" // 'ghost' para que no tenga tanto peso visual
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    onClick={()=>{
                        removeProduct(producto.product.idProducto)
                        setTimeout(() => {
                                busquedaRef?.current?.focus();
                        }, 100);           
                    }}
                >
                    <Trash2 />
                </Button>
            </div>
        </div>
                  
))}          

</div>
</div>
 </div>
</div>
    )
}