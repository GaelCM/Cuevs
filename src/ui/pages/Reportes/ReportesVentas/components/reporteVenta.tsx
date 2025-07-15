"use client"

import { useEffect, useState } from "react";
import { obtenerDetalleVenta } from "@/api/ventasLocal/ventasLocal";
import type { DetalleVenta } from "@/types/ventas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, DollarSign, Package, Receipt, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";



export default function ReporteVenta({ idVenta }: { idVenta: string }) {
    const [detalles, setDetalles] = useState<DetalleVenta[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    useEffect(() => {
        const cargarDetalles = async () => {
            try {
                setLoading(true);
                const data = await obtenerDetalleVenta(idVenta);
                if (data) {
                    setDetalles(data);
                } else {
                    setError("No se pudieron cargar los detalles de la venta");
                }
            } catch (err) {
                setError("Error al cargar los detalles de la venta");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        cargarDetalles();
    }, [idVenta]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    if (error || !detalles || detalles.length === 0) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <div className="text-center text-red-600">
                        <Receipt className="h-12 w-12 mx-auto mb-4 text-red-400" />
                        <h3 className="text-lg font-semibold mb-2">Error al cargar la venta</h3>
                        <p>{error || "No se encontraron detalles para esta venta"}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Tomar el primer elemento para obtener la información general de la venta
    const ventaInfo = detalles[0];
    const totalProductos = detalles.reduce((sum, detalle) => sum + detalle.cantidadProducto, 0);

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reporte de Venta #{idVenta}</h1>
                    <p className="text-gray-600 mt-1">Detalles completos de la transacción</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2 ml-5">
                    Venta #{idVenta}
                </Badge>
                </div>
                <div>
                    <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600 hover:text-white cursor-pointer"
                    onClick={()=>navigate("/reportes/reportesVentas")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Regresar
                    </Button>
                </div>

            </div>

            {/* Información general de la venta */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fecha de Venta</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {new Date(ventaInfo.fechaVenta).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Venta</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(ventaInfo.totalVenta)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pago Recibido</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(ventaInfo.pagoVenta)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cambio</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {formatCurrency(ventaInfo.cambioVenta)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuario</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-semibold">ID: {ventaInfo.idUsuario}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-semibold">{totalProductos} unidades</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estado</CardTitle>
                        <Badge className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant={ventaInfo.idStatusVenta === 1 ? "default" : "secondary"}>
                            {ventaInfo.idStatusVenta === 1 ? "Completada" : "Pendiente"}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla de productos */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Productos Vendidos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-right">Cantidad</TableHead>
                                <TableHead className="text-right">Precio Unitario</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detalles.map((detalle, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {detalle.nombreProducto}
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {detalle.descripcion || "Sin descripción"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {detalle.cantidadProducto}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(detalle.precioUnitario)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(detalle.subtotal)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Resumen */}
            <Card className="bg-gray-50">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Resumen de la Venta</h3>
                            <p className="text-gray-600">
                                {detalles.length} producto{detalles.length !== 1 ? 's' : ''} vendido{detalles.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                                Total: {formatCurrency(ventaInfo.totalVenta)}
                            </div>
                            <p className="text-sm text-gray-500">
                                Pago: {formatCurrency(ventaInfo.pagoVenta)} | 
                                Cambio: {formatCurrency(ventaInfo.cambioVenta)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}