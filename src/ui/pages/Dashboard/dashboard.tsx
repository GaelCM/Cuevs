
import { mandarReporteDashboardApi } from "@/api/alertasController/alertas";
import { obtenerTotalComprasApi } from "@/api/compras/comprasLocal";
import { obtenerDatosVentaPorDIaApi, obtenerProductosBajoInventarioApi, obtenerProductosMasVendidosPorCategoriaApi, obtenerTopProductosVendidosApi, obtenerVentasPorHoraApi } from "@/api/dashboard/dashboard";
import { obtenerTotalgastosApi } from "@/api/gastos/gastosLocal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DatosVentaPorDia, ProductoMasVendidoPorCategoria, ProductosBajoStock, TopProductoVendido, VentasPorHora } from "@/types/dashboardResponse";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { ArrowRight, BellRing, CalendarDays,DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";


export function DashboardPage(){
  // Datos reales de tu base de datos
  const [salesData, setSalesData] = useState<DatosVentaPorDia[]>([]);

  const [topProducts, setTopProducts] = useState<TopProductoVendido[]>([]);

  const [hourlyData, setHourlyData] = useState<VentasPorHora[]>([]);

  const [categoryData, setCategoryData] = useState<ProductoMasVendidoPorCategoria[]>([]);

  const [productosBajoStock, setProductosBajoStock] = useState<ProductosBajoStock[]>([]);

  const [totalCompras, setTotalCompras]=useState<number>(0.00);
  const [totalGastos, setTotalGastos]=useState<number>(0.00);

  const timeZone = 'America/Mexico_City';
  const now = new Date();
  const zonedDate = toZonedTime(now, timeZone);
  const fechaHoy = format(zonedDate, 'yyyy-MM-dd');
  const navigate=useNavigate();

  useEffect(() => {
    obtenerDatosVentaPorDIaApi().then(res => {
      if (res) {
        setSalesData(res);
      } else {
        setSalesData([]);
      }
    });

    obtenerTopProductosVendidosApi().then(res => {
      if (res) {
        setTopProducts(res);
      } else {
        setTopProducts([]);
      }
    });

    obtenerVentasPorHoraApi().then(res=>{
      if (res) {
        setHourlyData(res);
      } else {
        setHourlyData([]);
      }
    })

    obtenerProductosMasVendidosPorCategoriaApi().then(res=>{
      if (res) {
        setCategoryData(res);
      } else {
        setCategoryData([]);
      }
    })

    obtenerTotalComprasApi(fechaHoy,fechaHoy).then(res=>{
      if(res){
        setTotalCompras(res[0].total);
      }else{
        setTotalCompras(0.00);
      }
    })

    obtenerTotalgastosApi(fechaHoy,fechaHoy).then(res=>{
      if(res){
        setTotalGastos(res[0].total);
      }else{
        setTotalGastos(0.00);
      }
    })

    obtenerProductosBajoInventarioApi().then(res=>{
      if(res){
        setProductosBajoStock(res)
      }else{
        setProductosBajoStock([])
      }
    })

  }, [fechaHoy]);




  // Calcular totales
  const totalSales = salesData.reduce((sum, item) => sum + item.monto_total_ventas, 0);
  const totalTransactions = salesData.reduce((sum, item) => sum + item.numero_ventas, 0);
  const averageTicket = totalSales / totalTransactions;
  const ventasEfectivo=salesData.reduce((sum, item) => sum + item.ventasEfectivo, 0);
  const ventasTarjeta=salesData.reduce((sum, item) => sum + item.ventasTarjeta, 0);
  const egresosTotales=totalCompras+totalGastos;
  console.log(salesData)

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  // Preparar datos para el gráfico de categorías
  const categoryPieData = categoryData.map((item, index) => ({
    name: item.categoriaName,
    value: item.total_vendido,
    color: COLORS[index % COLORS.length]
  }));

  // Formatear fecha para mostrar
  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const enviarAlertas=async()=>{
    const res=await mandarReporteDashboardApi();
    if(res?.success){
      toast.success("Alertas enviadas correctamente");
    }

  }

    return(
        <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas</h1>
            <p className="text-gray-600">Análisis del dia {fechaHoy}</p>
          </div>
          <div>    
            <Badge variant="secondary" className="text-sm">
              <CalendarDays className="w-4 h-4 mr-1" />
              Últimos datos obtenidos
            </Badge>
             <Button variant={"outline"} onClick={enviarAlertas}><BellRing></BellRing></Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12.5% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas en efectivo</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${ventasEfectivo.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Tarjeta</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${ventasTarjeta.toLocaleString()||""}</div>
              <p className="text-xs text-muted-foreground">+12.5% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">+8.3% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageTicket.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+3.8% vs período anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${egresosTotales||0}</div>
              <p className="text-xs text-muted-foreground">Total de egresos el dia de hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCompras||0}</div>
              <p className="text-xs text-muted-foreground">Total de compras hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalGastos||0}</div>
              <p className="text-xs text-muted-foreground">Total de gastos hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Únicos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topProducts.length}</div>
              <p className="text-xs text-muted-foreground">Productos vendidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categorías */}
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Categoría</CardTitle>
              <CardDescription>Distribución de productos más vendidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : "0")}%`}
                      labelLine={false}
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} unidades`, name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{backgroundColor: COLORS[index % COLORS.length]}}
                        />
                        <span className="text-sm font-medium">{item.categoriaName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold">{item.total_vendido}</span>
                        <p className="text-xs text-gray-500">{item.nombreProducto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>            
          {/* Ventas por hora */}
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Hora</CardTitle>
              <CardDescription>Distribución de ventas durante el día</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hora" 
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `${value}:00 hrs`}
                    formatter={(value, name) => [
                      name === 'total_ventas' ? `$${value}` : value,
                      name === 'total_ventas' ? 'Ingresos' : 'Transacciones'
                    ]}
                  />
                  <Bar dataKey="total_ventas" fill="#0088FE" name="total_ventas" />
                  <Bar dataKey="numero_ventas" fill="#00C49F" name="numero_ventas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Top productos */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top 10 Productos Más Vendidos</CardTitle>
              <CardDescription>Productos ordenados por cantidad vendida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.slice(0, 8).map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.nombreProducto}</p>
                        <p className="text-sm text-gray-500">{product.total_vendido} unidades vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${product.ingresos_totales}</p>
                      <p className="text-sm text-gray-500">ingresos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Productos Bajo Stock al lado de la tabla resumen */}
<Card className="lg:col-span-2">
  <CardHeader>
    <CardTitle>Productos con Bajo Stock</CardTitle>
    <CardDescription>Productos que requieren reposición</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg shadow-md">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="text-left p-3 font-semibold">Producto</th>
            <th className="text-right p-3 font-semibold">Stock Actual</th>
            <th className="text-right p-3 font-semibold">Stock Mínimo</th>
            <th className="text-right p-3 font-semibold">Criticidad</th>
            <th className="text-right p-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosBajoStock.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-sm text-muted-foreground">
                No hay productos con bajo stock
              </td>
            </tr>
          ) : (
            productosBajoStock.map((p, idx) => (
              <tr key={idx} className="border-b hover:bg-accent">
                <td className="p-3">{p.nombre}</td>
                <td className="p-3 text-right">{p.stock}</td>
                <td className="p-3 text-right">{p.minimo}</td>
                <td className="p-3 text-right">
                  {p.stock === 0 ? (
                    <Badge variant="destructive">Agotado</Badge>
                  ) :
                    <Badge variant="default" className="bg-yellow-600">Por agotarse</Badge>
                  }
                </td>
                <td className="text-center">
                  <Button variant={"outline"} className="hover:cursor-pointer" onClick={()=>{navigate(`/productos/detalleProducto?id=${p.idProducto}`)}}><ArrowRight></ArrowRight></Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>
        </div>

        {/* Tabla resumen*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen Detallado por Fecha</CardTitle>
              <CardDescription>Análisis completo de ventas por día</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Fecha</th>
                      <th className="text-right p-3 font-semibold">Transacciones</th>
                      <th className="text-right p-3 font-semibold">Ingresos Totales</th>
                      <th className="text-right p-3 font-semibold">Ticket Promedio</th>
                      <th className="text-right p-3 font-semibold">% del Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.map((sale, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">{sale.fecha}</td>
                        <td className="p-3 text-right">{sale.numero_ventas}</td>
                        <td className="p-3 text-right font-semibold">${sale.monto_total_ventas}</td>
                        <td className="p-3 text-right">${(sale.monto_total_ventas / sale.numero_ventas).toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <Badge variant="outline">
                            {((sale.monto_total_ventas / totalSales) * 100).toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
         {/* Ventas por día */}
          <Card>
            <CardHeader>
              <CardTitle>Composición de Ventas Diarias</CardTitle>
              <CardDescription>Desglose de ventas por método de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="fecha" 
                    tickFormatter={formatDate}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={formatDate}
                    formatter={(value, name) => [
                      `$${value.toLocaleString()}`,
                      name === 'ventasEfectivo' ? 'Efectivo' : 
                      name === 'ventasTarjeta' ? 'Tarjeta' : 'Total'
                    ]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="ventasEfectivo" 
                    stackId="a" 
                    fill="#0088FE" 
                    name="Efectivo"
                  />
                  <Bar 
                    dataKey="ventasTarjeta" 
                    stackId="a" 
                    fill="#00C49F" 
                    name="Tarjeta"
                  />
                  <Line
                    type="monotone"
                    dataKey="monto_total_ventas"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Total"
                    dot={{ fill: '#8884d8' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    )
}