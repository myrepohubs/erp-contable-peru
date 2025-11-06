// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  /// allow global `var` declarations
  /// eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Opcional: para ver las consultas SQL en la consola de desarrollo
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;