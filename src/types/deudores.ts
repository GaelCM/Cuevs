

export type Deudores = {
    idDeudor: number;
    nombreDeudor: string;
    isActivo: number;
}

export type DetalleDeudores = {
    idDeudor: number;
    idProducto: string;
}

export type DetalleDeudorResponse = {
    idDeudor: number;
    nombreDeudor: string;
    isActivo: number;
    fechaCreacion: string;
    idProducto: string;
    cantidad: number;
    subtotal:number;
    nombreProducto: string;
    precio: number;
    descripcion: string;
}


