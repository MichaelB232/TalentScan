// src/config/prisma.ts
// Singleton Prisma client instance – import this everywhere DB access is needed.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});

export default prisma;
