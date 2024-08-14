import { getServerSession } from "next-auth"
import Header from "../_components/header"
import { db } from "../_lib/prisma"
import { authOptions } from "../_lib/auth"
import { notFound } from "next/navigation"
import BookingItem from "../_components/booking-item"

export default async function Bookings() {
  const sesssion = await getServerSession(authOptions)
  // TODO: fazer um pop-up de login
  if (!sesssion?.user) return notFound()

  // const bookings = await db.booking.findMany({
  //   where:{
  //     userId: (sesssion?.user as any).id
  //   },
  //   include: {
  //     service: {
  //       include:{
  //         barbershop: true
  //       }
  //     }
  //   },
  // })

  const confirmedBookings = await db.booking.findMany({
    where: {
      userId: (sesssion?.user as any).id,
      date: {
        gte: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  const finishedBookings = await db.booking.findMany({
    where: {
      userId: (sesssion?.user as any).id,
      date: {
        lt: new Date(),
      },
    },
    include: {
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {confirmedBookings.length === 0 && finishedBookings.length === 0 && (
          <p className="font-extrabold text-gray-400">
            Você não possui agendamentos.
          </p>
        )}

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Confirmados
            </h2>
          </>
        )}
        {confirmedBookings.map((confirmedBooking) => (
          <BookingItem
            key={confirmedBooking.id}
            booking={JSON.parse(JSON.stringify(confirmedBooking))}
          />
        ))}
        {finishedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Finaliados
            </h2>
          </>
        )}
        {finishedBookings.map((finishedBooking) => (
          <BookingItem
            key={finishedBooking.id}
            booking={JSON.parse(JSON.stringify(finishedBooking))}
          />
        ))}
      </div>
    </>
  )
}
