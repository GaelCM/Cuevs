import { obtenerUsuariosPublicos } from "@/api/usuarios/usuarios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UsuarioPublico } from "@/types/Usuarios";
import { Pencil, Search} from "lucide-react";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 12;

export default function TablaDeUsuarios(){
    const [usuarios, setUsuarios] = useState<UsuarioPublico[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsuarios, setFilteredUsuarios] = useState<UsuarioPublico[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [openConfirm, setOpenConfirm] = useState(false);
   // const [usuarioAEliminar, setusuarioAEliminar] = useState<string | null>(null);

    const obtenerUsuarios = async () => {
        const usuarios = await obtenerUsuariosPublicos();
        if (usuarios) {
            setUsuarios(usuarios);
        }
    }

    useEffect(() => {     
        obtenerUsuarios();
    }, []);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = usuarios.filter((item) => {
            return (
                item.usuario.toLowerCase().includes(lowercasedFilter) ||
                (item.nombre && item.nombre.toLowerCase().includes(lowercasedFilter)) ||
                (item.apellidos && item.apellidos.toLowerCase().includes(lowercasedFilter)) ||
                (item.email && item.email.toLowerCase().includes(lowercasedFilter))
            );
        });
        setFilteredUsuarios(filteredData);
        setCurrentPage(1); 
    }, [usuarios, searchTerm]);

    const totalPages = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentUsuarios = filteredUsuarios.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return(
        <Card className="border-none shadow-none">
            <CardHeader>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar usuarios por nombre, usuario o email..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Apellidos</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsuarios.map((usuario) =>(
                            <TableRow key={usuario.idUsuario}>
                                <TableCell className="font-medium">{usuario.idUsuario}</TableCell>
                                <TableCell className="font-medium">{usuario.usuario}</TableCell>
                                <TableCell>{usuario.nombre}</TableCell>
                                <TableCell>{usuario.apellidos}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>
                                    <Badge variant={usuario.activo ? "outline" : "destructive"} className={usuario.activo ? "bg-green-300" : "bg-red-300"}>
                                        {usuario.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            // Aquí puedes poner la lógica para editar usuario
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Mostrando <strong>{startIndex + 1}-{Math.min(endIndex, filteredUsuarios.length)}</strong> de <strong>{filteredUsuarios.length}</strong> usuarios
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                href="#" 
                                onClick={(e) => {
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
                                    onClick={(e) => {
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
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                }}
                                className={currentPage === totalPages ? 'pointer-events-none text-muted-foreground' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </CardFooter>

            <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar usuario?</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
