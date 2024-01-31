import { db } from "@/app/_lib/prisma";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  }
}

const BarbershopDetailsPage = async ({params}: BarbershopDetailsPageProps) => {
  if (!params.id) {
    // TODO: redirecionar para home page
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!barbershop) {
    // TODO: redirecionar para home page
    return null
  }

  return (
    <h1>{barbershop.name}</h1>
  );
}

export default BarbershopDetailsPage;
