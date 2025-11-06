// src/app/api/terceros/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma, TipoTercero } from '@prisma/client';

// GET: Obtener todos los terceros
export async function GET() {
  try {
    const terceros = await prisma.tercero.findMany();
    return NextResponse.json(terceros);
  } catch { // <-- SOLUCIÓN APLICADA: Bloque catch sin variable.
    // Es buena práctica devolver un error genérico en el catch del GET
    return NextResponse.json(
      { message: 'Ocurrió un error al obtener los terceros' },
      { status: 500 }
    );
  }
}

// POST: Crear un nuevo tercero
export async function POST(request: Request) {
  try {
    const { ruc, razonSocial, direccion, tipo } = await request.json();

    // Validación de campos requeridos
    if (!ruc || !razonSocial || !tipo) {
      return NextResponse.json(
        { message: 'RUC, Razón Social y Tipo son requeridos' },
        { status: 400 }
      );
    }

    // Validación del tipo de tercero (enum)
    if (!Object.values(TipoTercero).includes(tipo)) {
      return NextResponse.json(
        { message: 'El valor para "tipo" no es válido' },
        { status: 400 }
      );
    }
    
    const nuevoTercero = await prisma.tercero.create({
      data: {
        ruc,
        razonSocial,
        direccion,
        tipo,
      },
    });

    return NextResponse.json(nuevoTercero, { status: 201 });

  } catch (error) {
    // Manejo de errores de Prisma de forma segura y tipada
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Código 'P2002' es para violación de restricción de unicidad
      if (error.code === 'P2002') {
        
        // Mensaje de error más específico usando la metadata del error
        const fields = (error.meta?.target as string[])?.join(', ');
        const message = `Error de unicidad: Ya existe un registro con este valor en el/los campo(s): ${fields}`;

        return NextResponse.json({ message }, { status: 409 });
      }
    }
    
    // Catch-all para cualquier otro error inesperado
    return NextResponse.json(
      { message: 'Ocurrió un error inesperado en el servidor' }, 
      { status: 500 }
    );
  }
}