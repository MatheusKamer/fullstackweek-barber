import { format } from "date-fns"
import { ptBR } from "date-fns/locale";
import Header from "../_components/header";
import { capitalizeFirstLetter } from "../_utils/capitalizeFirstLetter";
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { Key } from "react";
import Search from "./_components/Search";

export default async function Home() {
  const barbershops = await db.barbershop.findMany({})

  return (
    <div>
      <Header />

      <div className="px-5 py-6 space-y-1">
        <h2 className="text-xl font-bold">Olá, Matheus</h2>
        <p className="text-sm">{
            capitalizeFirstLetter(format(new Date(), "EEEE',' dd 'de' MMMM", {
          locale: ptBR,
          }))}
        </p>
      </div>

      <div className="px-5">
        <Search />
      </div>

      <div className="px-5 pt-9 space-y-3">
        <h2 className="text-sm uppercase text-gray-400 font-bold">AGENDAMENTOS</h2>
        <BookingItem />
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="px-5 text-sm uppercase text-gray-400 font-bold">RECOMENDADOS</h2>

        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: { id: Key | null | undefined; }) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3 mb-12">
        <h2 className="px-5 text-sm uppercase text-gray-400 font-bold">POPULARES</h2>

        <div className="px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: { id: Key | null | undefined; }) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
