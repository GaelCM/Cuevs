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
            path: "/categorias",
            element: <CategoriasPage/>,
          },
          {
            path: "/categorias/editCategoria",
            element: <EditCategoriasPage />,
          },
          {
            path: "/productos/detalleProducto",
            element: <ProductoDetailPage />,
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
        ],
      },
    ],
  },
  {
    path:"/login",
    element:<Login></Login>
  }
]);