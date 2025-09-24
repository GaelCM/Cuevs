// components/IniciarTurno.tsx
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTurnoStore } from '@/hooks/turno'
import { useUserData } from '@/hooks/globalUser'

export function IniciarTurno() {
  const [montoInicial, setMontoInicial] = useState('')
  const [loading, setLoading] = useState(false)
  const {iniciarTurno} = useTurnoStore()
  const {user}=useUserData()
  
  // Aquí obtienes el usuario actual de tu sistema de auth
  const idUsuario = user.idUsuario;

  const handleIniciarTurno = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!montoInicial || parseFloat(montoInicial) < 0) return
    
    setLoading(true)
    try {
      await iniciarTurno(parseFloat(montoInicial), idUsuario)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[85dvh] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Iniciar Turno</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleIniciarTurno} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Monto inicial en efectivo
              </label>
              <Input
                type="number"
                step="0.01"
                value={montoInicial}
                onChange={(e) => setMontoInicial(e.target.value)}
                placeholder="0.00"
                className="text-lg text-center"
                required
              />
            </div>
            
            <div className="bg-red-50 p-3 text-2xl rounded-lg">
              <p className="text-xl text-red-700">
                <strong>Instrucciones:</strong><br/>
                • Cuenta el efectivo que tienes en caja<br/>
                • Ingresa la cantidad exacta<br/>
                • Este será tu monto base para el corte
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading || !montoInicial}
            >
              {loading ? 'Iniciando...' : 'Iniciar Turno'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}