"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Eye} from "lucide-react";
import type { Venta } from "@/types/ventas";
import { Link } from "react-router";

const ITEMS_PER_PAGE = 10;




export default function TablaVentas({ventas}: {ventas: Venta[]}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar ventas por fecha
  const filteredVentas = ventas.filter((venta) =>
    venta.fechaVenta.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredVentas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVentas = filteredVentas.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar por fecha (YYYY-MM-DD)..."
            className="w-full rounded-lg bg-background pl-4 md:w-[200px] lg:w-[336px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Folio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="hidden md:table-cell">Pago</TableHead>
              <TableHead className="hidden md:table-cell">Cambio</TableHead>
              <TableHead className="hidden md:table-cell">Usuario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentVentas.map((venta) => (
              <TableRow key={venta.idVenta}>
                <TableCell className="font-medium hidden sm:table-cell">{venta.idVenta}</TableCell>
                <TableCell className="font-medium hidden sm:table-cell">{venta.fechaVenta}</TableCell>
                <TableCell>${venta.totalVenta.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">${venta.pagoVenta.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">${venta.cambioVenta.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">{venta.idUsuario}</TableCell>
                <TableCell>
                                    <div className="flex justify-center">
                                        
                                        <Link to={`/reportes/reportesVentas/detalleVenta?id=${venta.idVenta}`} className="hover:bg-gray-100 rounded-md p-1 cursor-pointer">
                                            <Button size="icon" variant="outline" className="cursor-pointer">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        
                                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>{startIndex + 1}-{Math.min(endIndex, filteredVentas.length)}</strong> de <strong>{filteredVentas.length}</strong> ventas
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
                className={currentPage === 1 ? "pointer-events-none text-muted-foreground" : ""}
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
                className={currentPage === totalPages ? "pointer-events-none text-muted-foreground" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}