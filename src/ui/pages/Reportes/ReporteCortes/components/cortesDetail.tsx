"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";


import type { CorteCajaReporte, ResumenDiarioCorteReporte } from "@/types/cortesResponse";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ITEMS_PER_PAGE = 20;

type props={
  cortes: CorteCajaReporte[],
  resumenDiarioCortes:ResumenDiarioCorteReporte[]
}

export default function CortesDetail({ cortes, resumenDiarioCortes }: props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentResumenPage, setCurrentResumenPage] = useState(1);

  // Filtrar cortes por usuario
  const filteredCortes = cortes.filter((corte) =>
    corte.usuario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación para cortes individuales
  const totalPages = Math.ceil(filteredCortes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCortes = filteredCortes.slice(startIndex, endIndex);

  // Paginación para resumen diario
  const totalResumenPages = Math.ceil(resumenDiarioCortes.length / ITEMS_PER_PAGE);
  const resumenStartIndex = (currentResumenPage - 1) * ITEMS_PER_PAGE;
  const resumenEndIndex = resumenStartIndex + ITEMS_PER_PAGE;
  const currentResumenCortes = resumenDiarioCortes.slice(resumenStartIndex, resumenEndIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleResumenPageChange = (page: number) => {
    setCurrentResumenPage(page);
  };

  const formatCurrency = (amount: number | null | undefined) => {
    return amount ? `$${amount.toFixed(2)}` : "$0.00";
  };

  const formatPercentage = (percentage: number | null | undefined) => {
    return percentage ? `${percentage.toFixed(1)}%` : "0.0%";
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <Tabs defaultValue="detalle" className="w-full">
          <TabsList className="grid w-[50%] grid-cols-2">
            <TabsTrigger value="detalle">Detalle de Cortes</TabsTrigger>
            <TabsTrigger value="resumen">Resumen Diario</TabsTrigger>
          </TabsList>
          
          <TabsContent value="detalle" className="mt-4">
            <div className="relative mb-4">
              <Input
                type="search"
                placeholder="Buscar por usuario..."
                className="w-full rounded-lg bg-background pl-4 md:w-[200px] lg:w-[336px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Corte</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha Apertura</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha Cierre</TableHead>
                  <TableHead className="hidden md:table-cell">Duración (min)</TableHead>
                  <TableHead>Total Ventas</TableHead>
                  <TableHead>Ventas efectivo</TableHead>
                  <TableHead>Total Compras</TableHead>
                  <TableHead>Balance operacional</TableHead>
                  <TableHead>Monto inicial</TableHead>
                  <TableHead>Monto final de efectivo</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead className="hidden lg:table-cell">Categoría</TableHead>
                  <TableHead className="hidden lg:table-cell">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCortes.map((corte) => (
                  <TableRow key={corte.idCorte}>
                    <TableCell>{corte.idCorte}</TableCell>
                    <TableCell>{corte.usuario ?? "N/A"}</TableCell>
                    <TableCell>{corte.fechaApertura}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {corte.fechaCierre ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {corte.duracion_minutos ?? "—"}
                    </TableCell>
                    <TableCell>{formatCurrency(corte.totalVentas)}</TableCell>
                    <TableCell>{formatCurrency(corte.ventasEfectivo)}</TableCell>
                    <TableCell>{formatCurrency(corte.totalCompras)}</TableCell>
                    <TableCell>{formatCurrency(corte.balance_operacional)}</TableCell>
                    <TableCell>{formatCurrency(corte.montoInicialEfectivo)}</TableCell>
                    <TableCell>{formatCurrency(corte.montoFinalEfectivo)}</TableCell>
                    <TableCell
                      className={
                        corte.diferencia !== null
                          ? corte.diferencia < 0
                            ? "text-red-600 font-semibold"
                            : corte.diferencia === 0
                            ? "text-gray-500 font-semibold"
                            : "text-green-600 font-semibold"
                          : ""
                      }
                    >
                      {corte.diferencia !== null ? `$${corte.diferencia.toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {corte.categoria_diferencia}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge 
                        variant={corte.estado === "ABIERTO" ? "default" : "secondary"}
                        className={
                          corte.estado === "ABIERTO"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {corte.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <CardFooter className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                Mostrando{" "}
                <strong>
                  {startIndex + 1}-{Math.min(endIndex, filteredCortes.length)}
                </strong>{" "}
                de <strong>{filteredCortes.length}</strong> cortes
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
                      className={
                        currentPage === 1
                          ? "pointer-events-none text-muted-foreground"
                          : ""
                      }
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
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none text-muted-foreground"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="resumen" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total Cortes</TableHead>
                  <TableHead>Promedio Ventas</TableHead>
                  <TableHead>Mejor Venta</TableHead>
                  <TableHead>Menor Venta</TableHead>
                  <TableHead>Con Sobrante</TableHead>
                  <TableHead>Con Faltante</TableHead>
                  <TableHead>Exactos</TableHead>
                  <TableHead className="hidden md:table-cell">Duración Prom. (min)</TableHead>
                  <TableHead className="hidden lg:table-cell">% Efectivo</TableHead>
                  <TableHead className="hidden lg:table-cell">% Tarjeta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentResumenCortes.map((resumen, index) => (
                  <TableRow key={resumen.fecha + index}>
                    <TableCell className="font-medium">{resumen.fecha}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{resumen.total_cortes}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(resumen.promedio_ventas_por_corte)}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {formatCurrency(resumen.mejor_venta)}
                    </TableCell>
                    <TableCell>{formatCurrency(resumen.menor_venta)}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {resumen.cortes_con_sobrante}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-red-100 text-red-800">
                        {resumen.cortes_con_faltante}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-gray-100 text-gray-800">
                        {resumen.cortes_exactos}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {resumen.duracion_promedio_minutos?.toFixed(0) ?? "—"} min
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatPercentage(resumen.porcentaje_efectivo)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatPercentage(resumen.porcentaje_tarjeta)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <CardFooter className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                Mostrando{" "}
                <strong>
                  {resumenStartIndex + 1}-{Math.min(resumenEndIndex, resumenDiarioCortes.length)}
                </strong>{" "}
                de <strong>{resumenDiarioCortes.length}</strong> días
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentResumenPage > 1) handleResumenPageChange(currentResumenPage - 1);
                      }}
                      className={
                        currentResumenPage === 1
                          ? "pointer-events-none text-muted-foreground"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalResumenPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={i + 1 === currentResumenPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handleResumenPageChange(i + 1);
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
                        if (currentResumenPage < totalResumenPages) 
                          handleResumenPageChange(currentResumenPage + 1);
                      }}
                      className={
                        currentResumenPage === totalResumenPages
                          ? "pointer-events-none text-muted-foreground"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}