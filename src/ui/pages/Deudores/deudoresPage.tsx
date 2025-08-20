

import { eliminarDeudorApi, obtenerDeudoresApi } from "@/api/deudores/deudores";
import type { Deudores } from "@/types/deudores";
import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableCaption
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { LucideCross, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import NuevoDeudorSection from "./components/nuevoDeudorSection";

export default function DeudoresPage() {

    const [deudores, setDeudores] = useState<Deudores[]>([]);
    const [deudorSeleccionado, setDeudorSeleccionado] = useState<Deudores | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        obtenerDeudoresApi().then(data => {
            if (data) {
                setDeudores(data);
            }
        });
    }, []);

    const deudoresFiltrados = deudores.filter((d) =>
        d.nombreDeudor?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPages = Math.ceil(deudoresFiltrados.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentDeudores = deudoresFiltrados.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [busqueda]);

    return (
        <div className="flex flex-col items-center  bg-white p-10">
            <h1 className="text-red-500 text-3xl font-bold mb-10">Lista de Deudores</h1>
            <div className="mb-4 w-full max-w-md">
                <Input
                    placeholder="Buscar deudor por nombre..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />
            </div>
            <section className="flex w-full justify-end">
                <NuevoDeudorSection></NuevoDeudorSection>
            </section>
            <div className="rounded-lg  p-6 w-full">
                <Table>
                    <TableCaption>Listado de deudores registrados</TableCaption>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="">ID</TableHead>
                            <TableHead className="">Nombre</TableHead>
                            <TableHead className="">Activo</TableHead>
                            <TableHead className="">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentDeudores.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                    No hay deudores registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentDeudores.map((deudor) => (
                                <TableRow key={deudor.idDeudor}>
                                    <TableCell>{deudor.idDeudor}</TableCell>
                                    <TableCell className="font-semibold">{deudor.nombreDeudor}</TableCell>
                                    <TableCell>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${deudor.isActivo ? 'bg-green-800 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                            {deudor.isActivo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link to={""} className="hover:bg-gray-100 rounded-md p-1 cursor-pointer">
                                                <Button size="icon" variant="outline">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => {
                                                    setDeudorSeleccionado(deudor)
                                                    setIsOpen(true);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <Link to={`/detalleDeudores?id=${deudor.idDeudor}`} className="hover:bg-gray-100 rounded-md p-1 cursor-pointer">
                                                <Button size="icon" variant="outline" className="cursor-pointer">
                                                    <LucideCross className=""></LucideCross>
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col items-center mt-4">
                <div className="text-xs text-muted-foreground mb-2">
                    Mostrando <strong>{startIndex + 1}-{Math.min(endIndex, deudoresFiltrados.length)}</strong> de <strong>{deudoresFiltrados.length}</strong> deudores
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                }}
                                className={currentPage === 1 ? 'pointer-events-none text-muted-foreground' : ''}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    isActive={i + 1 === currentPage}
                                    onClick={e => {
                                        e.preventDefault();
                                        handlePageChange(i + 1);
                                    }}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={e => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                }}
                                className={currentPage === totalPages ? 'pointer-events-none text-muted-foreground' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen} >
                            <DialogContent className="bg-white"> 
                                <DialogHeader>
                                    <DialogTitle>¿Eliminar Deudor?</DialogTitle>
                                    <DialogDescription>
                                        ¿Estás seguro de que deseas eliminar este deudor? Esta acción no se puede deshacer.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            if (deudorSeleccionado?.idDeudor !== undefined) {
                                                const res=await eliminarDeudorApi(deudorSeleccionado.idDeudor);
                                                if(res?.success){
                                                    setDeudores(deudores.filter(d => d.idDeudor !== deudorSeleccionado.idDeudor));
                                                    toast.success("Deudor eliminado correctamente");
                                                    setIsOpen(false);
                                                }else{
                                                    toast.error('Error al eliminar el deudor', {
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
    );
}