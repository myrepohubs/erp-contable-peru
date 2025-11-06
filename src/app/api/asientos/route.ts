// src/app/api/asientos/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client'; // 👈 Import necesario para tipos de errores

// Representación del cuerpo (body) esperado en la solicitud POST
interface DetalleAsientoInput {
  planContableId: string;
  descripcion: string;
  debe: number;
  haber: number;
}

interface AsientoInput {
  fecha: string; // Se espera en formato ISO 8601
  glosa: string;
  detalles: DetalleAsientoInput[];
}

// POST: Crear un nuevo Asiento Contable
export async function POST(request: Request) {
  try {
    const body: AsientoInput = await request.json();
    const { fecha, glosa, detalles } = body;

    // 1. Validación de Datos de Entrada
    if (!fecha || !glosa || !detalles || detalles.length === 0) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos o detalles del asiento.' },
        { status: 400 }
      );
    }

    // 2. Validación contable: Partida doble
    const totalDebe = detalles.reduce((sum, d) => sum + d.debe, 0);
    const totalHaber = detalles.reduce((sum, d) => sum + d.haber, 0);

    if (Math.abs(totalDebe - totalHaber) > 0.001) {
      return NextResponse.json(
        {
          message: 'El asiento no cuadra. La suma del Debe debe ser igual a la suma del Haber.',
          debe: totalDebe,
          haber: totalHaber,
        },
        { status: 400 }
      );
    }

    // 3. Transacción para crear el asiento y sus detalles
    const nuevoAsiento = await prisma.$transaction(async (tx) => {
      const asientoCreado = await tx.asientoContable.create({
        data: {
          fecha: new Date(fecha),
          glosa,
          estado: 'CUADRADO',
        },
      });

      await Promise.all(
        detalles.map((detalle) => {
          return tx.detalleAsiento.create({
            data: {
              asientoId: asientoCreado.id,
              planContableId: detalle.planContableId,
              descripcion: detalle.descripcion,
              debe: new Decimal(detalle.debe),
              haber: new Decimal(detalle.haber),
            },
          });
        })
      );

      return asientoCreado;
    });

    // 4. Consultar el asiento completo con sus detalles
    const asientoCompleto = await prisma.asientoContable.findUnique({
      where: { id: nuevoAsiento.id },
      include: { detalles: true },
    });

    return NextResponse.json(asientoCompleto, { status: 201 });

  } catch (error) {
    console.error('Error al crear el asiento:', error);

    // Usamos tipo seguro de Prisma para manejar errores conocidos
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { message: 'Una de las cuentas contables proporcionadas no existe.' },
          { status: 400 }
        );
      }
    }

    // Otros errores inesperados
    return NextResponse.json(
      { message: 'Error inesperado al crear el asiento.' },
      { status: 500 }
    );
  }
}