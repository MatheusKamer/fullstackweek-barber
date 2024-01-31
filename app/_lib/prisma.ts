import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
