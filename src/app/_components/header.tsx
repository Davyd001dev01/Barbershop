import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { CalendarIcon, HomeIcon, LogOutIcon, MenuIcon } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { quickSearchOptions } from "../_constants/quick-search"
import { Avatar } from "./ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import Link from "next/link"

export default function Header() {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Image alt="Logo FSW Barber" src="/logo.svg" height={18} width={120} />
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>

            {/* Avatar e informações do usuario */}
            <div className="flex items-center gap-3 border-b border-solid py-5">
              <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/115958290?v=4" />
              </Avatar>

              <div>
                <p className="font-bold">Davyd Viana</p>
                <p className="text-xs text-gray-500">davyd7dev01@gmail.com</p>
              </div>
            </div>

            {/* Botões (Inicio e Agendamentos) */}
            <div className="flex flex-col gap-4 border-b border-solid py-5">
              <SheetClose asChild>
                <Button asChild className="justify-start gap-2" variant="ghost">
                  <Link href="/">
                    <HomeIcon size={18} />
                    Início
                  </Link>
                </Button>
              </SheetClose>
              <Button className="justify-start gap-2" variant="ghost">
                <CalendarIcon size={18} />
                Agendamentos
              </Button>
            </div>

            {/* Botões de quick search */}
            <div className="flex flex-col gap-4 border-b border-solid py-5">
              {quickSearchOptions.map((option) => (
                <Button
                  key={option.title}
                  className="justify-start gap-2"
                  variant="ghost"
                >
                  <Image
                    alt={`Ir para ${option.title}`}
                    src={option.imageUrl}
                    height={18}
                    width={18}
                  />
                  {option.title}
                </Button>
              ))}
            </div>

            <div className="flex flex-col gap-4 py-7">
              <Button className="justify-start gap-2" variant="ghost">
                <LogOutIcon size={18} />
                Sair da conta
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}
