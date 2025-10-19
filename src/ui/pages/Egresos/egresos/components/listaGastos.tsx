
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Gasto } from "@/types/gastos";

import { useState } from "react";


const ITEMS_PER_PAGE = 20;



export default function ListaGastos({gastos}: {gastos: Gasto[]}) {
    
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  

  // Filtrar gastos por fecha
  const filteredgastos = gastos.filter((gasto) =>
    gasto.fechaRegistro.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredgastos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentgastos = filteredgastos.slice(startIndex, endIndex);

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
              <TableHead className="hidden lg:table-cell">Concepto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentgastos.map((gasto) => (
              <TableRow key={gasto.idGasto}>
                <TableCell className="font-medium hidden sm:table-cell">
                  {gasto.idGasto}
                </TableCell>
                <TableCell className="font-medium">
                  {gasto.fechaRegistro}
                </TableCell>
                <TableCell className="font-medium">
                  ${gasto.monto.toFixed(2)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {gasto.concepto}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>{startIndex + 1}-{Math.min(endIndex, filteredgastos.length)}</strong> de <strong>{filteredgastos.length}</strong> gastos
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