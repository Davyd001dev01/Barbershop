import Image from "next/image"
import { Button } from "./_components/ui/button"
import Header from "./_components/header"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/quick-search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-bookings"

export default async function Home() {
  const session = await getServerSession(authOptions)

  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  const confirmedBookings = await getConfirmedBookings()

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">
          Olá,{" "}
          {session?.user ? session.user.name?.split(" ")[0] : "seja bem vindo"}{" "}
          !
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>{format(new Date(), " 'de' MMMM", { locale: ptBR })}</span>
        </p>

        {/* Buscar */}
        <div className="mt-6">
          <Search />
        </div>

        {/* Geração das quicks searchs */}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((quickSearchOption) => {
            return (
              <Button
                className="gap-2"
                variant="secondary"
                key={quickSearchOption.title}
                asChild
              >
                <Link href={`/barbershops?service=${quickSearchOption.title}`}>
                  <Image
                    alt={`Buscar por ${quickSearchOption.title}`}
                    src={quickSearchOption.imageUrl}
                    width={16}
                    height={16}
                  />
                  {quickSearchOption.title}
                </Link>
              </Button>
            )
          })}
        </div>

        {/*Imagem do Banner */}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            alt="banner Agenda nos melhores"
            src="/banner-pizza-01.jpg"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {/* Mostra os meus agendamentos */}

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>

            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((confirmedBooking) => (
                <BookingItem
                  key={confirmedBooking.id}
                  booking={JSON.parse(JSON.stringify(confirmedBooking))}
                />
              ))}
            </div>
          </>
        )}

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((popularBarbershop) => (
            <BarbershopItem
              key={popularBarbershop.id}
              barbershop={popularBarbershop}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
