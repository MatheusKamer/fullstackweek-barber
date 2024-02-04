"use client"

import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "./ui/badge";
import { Prisma } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import currencyFormat from "../_utils/currencyFormat";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service:true;
      barbershop: true;
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const isBookingConfirmed = isFuture(booking.date)

  const handleCancelClick = async () => {
    setIsDeleteLoading(true)
    try {
      await cancelBooking(booking.id)

      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleteLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="rounded-lg min-w-[90%]">
          <CardContent className="p-0 flex">
            <div className="flex flex-col gap-3 py-4 flex-[3] pl-5">
              <Badge variant={
                isBookingConfirmed ? "default" : "secondary"
              } className="w-fit">{
                isBookingConfirmed ? "Confirmado" : "Finalizado"
              }</Badge>
              <h2 className="font-bold">{booking.service.name}</h2>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl}/>

                  <AvatarFallback>A</AvatarFallback>
                </Avatar>

                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-l border-solid border-secondary flex-1">
              <p className="text-sm capitalize">{format(booking.date, "MMMM", {
                locale: ptBR,
              })}</p>
              <p className="text-2xl">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "hh:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="px-0">
        <SheetHeader className="text-left pb-6 px-5 border-b border-solid border-secondary">
          <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
            <Image alt={booking.barbershop.name} src="/barbershop-map.png" fill />

            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card>
                <CardContent className="p-3 flex gap-2">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>

                  <div>
                    <h2 className="font-bold overflow-hidden text-nowrap text-ellipsis">{booking.barbershop.name}</h2>
                    <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">{booking.barbershop.address}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Badge variant={
            isBookingConfirmed ? "default" : "secondary"
          } className="w-fit my-6 mb-3">{
            isBookingConfirmed ? "Confirmado" : "Finalizado"
          }</Badge>

          <Card>
            <CardContent className="p-3 space-y-3">
              <div className="flex justify-between font-bold">
                <h2>{booking.service.name}</h2>
                <h3 className="text-sm">{currencyFormat(booking.service.price)}</h3>
              </div>

              <div className="flex justify-between text-sm">
                <h3 className="text-gray-400">Data</h3>
                <h3>
                  {format(booking.date, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}
              </h3>
              </div>

              <div className="flex justify-between text-sm">
                <h3 className="text-gray-400">Horário</h3>
                <h3>{format(booking.date, "hh:mm")}</h3>
              </div>

              <div className="flex justify-between text-sm">
                <h3 className="text-gray-400">Barbearia</h3>
                <h3>{booking.barbershop.name}</h3>
              </div>
            </CardContent>
          </Card>

          <SheetFooter className="flex-row gap-3 mt-3">
            <SheetClose asChild>
              <Button variant="secondary" className="w-1/2 text-xs">
                VOLTAR
              </Button>
            </SheetClose>
            <Button onClick={handleCancelClick} disabled={!isBookingConfirmed || isDeleteLoading} className="w-1/2 text-xs" variant="destructive">
              {isDeleteLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              )}
              CANCELAR RESERVA
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default BookingItem;
