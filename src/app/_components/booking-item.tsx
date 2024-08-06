//export interface Props { }

import { AvatarImage } from "@radix-ui/react-avatar"
import { Avatar } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

// To do []: reciber agendamento como props
export default function BookingItem() {
  return (
    <>
      <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
        Agendamentos
      </h2>
      <Card>
        <CardContent className="flex justify-between p-0">
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge className="w-fit">Confirmado</Badge>
            <h3 className="font-semibold">Corte de Cabelo</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://avatars.githubusercontent.com/u/115958290?v=4" />
              </Avatar>
              <p className="text-sm">Barbearia do Davy</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-l-2 px-5">
            <p className="text-sm">Agosto</p>
            <p className="text-2xl">05</p>
            <p className="text-sm">21:00</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
