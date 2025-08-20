import { eliminarProductoDeudor, obtenerDetalleDeudorApi } from "@/api/deudores/deudores";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DetalleDeudorResponse } from "@/types/deudores";
import { Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DetalleReportDeudores({id}:{id:number}){
   
    const [productosFiltrados,setProductosFiltrados]=useState<DetalleDeudorResponse[]>([]);  
    const [total, setTotal] = useState(0);
    const [isOpen,setIsOpen]=useState(false);
    const [productoSeleccionado,setProductoSeleccionado]=useState<string|null>(null);

  useEffect(()=>{
     obtenerDetalleDeudorApi(id).then(data=>{
        if(data){
            setProductosFiltrados(data);
            const totalCuenta = data.reduce((acc, prod) => acc + (prod.subtotal || 0), 0);
            setTotal(totalCuenta);
        }
     })
  },[id])

  console.log(productosFiltrados);

    if(productosFiltrados.length==0){
        return(
            <section>
                <div className="text-center bg-white p-10">
                    <p>El deudor no cuenta con ningun producto</p>
                    
                </div>
            </section>
        )
    }

    return(
        <div>
        
            <div className="flex flex-col items-center  bg-white p-10">
        <Card className="w-full ">
            <CardHeader>
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-red-500">Detalle de Deudas</h2>
                <div className="flex flex-wrap gap-4 items-center">
                <span>{productosFiltrados[0].nombreDeudor}</span>
                <Badge variant={"outline"} ></Badge>
                <span className="text-xs text-muted-foreground ml-2">Creado: {productosFiltrados[0].fechaCreacion} </span>
                </div>
                <div className="w-full max-w-md mt-2">
                <Input placeholder="Buscar producto..."  />
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <Table>
                <TableCaption>Productos que debe este deudor</TableCaption>
                <TableHeader>
                <TableRow>
                    <TableHead>ID Producto</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Eliminar</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {productosFiltrados.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">No hay productos registrados.</TableCell>
                    </TableRow>
                ) : (
                    productosFiltrados.map((p) => (
                    <TableRow key={p.idProducto}>
                        <TableCell>{p.idProducto}</TableCell>
                        <TableCell>{p.nombreProducto}</TableCell>
                        <TableCell>{p.descripcion}</TableCell>
                        <TableCell>${p.precio?.toFixed(2)}</TableCell>
                        <TableCell>{p.cantidad}</TableCell>
                        <TableCell>${p.subtotal?.toFixed(2)}</TableCell>
                        <TableCell>
                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="cursor-pointer"
                                                onClick={()=>{
                                                    setProductoSeleccionado(p.idProducto)
                                                    setIsOpen(true)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
                <span className="font-bold text-lg text-red-600">Cuenta total: ${total.toFixed(2)}</span>
            </div>
            </CardContent>
        </Card>
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
                            <DialogContent className="bg-white"> 
                                <DialogHeader>
                                    <DialogTitle>¿Eliminar producto de la lista?</DialogTitle>
                                    <DialogDescription>
                                        ¿Estás seguro de que deseas eliminar este producto de la lista? Esta acción no se puede deshacer.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            if (productoSeleccionado !== null) {
                                                console.log(productoSeleccionado)
                                                console.log(id)
                                                const res=await eliminarProductoDeudor(id,productoSeleccionado);
                                                if(res?.success){
                                                    const productosActualizados = productosFiltrados.filter(p => p.idProducto !== productoSeleccionado);
                                                    setProductosFiltrados(productosActualizados);
                                                    const nuevoTotal = productosActualizados.reduce((acc, prod) => acc + (prod.precio || 0), 0);
                                                    setTotal(nuevoTotal);
                                                    toast.success("Producto eliminado correctamente");                                                
                                                    setIsOpen(false)
                                                }else{
                                                    toast.error('Error al eliminar el producto', {
                                                    description:`${res?.message}`,})
                                                    setIsOpen(false);
                                                }                 
                                            }
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
            </Dialog>
    </div>
        </div>
    )
}