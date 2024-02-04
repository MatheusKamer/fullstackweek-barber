"use client"

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { format, setHours, setMinutes } from "date-fns";
import Image from "next/image";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Barbershop, Booking, Service } from "@prisma/client";
import getDayBookings from "../_actions/get-bookings";
import { saveBooking } from "../_actions/save-booking";
import { generateDayTimeList } from "../_helpers/hours";
import currencyFormat from "@/app/_utils/currencyFormat";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";

interface ServiceItemProps {
  barbershop: Barbershop
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({ service, isAuthenticated, barbershop }: ServiceItemProps) => {
  const router = useRouter()
  const { data } = useSession()

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>()
  const [submitIsLoading, setSubmitIsLoading] = useState(false)
  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!date) {
      return
    }

    const refreshAvailableHours = async () => {
      const dayBookingsDB = await getDayBookings(barbershop.Id, date)

      setDayBookings(dayBookingsDB)
    }

    refreshAvailableHours();
  }, [date, barbershop])

  const handleDateClick = (date: Date | undefined) => {
    setDate(date)
    setHour(undefined)
  }

  const handleHourClick = (time: string) => {
    setHour(time)
  }

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }

    // TODO abrir modal de agendamento
  }

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true)
    try {
      if(!hour || !date || !data?.user) {
        return
      }

      const dateHour = Number(hour.split(':')[0])
      const dateMinutes = Number(hour.split(':')[1])

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes)

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        userId: (data.user as any).id,
        date: newDate
      })

      setSheetIsOpen(false);
      setHour(undefined)
      setDate(undefined)
      toast("Agendamento realizado com sucesso!", {
        description: (format(date, "'Para dia' dd 'de' MMMM", {
          locale: ptBR,
        })+ ` às ${hour}`),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitIsLoading(false)
    }
  }

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return  generateDayTimeList(date).filter(time => {
      const timeHour = Number(time.split(':')[0]);
      const timeMinutes = Number(time.split(':')[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes
      })

      if (!booking) {
        return true
      }

      return false
    })
  }, [date, dayBookings]);

  return (
    <Card className="rounded-md">
      <CardContent className="p-3">
        <div className="flex gap-4 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              style={{
                objectFit: 'contain'
              }}
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col text-sm w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-sm font-bold">
                {currencyFormat(service.price)}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={handleBookingClick}
                  >
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0 -webkit-overflow-scrolling touch">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    locale={ptBR}
                    fromDate={new Date()}
                    className="mt-6"
                    styles={{
                      head_cell: { width: "100%", textTransform: "capitalize" },
                      cell: { width: "100%" },
                      button: { width: "100%" },
                      nav_button_previous: { width: "32px", height: "32px" },
                      nav_button_next: { width: "32px", height: "32px" },
                      caption: { textTransform: "capitalize" }
                    }}
                  />

                  {date && (
                    <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden py-6 px-5 gap-3 border-t border-solid border-secondary">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => handleHourClick(time)}
                          className="rounded-full"
                          key={time}
                          variant={
                            hour === time ? 'default' : 'secondary'
                          }
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 space-y-3">
                        <div className="flex justify-between font-bold">
                          <h2>{service.name}</h2>
                          <h3 className="text-sm">{currencyFormat(service.price)}</h3>
                        </div>

                        {date && (
                          <div className="flex justify-between text-sm">
                            <h3 className="text-gray-400">Data</h3>
                            <h3>
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                          </h3>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between text-sm">
                            <h3 className="text-gray-400">Horário</h3>
                            <h3>{hour}</h3>
                          </div>
                        )}

                        <div className="flex justify-between text-sm">
                          <h3 className="text-gray-400">Barbearia</h3>
                          <h3>{barbershop.name}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className="px-5">
                    <Button disabled={!date || !hour || submitIsLoading} onClick={handleBookingSubmit}>
                      {submitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceItem;
