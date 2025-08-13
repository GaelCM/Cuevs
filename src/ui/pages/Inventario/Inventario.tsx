
import type { MovimientoInventarioPorDia, ProductoMayorRotacion, ProductoMenorRotacion, StockGeneral, StockPorCategoria } from "@/types/inventarioResponse";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { movimientosInventarioPorDiaApi, obtenerDatosStockGeneralApi, obtenerDatosStockPorCategoriasApi, productosConMayorRotacionPorMesApi, productosConMenorRotacionPorMesApi } from "@/api/inventario/inventario";
import { formatCurrency } from "@/lib/utils";

export default function InventarioPage() {
  const [stockCategorias, setStockPorCategorias] = useState<StockPorCategoria[]>([]);
  const [stockGeneral, setstockGeneral] = useState<StockGeneral[]>([]);
  const [productosMayorRot, setproductosMayorRot] = useState<ProductoMayorRotacion[]>([]);
  const [productosMenorRot, setproductosMenorRot] = useState<ProductoMenorRotacion[]>([]);
  const [movimientosInvPorDia, setmovimientosInvPorDia] = useState<MovimientoInventarioPorDia[]>([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const stockCat = await obtenerDatosStockPorCategoriasApi();
      console.log(stockCat);
      if (stockCat) setStockPorCategorias(stockCat);
      const stockGen = await obtenerDatosStockGeneralApi();
      console.log(stockGen);
      if (stockGen) setstockGeneral(stockGen);
      const prodMayor = await productosConMayorRotacionPorMesApi();
      if (prodMayor) setproductosMayorRot(prodMayor);
      const prodMenor = await productosConMenorRotacionPorMesApi();
      if (prodMenor) setproductosMenorRot(prodMenor);
      const movInvDia = await movimientosInventarioPorDiaApi();
      if (movInvDia) setmovimientosInvPorDia(movInvDia);
    };
    obtenerDatos();
  }, []);

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  // Datos para PieChart de stock por categoría
  const pieData = stockCategorias.map((cat, idx) => ({
    name: cat.categoria,
    value: cat.stock_total,
    color: COLORS[idx % COLORS.length]
  }));

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Inventario</h1>
            <p className="text-gray-600">Estado actualizado al {new Date().toISOString().split('T')[0]}</p>
          </div>
          <Badge variant="secondary" className="text-sm">Inventario actualizado</Badge>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Total</CardTitle>
              <CardDescription>Unidades en inventario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockGeneral[0]?.stock_total_general ?? 0}</div>
              <p className="text-xs text-muted-foreground">Total de productos en stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Valor Total</CardTitle>
              <CardDescription>Valor estimado del inventario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stockGeneral[0]?.valor_total_inventario?.toLocaleString() ?? 0}</div>
              <p className="text-xs text-muted-foreground">Valor calculado</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock por categoría PieChart */}
          <Card>
            <CardHeader>
              <CardTitle>Stock por Categoría</CardTitle>
              <CardDescription>Distribución del inventario</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : "0")}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} unidades`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {stockCategorias.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-sm font-medium">{cat.categoria}</span>
                    </div>
                    <span className="text-sm font-semibold">{cat.stock_total}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Movimientos de inventario por día BarChart */}
          <Card>
          <CardHeader>
            <CardTitle>Movimientos por Día</CardTitle>
            <CardDescription>Movimientos agrupados por tipo y fecha</CardDescription>
          </CardHeader>
          <CardContent>
            
            {movimientosInvPorDia.length === 0 ? (
              <div className="text-center text-sm text-gray-500">No hay movimientos registrados para este periodo.</div>
            ) : (
              <>
                {/* Transformar datos para gráfico apilado por fecha */}
                {(() => {
                  // Agrupar por fecha
                  const fechasUnicas = Array.from(new Set(movimientosInvPorDia.map(m => m.fecha)));
                  const dataPorFecha = fechasUnicas.map(fecha => {
                    const movimientos = movimientosInvPorDia.filter(m => m.fecha === fecha);
                    return {
                      fecha,
                      entrada: movimientos.find(m => m.tipoMovimiento === 'entrada')?.numero_movimientos ?? 0,
                      salida: movimientos.find(m => m.tipoMovimiento === 'salida')?.numero_movimientos ?? 0,
                      ajuste: movimientos.find(m => m.tipoMovimiento === 'ajuste')?.numero_movimientos ?? 0,
                    };
                  });
                  return (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={dataPorFecha}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" tickFormatter={formatDate} />
                        <YAxis />
                        <Tooltip labelFormatter={formatDate} formatter={(value, name) => [`${value} movimientos`, name]} />
                        <Bar dataKey="entrada" name="Entradas" stackId="a" fill="#00C49F" />
                        <Bar dataKey="salida" name="Salidas" stackId="a" fill="#FF8042" />
                        <Bar dataKey="ajuste" name="Ajustes" stackId="a" fill="#8884D8" />
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#00C49F'}}></span>Entrada</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#FF8042'}}></span>Salida</span>
                  <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#8884D8'}}></span>Ajuste</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Productos con mayor y menor rotación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mayor rotación */}
          <Card>
            <CardHeader>
              <CardTitle>Productos con Mayor Rotación</CardTitle>
              <CardDescription>Top 5 productos que más se mueven</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {productosMayorRot.slice(0, 5).map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{idx + 1}</Badge>
                      <span className="font-medium text-gray-900">{prod.nombreProducto}</span>
                    </div>
                    <span className="text-sm text-blue-600 font-semibold">{prod.numero_transacciones} mov.</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menor rotación */}
          <Card>
            <CardHeader>
              <CardTitle>Productos con Menor Rotación</CardTitle>
              <CardDescription>Top 5 productos menos movidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {productosMenorRot.slice(0, 5).map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{idx + 1}</Badge>
                      <span className="font-medium text-gray-900">{prod.nombreProducto}</span>
                    </div>
                    <span className="text-sm text-red-600 font-semibold">{prod.total_vendido} mov.</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla resumen de stock por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Stock por Categoría</CardTitle>
            <CardDescription>Detalle de inventario por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Categoría</th>
                    <th className="text-right p-3 font-semibold">Stock Total</th>
                    <th className="text-right p-3 font-semibold">Productos</th>
                    <th className="text-right p-3 font-semibold">$Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {stockCategorias.map((cat, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3">{cat.categoria}</td>
                      <td className="p-3 text-right font-semibold">{cat.stock_total}</td>
                      <td className="p-3 text-right">{cat.total_productos}</td>
                      <td className="p-3 text-right">{formatCurrency(cat.valor_inventario)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}