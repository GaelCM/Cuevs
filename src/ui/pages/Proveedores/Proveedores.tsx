import { deleteProveedor, getProveedores } from "@/api/proveedores/proveedoresLocal"
import type { Proveedor } from "@/types/proveedores";
import { useEffect, useState } from "react"
import NuevoProveedorSection from "./components/NuevoProvedorSection";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


export default function ProveedoresPage(){
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [openConfirm, setOpenConfirm] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
    
    useEffect(()=>{
        getProveedores().
        then((proveedor)=>{
            if(proveedor){
                setProveedores(proveedor)
            }
        })
    },[])

    // Filtro de proveedores por nombre
    const proveedoresFiltrados = proveedores.filter((proveedor) =>
        proveedor.nombreProveedor.toLowerCase().includes(busqueda.toLowerCase())
    );

    const eliminarProveedor = async(id: number) => {
        const response=await deleteProveedor(id)
        if(!response?.success){
            toast.error('Error al eliminar el proveedor', {
                description: `${response?.message}`,
            });
            return;
        }else{
            toast.success('Proveedor eliminado correctamente');
            setProveedores(proveedoresFiltrados.filter((p) => p.idProveedor !== id));
        }
    }

    return(
        <div className="px-15 py-5 bg-white flex flex-col">
            <section className="flex justify-center mb-5">
                <h1 className="text-red-500 text-3xl font-bold">Mis proveedores</h1>
            </section>
            <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar proveedores por nombre..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
            </div>
            <section>
                <NuevoProveedorSection></NuevoProveedorSection>
            </section>          
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {proveedoresFiltrados.map((proveedor) => (
                    <div
                        key={proveedor.idProveedor}
                        className="bg-white rounded-lg shadow-md border border-red-200 p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-500 text-white rounded-full px-3 py-1 text-xs font-semibold">ID: {proveedor.idProveedor}</span>
                            <h2 className="text-lg font-bold text-red-500">{proveedor.nombreProveedor}</h2>
                        </div>
                        {proveedor.contacto && (
                            <div className="text-gray-700"><span className="font-semibold">Contacto:</span> {proveedor.contacto}</div>
                        )}
                        {proveedor.telefono && (
                            <div className="text-gray-700"><span className="font-semibold">Teléfono:</span> {proveedor.telefono}</div>
                        )}
                        {proveedor.email && (
                            <div className="text-gray-700"><span className="font-semibold">Email:</span> {proveedor.email}</div>
                        )}
                        {proveedor.direccion && (
                            <div className="text-gray-700"><span className="font-semibold">Dirección:</span> {proveedor.direccion}</div>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                            <Badge className={`${proveedor.idEstado ==1 ? 'bg-green-700':'bg-gray-500'}`}>
                                Estado: {proveedor.idEstado ==1 ? 'Activo':'Inactivo'}
                            </Badge>
                            <button
                                className="ml-auto p-2 rounded hover:bg-gray-100 transition-colors"
                                title="Editar proveedor"
                                // onClick={() => handleEdit(proveedor.idProveedor)}
                            >
                                <Pencil className="w-5 h-5 text-blue-600" />
                            </button>
                            <button
                                className="p-2 rounded hover:bg-gray-100 transition-colors"
                                title="Eliminar proveedor"
                                onClick={() => {
                                    if (proveedor.idProveedor !== undefined) {
                                        setProveedorSeleccionado(proveedor);
                                        setOpenConfirm(true);
                                    }
                                }}
                            >
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                        
                    </div>
          
                ))}
            </section>
            <Dialog open={openConfirm} onOpenChange={setOpenConfirm} >
                            <DialogContent className="bg-white"> 
                                <DialogHeader>
                                    <DialogTitle>¿Eliminar proveedor?</DialogTitle>
                                    <DialogDescription>
                                        ¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            if (proveedorSeleccionado?.idProveedor !== undefined) {
                                                await eliminarProveedor(proveedorSeleccionado.idProveedor);
                                                setOpenConfirm(false);
                                            }
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
            </Dialog>
            
        </div>
    )
}