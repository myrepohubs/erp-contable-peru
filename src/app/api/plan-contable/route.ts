// src/app/api/plan-contable/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Buscar cuentas en el plan contable
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q'); // 'q' para query/búsqueda

    if (!query) {
      // Si no hay query, podríamos devolver las cuentas principales o un array vacío.
      const cuentasPrincipales = await prisma.planContable.findMany({
        where: {
          // Por ejemplo, las que tienen 2 dígitos
          codigo: {
            // Esto es un truco regex para postgres para buscar por longitud
            // En un caso real podrías tener un campo booleano 'esPrincipal'
            // O simplemente devolver un array vacío y forzar la búsqueda
            // Esta línea es solo un ejemplo, la eliminaremos para forzar búsqueda
          },
        },
        take: 20, // Limitar resultados
      });
      return NextResponse.json(cuentasPrincipales);
    }

    const cuentas = await prisma.planContable.findMany({
      where: {
        OR: [
          {
            codigo: {
              startsWith: query, // Ideal para buscar por código
            },
          },
          {
            descripcion: {
              contains: query, // Búsqueda flexible por descripción
              mode: 'insensitive', // No distingue mayúsculas de minúsculas
            },
          },
        ],
      },
      take: 20, // Limitar el número de resultados para no sobrecargar el autocompletado
    });

    return NextResponse.json(cuentas);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}