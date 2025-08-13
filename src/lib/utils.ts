import type { DatosVentaPorDia, ProductoMasVendidoPorCategoria, TopProductoVendido, VentasPorHora } from "@/types/dashboardResponse";
import type { MovimientoInventarioPorDia, ProductoMayorRotacion, ProductoMenorRotacion, StockGeneral, StockPorCategoria } from "@/types/inventarioResponse";
import type { Categorias, Producto, ProductoItem, ProductoResponse } from "@/types/Productos";
import type { Proveedor } from "@/types/proveedores";
import type { Notes } from "@/types/test";
import type { Usuario, UsuarioPublico } from "@/types/Usuarios";
import type { DetalleVenta, Venta, VentaResponse } from "@/types/ventas";



import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatCurrency = (value:number) => {
  return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
  }).format(value);}
  


declare global {
    interface Window {
      electronApi: {
        getNotes: () => Promise<Notes[]>;
        addNotes: (name: string) => Promise<Notes>;
        deleteNotes: (id: number) => Promise<{ id: number }>;
        ///////////////////////////////
        getProductos: () => Promise<Producto[]>;
        getProducto: (id:string) => Promise<Producto>;
        getProductoForVenta: (id:string) => Promise<Producto>;
        insertarProducto: (producto: Producto, idUsuario:number) => Promise<ProductoResponse>;
        updateProducto: (producto: Producto, idUsuario:number) => Promise<ProductoResponse>;
        deleteProducto: (id: string) => Promise<{success:boolean, message:string}>;
        getProductosXCategoria: (idCategoria: number) => Promise<Producto[]>;
        ///////////////////////////////
        nuevaVenta: (totalVenta: number, idUsuario: number, status: number, productos: ProductoItem[], pago:number) => Promise<VentaResponse>;
        ///////////////////////////////
        getCategorias: () => Promise<Categorias[]>;
        insertarCategoria: (categoria: Categorias) => Promise<{success:boolean, message:string}>;
        getCategoriaById: (idCategoria: number) => Promise<Categorias>;
        updateCategoria: (categoria: Categorias) => Promise<{success:boolean, message:string}>;
        deleteCategoria: (idCategoria: number) => Promise<{success:boolean, message:string}>;
        ///////////////////////////////
        reporteVentas: (fechaDesde: string, fechaHasta: string) => Promise<Venta[]>;
        detalleVenta: (idVenta: string) => Promise<DetalleVenta[]>;
        ///////////////////////////////
        login: (username: string, password: string) => Promise<{success:boolean, message:string, data:Usuario, token:string, path:string}>;
        ///////////////////////////////
        obtenerDatosVentaPorDIa: () => Promise<DatosVentaPorDia[]>;
        obtenerTopProductosVendidos: () => Promise<TopProductoVendido[]>;
        obtenerVentasPorHora: () => Promise<VentasPorHora[]>;
        obtenerProductosMasVendidosPorCategoria: () => Promise<ProductoMasVendidoPorCategoria[]>;
        ///////////////////////////////
        insertarUsuario:(usuario:Usuario)=>Promise<{success:boolean,message: string,data: string}>
        obtenerUsuariosPublicos:()=>Promise<UsuarioPublico[]>;

        ///////////////////////////////
        getProveedores: () => Promise<Proveedor[]>;
        getProveedorById: (idProveedor: number) => Promise<Proveedor>;
        addProveedor: (proveedor: Proveedor) => Promise<{success:boolean, message:string}>;
        updateProveedor: (proveedor: Proveedor) => Promise<{success:boolean, message:string}>;
        deleteProveedor: (idProveedor: number) => Promise<{success:boolean, message:string}>;
        ////////////////////////////
        obtenerDatosStockPorCategorias: () => Promise<StockPorCategoria[]>;
        obtenerDatosStockGeneral: () => Promise<StockGeneral[]>;
        productosConMayorRotacionPorMes: () => Promise<ProductoMayorRotacion[]>;
        productosConMenorRotacionPorMes: () => Promise<ProductoMenorRotacion[]>;
        movimientosInventarioPorDia:()=> Promise<MovimientoInventarioPorDia[]>;
      };
    }
  }
  
export {}; // Muy importante para que TypeScript trate esto como un módulo y no genere errores.