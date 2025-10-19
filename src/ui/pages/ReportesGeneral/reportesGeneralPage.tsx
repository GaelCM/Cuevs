import { getListaVentasPorMesApi, getTotalVentasPorMesApi } from "@/api/reportesGeneral/reportesGeneral";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { listaVentasPorMes, ventasPorMesReporte } from "@/types/reportesGenetal";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


function exportToCsv<T extends object>(filename: string, rows: T[]) {
    if (!rows || !rows.length) return;
    const records = rows as unknown as Record<string, unknown>[];
    const keys = Object.keys(records[0] ?? {});
    const escape = (v: unknown) => {
        if (v === null || v === undefined) return "";
        if (typeof v === "string") return `"${v.replace(/"/g, '""')}"`;
        return `"${String(v).replace(/"/g, '""')}"`;
    };
    const csvRows = records.map((r) => keys.map((k) => escape(r[k])).join(";"));
    const csv = [keys.join(";"), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

export default function VentasPorMesPage() {
    const timeZone = "America/Mexico_City";
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    const fechaFormateada = format(zonedDate, "yyyy-MM-dd");

    const [fechaDesde, setFechaDesde] = useState<string>(fechaFormateada);
    const [fechaHasta, setFechaHasta] = useState<string>(fechaFormateada);
    const [loading, setLoading] = useState(false);
    const [ventasPorMes, setVentasPorMes] = useState<ventasPorMesReporte[]>([]);
    const [listaVentasPorMes, setListaVentasPorMes] = useState<listaVentasPorMes[]>([]);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const [reporte, lista] = await Promise.all([
                    getTotalVentasPorMesApi(fechaDesde, fechaHasta),
                    getListaVentasPorMesApi(fechaDesde, fechaHasta),
                ]);
                if (!mounted) return;
                if (reporte) setVentasPorMes(reporte);
                if (lista) setListaVentasPorMes(lista);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, [fechaDesde, fechaHasta]);

        const totals = useMemo(() => {
            const totalVentas = listaVentasPorMes.reduce((s, r) => s + (r.totalDia ?? 0), 0);
            const totalItems = listaVentasPorMes.reduce((s, r) => s + (r.cantidadVentas ?? 0), 0);
            const meses = ventasPorMes.length;
            const avg = meses ? ventasPorMes.reduce((s, v) => s + (v.montoTotal ?? 0), 0) / Math.max(1, meses) : 0;
            return { totalVentas, totalItems, meses, avg };
        }, [listaVentasPorMes, ventasPorMes]);

        const chartData = ventasPorMes.map((v) => ({
            name: v.mes,
            ventasEfectivo: Number(v.ventasEfectivo ?? 0),
            ventasTarjeta: Number(v.ventasTarjeta ?? 0),
            montoTotal: Number(v.montoTotal ?? 0),
            totalVentas: Number(v.totalVentas ?? 0),
        }));

    if (loading) return <div className="p-6">Cargando reporte...</div>;

    return (
        <div className="p-6 space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Reporte: Ventas por Mes</h1>
                    <p className="text-muted-foreground mt-1">Visión ejecutiva y detallada de tus ventas mensuales</p>
                </div>
                <div className="flex gap-3 items-center">
                    <label className="flex flex-col text-sm">
                        <span className="font-medium">Fecha desde</span>
                        <input className="border rounded px-2 py-1" type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
                    </label>
                    <label className="flex flex-col text-sm">
                        <span className="font-medium">Fecha hasta</span>
                        <input className="border rounded px-2 py-1" type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
                    </label>
                    <Button onClick={() => { /* ya refresca por efecto */ }} variant="default">Aplicar</Button>
                    <Button variant="outline" onClick={() => exportToCsv(`ventas_por_mes_${fechaDesde}_${fechaHasta}.csv`, listaVentasPorMes)}>Exportar CSV</Button>
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>KPIs</CardTitle>
                        <CardDescription>Indicadores clave</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-white rounded shadow text-center">
                                <div className="text-sm text-muted-foreground">Ingresos Totales</div>
                                <div className="text-2xl font-bold text-green-600">${totals.totalVentas.toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground mt-1">Periodo: {fechaDesde} → {fechaHasta}</div>
                            </div>
                            <div className="p-4 bg-white rounded shadow text-center">
                                <div className="text-sm text-muted-foreground">Unidades Vendidas</div>
                                <div className="text-2xl font-bold">{totals.totalItems}</div>
                                <div className="text-xs text-muted-foreground mt-1">Meses: {totals.meses}</div>
                            </div>
                            <div className="p-4 bg-white rounded shadow text-center">
                                <div className="text-sm text-muted-foreground">Promedio / Mes</div>
                                <div className="text-2xl font-bold">${totals.avg.toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground mt-1">Promedio de ventas mensuales</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Ventas por Mes (Gráfica)</CardTitle>
                        <CardDescription>Comparativa de ingresos y unidades</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" />            {/* montos */}
                                    <YAxis yAxisId="right" orientation="right" /> {/* conteo/ventas */}
                                    <Tooltip
                                        formatter={(
                                            value: number | string,
                                            name: string,
                                            props?: { dataKey?: string | number | ((...args: unknown[]) => unknown) }
                                        ): [ReactNode, string] | ReactNode => {
                                            const key = props && props.dataKey ? props.dataKey : name;
                                            const keyStr = String(key).toLowerCase();
                                            if (keyStr.includes("totalventas") || keyStr.includes("cantidad")) {
                                                return [String(value ?? ""), name];
                                            }
                                            return [`$${Number(value ?? 0).toFixed(2)}`, name];
                                        }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" stackId="a" dataKey="ventasEfectivo" name="Efectivo" fill="#059669" />
                                    <Bar yAxisId="left" stackId="a" dataKey="ventasTarjeta" name="Tarjeta" fill="#FF8042" />
                                    <Line yAxisId="right" type="monotone" dataKey="totalVentas" name="Cantidad Ventas" stroke="#2563eb" />
                                </ComposedChart>
                            </ResponsiveContainer>
                    </CardContent>
                </Card>
            </section>

            <section>
                <Card>
                    <CardHeader>
                        <CardTitle>Detalle por Mes</CardTitle>
                        <CardDescription>Lista completa de meses y totales</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Fecha</TableHead>
                                                    <TableHead>Total Día</TableHead>
                                                    <TableHead>Cantidad Ventas</TableHead>
                                                    <TableHead>Efectivo</TableHead>
                                                    <TableHead>Tarjeta</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {listaVentasPorMes.map((r, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="font-medium">{r.fecha}</TableCell>
                                                        <TableCell>${(r.totalDia ?? 0).toFixed(2)}</TableCell>
                                                        <TableCell>{r.cantidadVentas ?? 0}</TableCell>
                                                        <TableCell>${(r.efectivo ?? 0).toFixed(2)}</TableCell>
                                                        <TableCell>${(r.tarjeta ?? 0).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell>Total</TableCell>
                                                    <TableCell>${totals.totalVentas.toFixed(2)}</TableCell>
                                                    <TableCell>{totals.totalItems}</TableCell>
                                                    <TableCell />
                                                    <TableCell />
                                                </TableRow>
                                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}