"use server"

import { db } from "@/app/_lib/prisma";

interface SaveBookingParams {
  barbershopId: string;
  serverId: string;
  userId: string;
  date: string;
}

export const saveBooking = async (params: SaveBookingParams) => {
  await db.booking.create({
    data: {
      barbershopId: params.barbershopId,
      serviceId: params.userId,
      userId: params.userId,
      date: params.date,
    }
  })
}
