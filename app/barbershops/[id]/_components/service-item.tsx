"use client"

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";

interface ServiceItemProps {
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({ service, isAuthenticated }: ServiceItemProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [hour, setHour] = useState<string | undefined>()

  const handleDateClick = (date: Date | undefined) => {
    setDate(date)
    setHour(undefined)
  }

  const handleHourClick = (time: string) => {
    setHour(time)
  }

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      // return signIn("google");
    }

    // TODO abrir modal de agendamento
  }

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : []
  }, [date]);

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
                {Intl.NumberFormat('pt-BR', {
                  style: "currency",
                  currency: "BRL"
                }).format(service.price)}
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
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
                    <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden py-6 px-5 gap-3 border-y border-solid border-secondary">
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
