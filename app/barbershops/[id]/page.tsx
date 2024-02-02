import { getServerSession } from "next-auth";
import { Service } from "@prisma/client";
import { db } from "@/app/_lib/prisma";
import ServiceItem from "./_components/service-item";
import BarbershopInfo from "./_components/barbershop-info";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  }
}

const BarbershopDetailsPage = async ({params}: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions)

  if (!params.id) {
    // TODO: redirecionar para home page
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true
    }
  });

  if (!barbershop) {
    // TODO: redirecionar para home page
    return null
  }

  return (
    <div>
      <BarbershopInfo
        barbershop={barbershop}
      />

      <div className="p-5 flex flex-col gap-3">
        {barbershop.services.map((service: Service) => (
          <ServiceItem
            key={service.id}
            service={service}
            isAuthenticated={!!session?.user}
            barbershop={barbershop}
          />
        ))}
      </div>
    </div>
  );
}

export default BarbershopDetailsPage;
