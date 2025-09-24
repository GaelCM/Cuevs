// stores/turnoStore.ts
import type { CorteFinalResponse } from '@/types/cortesResponse'
import { toast } from 'sonner'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TurnoState {
  turnoActivo: boolean
  corteActual: {
    idCorte: number | null
    fechaApertura: string | null
    montoInicial: number
    idUsuario: number | null
  }
  iniciarTurno: (montoInicial: number, idUsuario: number) => Promise<void>
  cerrarTurno: (montoFinal: number, observaciones?: string) =>  Promise<{ 
    success: boolean
    message: string
    data: CorteFinalResponse
  } | null>
  agregarMovimiento: (tipo: 'RETIRO' | 'INGRESO', monto: number, concepto: string) => Promise<void>
}

export const useTurnoStore = create<TurnoState>()(
  persist(
    (set, get) => ({
      turnoActivo: false,
      corteActual: {
        idCorte: null,
        fechaApertura: null,
        montoInicial: 0,
        idUsuario: null
      },

      iniciarTurno: async (montoInicial: number, idUsuario: number) => {
        if (window.electronApi?.insertarNuevoCorte) {
            const res = await window.electronApi.insertarNuevoCorte(idUsuario,montoInicial);
            if (!res) {
            console.log("Error al iniciar", res);
            }
            set({
                turnoActivo: true,
                corteActual:{
                    idCorte:res.data.idCorte,
                    fechaApertura:res.data.fechaApertura,
                    montoInicial:res.data.montoInicialEfectivo,
                    idUsuario:res.data.idUsuario
                }
            })
            toast.success("Caja abierta correctamente");
        }else {
            console.warn("electronAPI no está disponible.");
        }
        
    
      },

      cerrarTurno: async (montoFinal: number, observaciones = ''):Promise<{success: boolean, message: string, data: CorteFinalResponse}|null> => {
        const { corteActual } = get()
        
        if (window.electronApi?.cerrarCorte) {
        const res = await window.electronApi.cerrarCorte({
            idCorte:corteActual.idCorte || 0,
            idUsuario:corteActual.idUsuario || 1,
            montoFinalEfectivo:montoFinal,
            observaciones:observaciones
        });

        if (!res) {
            return null
        }
        set({
            turnoActivo:false,
            corteActual: {
            idCorte: null,
            fechaApertura: null,
            montoInicial: 0,
            idUsuario: null
        },
        })
        toast.success("Caja cerrada exitosamente");
        return res as {success: boolean, message: string, data: CorteFinalResponse;}

        }else{
          return null
        }
      },

      agregarMovimiento: async (tipo: 'RETIRO' | 'INGRESO', monto: number, concepto: string) => {
        const { corteActual } = get()
        if (!corteActual.idCorte) return
        
        try {
          await fetch('/api/movimientos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idCorte: corteActual.idCorte,
              tipoMovimiento: tipo,
              monto,
              concepto
            })
          })
        } catch (error) {
          console.error('Error al agregar movimiento:', error)
        }
      }
    }),
    {
      name: 'turno-storage',
      partialize: (state) => ({
        turnoActivo: state.turnoActivo,
        corteActual: state.corteActual
      })
    }
  )
)