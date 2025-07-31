import { useUserData } from "@/hooks/globalUser"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function PerfilPages() {
  const { user } = useUserData()

  if (!user) return <div className="flex justify-center items-center h-64">Cargando...</div>

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br bg-white py-8">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24 shadow-md">
            <AvatarImage src={"https://cdn-icons-png.flaticon.com/512/3135/3135768.png"} />
            <AvatarFallback>{user.nombre?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-slate-800">{user.nombre} {user.apellidos}</h2>
          <Badge className="mb-2" variant="outline">ventas</Badge>
          <div className="w-full mt-4 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Usuario:</span>
              <span>{user.usuario}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Email:</span>
              <span>{user.email || "-"}</span>
            </div>
          </div>
          <Button className="mt-6 w-full" variant="secondary">Editar perfil</Button>
        </div>
      </Card>
    </div>
  )
}