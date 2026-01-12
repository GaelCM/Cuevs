import type { compra } from "@/types/compras";
import type { CorteCajaReporte, CorteDataCierre, CorteFinalResponse, CorteResponse, ResumenDiarioCorteReporte } from "@/types/cortesResponse";
import type { DatosVentaPorDia, ProductoMasVendidoPorCategoria, ProductosBajoStock, TopProductoVendido, VentasPorHora } from "@/types/dashboardResponse";
import type { DetalleDeudorResponse, Deudores } from "@/types/deudores";
import type { Gasto, GastoInput } from "@/types/gastos";
import type { MovimientoInventarioPorDia, ProductoMayorRotacion, ProductoMenorRotacion, StockGeneral, StockPorCategoria } from "@/types/inventarioResponse";
import type { Categorias, Producto, ProductoItem, ProductoResponse } from "@/types/Productos";
import type { Proveedor } from "@/types/proveedores";
import type { listaVentasPorMes, ventasPorMesReporte } from "@/types/reportesGenetal";
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
        nuevaVenta: (totalVenta: number, idUsuario: number, tipoPago:number ,status: number, productos: ProductoItem[], pago:number) => Promise<VentaResponse>;
        ///////////////////////////////
        getCategorias: () => Promise<Categorias[]>;
        insertarCategoria: (categoria: Categorias) => Promise<{success:boolean, message:string}>;
        getCategoriaById: (idCategoria: number) => Promise<Categorias>;
        updateCategoria: (categoria: Categorias) => Promise<{success:boolean, message:string}>;
        deleteCategoria: (idCategoria: number) => Promise<{success:boolean, message:string}>;
        ///////////////////////////////
        reporteVentas: (fechaDesde: string, fechaHasta: string) => Promise<Venta[]>;
        reporteTotalVentas:(fechaDesde: string, fechaHasta: string)=>Promise<[{total:number}]>;
        detalleVenta: (idVenta: string) => Promise<DetalleVenta[]>;
        ///////////////////////////////
        login: (username: string, password: string) => Promise<{success:boolean, message:string, data:Usuario, token:string, path:string}>;
        ///////////////////////////////
        obtenerDatosVentaPorDIa: () => Promise<DatosVentaPorDia[]>;
        obtenerTopProductosVendidos: () => Promise<TopProductoVendido[]>;
        obtenerVentasPorHora: () => Promise<VentasPorHora[]>;
        obtenerProductosMasVendidosPorCategoria: () => Promise<ProductoMasVendidoPorCategoria[]>;
        obtenerProductosBajoInventario:()=>Promise<ProductosBajoStock[]>;

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
        ////////////////////////////
        obtenerDeudores: () => Promise<Deudores[]>;
        obtenerDetalleDeudor: (idDeudor: number) => Promise<DetalleDeudorResponse[]>;
        insertarDeudor:(deudor:Deudores)=> Promise<{success:boolean, message:string, data: string}>;
        insertarProductoDeudor:(idDeudor:number,producto:Producto,cantidad:number)=> Promise<{success:boolean, message:string, data: string}>;
        obtenerDeudor:(idDeudor:number)=>Promise<DetalleDeudorResponse>;
        eliminarDeudor:(idDeudor:number)=> Promise<{success:boolean, message:string}>;
        eliminarProductoDeudor:(idDeudor:number,idProducto:string)=>Promise<{success:boolean, message:string}>;

        ////////////////////////////
        insertarCompra:(compra:compra)=>Promise<{success:boolean, message:string, data: string}>;
        reporteTotalCompras:(fechaDesde: string, fechaHasta: string)=>Promise<[{total:number}]>;
        obtenerCompras:(fechaDesde: string, fechaHasta: string)=>Promise<{success:boolean, message:string, data: compra[]}>;

        ////////////////////////////
        insertarGasto:(gasto:GastoInput)=>Promise<{success:boolean, message:string, data: string}>;
        reporteTotalGastos:(fechaDesde: string, fechaHasta: string)=>Promise<[{total:number}]>;
        obtenerGastos:(fechaDesde: string, fechaHasta: string)=>Promise<{success:boolean, message:string, data: Gasto[]}>;

        ///////////////////////////7
        insertarNuevoCorte:(idUsuario:number, montoInicialEfectivo:number)=>Promise<{success:boolean, message:string, data:CorteResponse}>;
        cerrarCorte:(dataCierre:CorteDataCierre)=>Promise<{success:boolean, message:string, data:CorteFinalResponse}>;
        detalleCortes:(fechaDesde: string, fechaHasta: string)=>Promise<{success:boolean, message:string, data:CorteCajaReporte[]}>;
        resumenDiarioCortes:(fechaDesde: string, fechaHasta: string)=>Promise<{success:boolean, message:string, data:ResumenDiarioCorteReporte[]}>;
        ///////////////////////////7

        getReporteVentasPorMes:(fechaDesde:string,fechaHasta:string)=>Promise<ventasPorMesReporte[]>;
        getListaVentasPorMes:(fechaDesde:string,fechaHasta:string)=>Promise<listaVentasPorMes[]>;


        /////////////alertas////////////////
        alertarUser:()=>Promise<{success:boolean, message:string}>;

      };
    }
  }
  
export {}; // Muy importante para que TypeScript trate esto como un módulo y no genere errores.