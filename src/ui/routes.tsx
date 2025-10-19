import { createHashRouter } from "react-router";
import { Container } from "./App";
import { HomePage } from "./pages/Home/HomePage";
import { DashboardPage } from "./pages/Dashboard/dashboard";
import { ProductosPage } from "./pages/Productos/productos";
import { ProductoDetailPage } from "./pages/productosDetail/productoDetail";
import { ReporteVentasPage } from "./pages/Reportes/ReportesVentas/reporteVentas";
import { ReporteVentasDetailPage } from "./pages/Reportes/ReportesVentas/reporteVentasDetail";
import { AuthGuard } from "./auth/AuthGuard";
import Login from "./auth/Login/page";
import UsuariosPage from "./pages/Usuarios/Usuarios";
import CategoriasPage from "./pages/Categorias/Categorias";
import EditCategoriasPage from "./pages/EditCategorias/EditCategorias";
import ProductosXCategoriaPage from "./pages/Categorias/productosXcategoria/ProductosXcategoria";
import ProveedoresPage from "./pages/Proveedores/Proveedores";
import PerfilPages from "./pages/Perfil/Perfil";
import InventarioPage from "./pages/Inventario/Inventario";
import DeudoresPage from "./pages/Deudores/deudoresPage";
import DetalleDeudoresPage from "./pages/DetalleDeudores/detalleDeudoresPage";
import NuevaCompra from "./pages/Egresos/compras/nuevaCompra/nuevaCompra";
import CortesPage from "./pages/Reportes/ReporteCortes/cortesPage";
import EgresosPage from "./pages/Egresos/egresosPage";
import NuevoGasto from "./pages/Egresos/egresos/nuevoGasto/nuevoGasto";
import VentasPorMesPage from "./pages/ReportesGeneral/reportesGeneralPage";

export const routes = createHashRouter([
  {
    element: <AuthGuard />, // Primero el AuthGuard
    children: [
      {
        path: "/",
        element: <Container />, // Luego el Container como layout
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/productos",
            element: <ProductosPage />,
          },
          {
            path: "/compras",
            element:<EgresosPage/>
          },
          {
            path: "/cortes",
            element:<CortesPage/>
          },
          {
            path: "/compras/nuevaCompra",
            element:<NuevaCompra/>
          },
          {
            path: "/gastos/nuevoGasto",
            element:<NuevoGasto/>
          },
          {
            path: "/categorias",
            element: <CategoriasPage/>,
          },
          {
            path: "/categorias/editCategoria",
            element: <EditCategoriasPage />,
          },
          {
            path: "/productos/productosXcategoria",
            element: <ProductosXCategoriaPage />,
          },
          {
            path: "/productos/detalleProducto",
            element: <ProductoDetailPage />,
          },
          {
            path: "/proveedores",
            element: <ProveedoresPage />,
          },
          {
            path: "/usuarios",
            element: <UsuariosPage></UsuariosPage>,
          },
          {
            path: "/reportes/reportesVentas",
            element: <ReporteVentasPage />,
          },
          {
            path: "/reportes/reportesVentas/detalleVenta",
            element: <ReporteVentasDetailPage />,
          },
          {
            path: "/reportes/ventasPorMes",
            element: <VentasPorMesPage/>,
          },
          {
            path: "/inventario",
            element:<InventarioPage/>
          },
          {
            path: "/deudores",
            element:<DeudoresPage/>,
          },
          {
            path: "/detalleDeudores",
            element:<DetalleDeudoresPage/>,
          },
          {
            path: "/perfil",
            element: <PerfilPages/>,
          },
        ],
      },
    ],
  },
  {
    path:"/login",
    element:<Login></Login>
  }
]);