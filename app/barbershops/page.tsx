import { Barbershop } from "@prisma/client";
import BarbershopItem from "../(home)/_components/barbershop-item";
import Header from "../_components/header";
import { db } from "../_lib/prisma";

interface BarbershopPageProps{
  searchParams: {
    search?: string
  }
}

const BarbershopPage = async ({ searchParams }: BarbershopPageProps) => {
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: 'insensitive',
      }
    }
  })

  return(
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-gray-400 font-bold text-xs uppercase">
          Resultados para &quot;{searchParams.search}&quot;
        </h1>

        <div className="grid grid-cols-2 mt-3">
          {barbershops.map((barbershop: Barbershop) => {
            <div className="w-full gap-4">
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            </div>
          })}
        </div>
      </div>
    </>
  );
}

export default BarbershopPage;
