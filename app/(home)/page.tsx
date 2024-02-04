import { format } from "date-fns"
import { getServerSession } from "next-auth";
import { ptBR } from "date-fns/locale";
import { Barbershop, Booking } from "@prisma/client";
import { db } from "../_lib/prisma";
import Search from "./_components/search";
import Header from "../_components/header";
import BookingItem from "../_components/booking-item";
import BarbershopItem from "./_components/barbershop-item";
import { authOptions } from "../_lib/auth";
import { capitalizeFirstLetter } from "../_utils/capitalizeFirstLetter";

export default async function Home() {
  const session = await getServerSession(authOptions)

  const [barbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    session?.user ? db.booking.findMany({
      where: {
        userId: (session?.user as any).id,
        date: {
          gte: new Date(),
        }
      },
      include: {
        service: true,
        barbershop: true,
      },
      orderBy: {
        date: 'asc'
      }
    }) : Promise.resolve([])
  ])

  return (
    <div>
      <Header />

      <div className="px-5 py-6 space-y-1">
        <h2 className="text-xl font-bold">{session?.user ? `Olá, ${session.user.name}` : `Olá, faça seu login!`}</h2>
        <p className="text-sm">{
            capitalizeFirstLetter(format(new Date(), "EEEE',' dd 'de' MMMM", {
          locale: ptBR,
          }))}
        </p>
      </div>

      <div className="px-5">
        <Search />
      </div>

      {confirmedBookings.length > 0 && (
        <div className="px-5 pt-9 space-y-3">
          <h2 className="text-sm uppercase text-gray-400 font-bold">AGENDAMENTOS</h2>

          <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {confirmedBookings.map((booking: Booking) =>
              <BookingItem key={booking.id} booking={booking}/>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <h2 className="px-5 text-sm uppercase text-gray-400 font-bold">RECOMENDADOS</h2>

        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: Barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3 mb-12">
        <h2 className="px-5 text-sm uppercase text-gray-400 font-bold">POPULARES</h2>

        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: Barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
