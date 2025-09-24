import { useTurnoStore } from "@/hooks/turno";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import type { EstadoVenta } from "@/types/ventas";
import type { CorteFinalResponse } from "@/types/cortesResponse";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, CreditCard, DollarSign, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { Separator } from "@radix-ui/react-select";


type props={
    isOpen:boolean,
    setOpen:(isOpen:boolean)=>void,
}

export default function DialogCerrarCaja({isOpen,setOpen}:props){

    const {cerrarTurno}=useTurnoStore();
    const [montoFinal, setMontoFinal] = useState('');
    const [estado, setEstado] = useState<EstadoVenta>("inicio");
    const [data,setData]=useState<CorteFinalResponse>();

    const cerrarCorte=async(e: React.FormEvent)=>{
        e.preventDefault()
        if (!montoFinal || parseFloat(montoFinal) < 0) return
        setEstado("cargando")
        try {
        const res=await cerrarTurno(parseFloat(montoFinal),"")
        if(res?.success){
            setMontoFinal("")
            setData(res.data)
            setEstado("finalizado")
            //setOpen(false);
        }
        } catch (error) {
        console.error('Error:', error)
        } finally {
        setEstado("finalizado")
        }
    }

    const handleClose = () => {
        setMontoFinal("");
        setEstado("inicio");
        setData(undefined);
        setOpen(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const getDiferenciaColor = (diferencia: number) => {
        if (diferencia > 0) return "text-green-600 bg-green-50";
        if (diferencia < 0) return "text-red-600 bg-red-50";
        return "text-gray-600 bg-gray-50";
    };

    const getDiferenciaIcon = (diferencia: number) => {
        if (diferencia > 0) return <TrendingUp className="w-5 h-5" />;
        if (diferencia < 0) return <TrendingDown className="w-5 h-5" />;
        return <CheckCircle className="w-5 h-5" />;
    };

    const renderFormulario = () => (
        <>
            <DialogHeader>
                <DialogTitle>Corte de caja</DialogTitle>
                <DialogDescription>
                    Favor de revisar los datos
                </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={cerrarCorte}>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Monto Final En Efectivo Que hay En La Caja.
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        value={montoFinal}
                        onChange={(e) => setMontoFinal(e.target.value)}
                        placeholder="0.00"
                        className="text-lg text-center"
                        required
                        disabled={estado === "cargando"}
                    />
                </div>

                <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-700">
                        <strong>Instrucciones:</strong><br/>
                        • Cuenta el efectivo que tienes en caja<br/>
                        • Ingresa la cantidad exacta<br/>
                        • Este será tu monto final de efectivo obtenido
                    </p>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={estado === "cargando"}
                >
                    {estado === "cargando" ? "Procesando..." : "Cerrar Caja y Realizar Corte"}
                </Button>
            </form>
        </>
    );

    const renderReporte = () => {
        if (!data) return null;

        return (
            <>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Corte de Caja Completado
                    </DialogTitle>
                    <DialogDescription>
                        Corte #{data.idCorte} - {data.fechaCierre}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Resumen de Diferencia */}
                    <Card className={`${getDiferenciaColor(data.diferencia)} border-2`}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getDiferenciaIcon(data.diferencia)}
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {data.diferencia === 0 ? "Corte Exacto" : 
                                             data.diferencia > 0 ? "Sobrante" : "Faltante"}
                                        </h3>
                                        <p className="text-sm opacity-75">
                                            Diferencia en efectivo
                                        </p>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(Math.abs(data.diferencia))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Métricas de Efectivo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <DollarSign className="w-5 h-5" />
                                Control de Efectivo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Monto Inicial</p>
                                    <p className="text-lg font-semibold">{formatCurrency(data.montoInicial)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Monto Esperado</p>
                                    <p className="text-lg font-semibold">{formatCurrency(data.montoEsperado)}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Monto Final Contado</p>
                                <p className="text-xl font-bold text-blue-600">{formatCurrency(data.montoFinal)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Métricas de Ventas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-8 h-8 text-green-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ventas en Efectivo</p>
                                        <p className="text-lg font-semibold">{formatCurrency(data.ventasEfectivo)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ventas con Tarjeta</p>
                                        <p className="text-lg font-semibold">{formatCurrency(data.ventasTarjeta)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resumen General */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Receipt className="w-5 h-5" />
                                Resumen del Turno
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Total Ventas:</span>
                                        <span className="font-semibold text-green-600">
                                            {formatCurrency(data.totalVentas)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Total Compras:</span>
                                        <span className="font-semibold text-red-600">
                                            {formatCurrency(data.totalCompras)}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Transacciones:</span>
                                        <Badge variant="outline" className="ml-2">
                                            {data.totalTransacciones}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Balance Neto:</span>
                                        <span className="font-bold text-lg">
                                            {formatCurrency(data.totalVentas - data.totalCompras)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones de Acción */}
                    <div className="flex gap-2 pt-4">
                        <Button 
                            onClick={handleClose} 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            autoFocus
                        >
                            Finalizar
                        </Button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className={estado === "finalizado" ? "max-w-xl" : "max-w-md"}>
                {estado === "finalizado" ? renderReporte() : renderFormulario()}
            </DialogContent>
        </Dialog>
    );
}