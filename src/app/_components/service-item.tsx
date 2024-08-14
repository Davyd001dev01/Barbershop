/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { addDays, isPast, isToday, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import BookingSummary from "./booking-summary"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

interface GetTimeListProps {
  booking: Booking[]
  selectedDay: Date
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

function getTimeList({ booking, selectedDay }: GetTimeListProps) {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minute = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(
      set(new Date(), { hours: hour, minutes: minute }),
    )

    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }

    const hasBookingOnCurrentTime = booking.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minute,
    )

    if (hasBookingOnCurrentTime) return false

    return true
  })
}

export default function ServiceItem({ service, barbershop }: ServiceItemProps) {
  const { data } = useSession()

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )

  const [singInDialogIsOpen, setSingInDialogIsOpen] = useState(false)
  const [dayBookings, setDayBooking] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBooking(bookings)
    }
    fetch()
  }, [selectedDay, service.id])

  // console.log(dayBookings)

  function handleDateSelect(date: Date | undefined) {
    setSelectedDay(date)
  }

  function handleTimeSelect(time: string | undefined) {
    setSelectedTime(time)
  }

  async function handleCreateBooking() {
    try {
      if (!selectedDate) return
      // const dateWithNewMinute = setMinutes(selectedDay, Number(minute))
      // const dateWithNewHour = setHours(dateWithNewMinute, Number(hour))
      await createBooking({
        serviceId: service.id,
        date: selectedDate,
      })
      handleBookingSheetOpenChange()
      toast.success("Reserva criada com sucesso!")
    } catch (e) {
      console.log(e)
      toast.error("Erro ao criar reserva!")
    }
  }

  function handleBookingSheetOpenChange() {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBooking([])
    setBookingSheetIsOpen(false)
  }

  function handleBookingClick() {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }
    return setSingInDialogIsOpen(true)
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []

    return getTimeList({
      booking: dayBookings,
      selectedDay,
    })
  }, [selectedDay])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return

    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex items-center gap-3">
            <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
              <Image
                alt={service.name}
                src={service.imageUrl}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">{service.name}</h3>
              <p className="text-sm text-gray-400">{service.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-primary">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(service.price))}
                </p>
                <Sheet
                  open={bookingSheetIsOpen}
                  onOpenChange={handleBookingSheetOpenChange}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleBookingClick}
                  >
                    Reservar
                  </Button>
                  <SheetContent className="px-0">
                    <SheetHeader>
                      <SheetTitle>Fazer Reserva</SheetTitle>
                    </SheetHeader>
                    {/* Calendario */}
                    <div className="border-b border-solid py-5">
                      <Calendar
                        mode="single"
                        locale={ptBR}
                        fromDate={addDays(new Date(), 0)}
                        selected={selectedDay}
                        onSelect={handleDateSelect}
                        styles={{
                          head_cell: {
                            width: "100%",
                            textTransform: "capitalize",
                          },
                          cell: { width: "100%" },
                          button: { width: "100%" },
                          nav_button_previous: {
                            width: "32px",
                            height: "32px",
                          },
                          nav_button_next: { width: "32px", height: "32px" },
                          caption: { textTransform: "capitalize" },
                        }}
                      />
                    </div>

                    {selectedDay && (
                      <div className="flex gap-2 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                        {timeList.length > 0 ? (
                          timeList.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className="rounded-full"
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </Button>
                          ))
                        ) : (
                          <p className="text-xs font-semibold">
                            Não há mais horários disponíveis no dia selecionado.
                          </p>
                        )}
                      </div>
                    )}

                    {selectedDate && (
                      <div className="p-5">
                        <BookingSummary
                          key={service.id}
                          barbershop={barbershop}
                          service={service}
                          selectedDate={selectedDate}
                        />
                      </div>
                    )}

                    <SheetFooter className="p-5">
                      <SheetClose asChild>
                        <Button
                          type="submit"
                          onClick={handleCreateBooking}
                          disabled={!selectedDay || !selectedTime}
                        >
                          Confirmar
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={singInDialogIsOpen}
        onOpenChange={(open) => setSingInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%] rounded-xl">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}
