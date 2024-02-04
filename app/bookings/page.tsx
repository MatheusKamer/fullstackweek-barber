import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";
import { Key } from "react";
import { isFuture, isPast } from "date-fns";
import { Booking } from "@prisma/client";

const BookingPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return redirect("/")
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date(),
        }
      },
      include: {
        service: true,
        barbershop: true,
      }
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date(),
        }
      },
      include: {
        service: true,
        barbershop: true,
      }
    })
  ])

  /* Forma de realizar os filtros anteriores via JavaScript + Date FNS
  const confirmedBookings = bookings.filter((booking: Booking) => isFuture(booking.date))
  const finishedBookings = bookings.filter((booking: Booking) => isPast(booking.date))
  */

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {confirmedBookings.length >= 0 && (
          <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Confirmados</h2>
        )}

        <div className="flex flex-col gap-3 mt-3">
          {confirmedBookings.map((booking: Booking) => (
            <BookingItem key={booking.id} booking={booking}/>
          ))}
        </div>

        {finishedBookings.length > 0 && (
          <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Finalizados</h2>
        )}

        <div className="flex flex-col gap-3 mt-3">
          {finishedBookings.map((booking: { id: Key | null | undefined; }) => (
            <BookingItem key={booking.id} booking={booking}/>
          ))}
        </div>
      </div>
    </>
  )
}

export default BookingPage;
