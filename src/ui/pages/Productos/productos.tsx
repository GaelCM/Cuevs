import NuevoProductoSection from "./components/NuevoProducto";
import TablaDeProductos from "./components/TablaDeProductos";
import { useState } from "react";


export function ProductosPage() {
    const [isNuevoProductoOpen, setIsNuevoProductoOpen] = useState(false);

    return (
        <>
            <div className="px-15 py-5 bg-white flex flex-col">
                <div className="flex justify-center">
                    <p className='text-3xl font-bold text-red-500 p-2'>
                        Administre sus productos
                    </p>
                </div>
                <NuevoProductoSection open={isNuevoProductoOpen} setOpen={setIsNuevoProductoOpen} />
                <section className="pt-5 pb-5">
                    <TablaDeProductos isExternalModalOpen={isNuevoProductoOpen} />
                </section>
            </div>
        </>
    )
}