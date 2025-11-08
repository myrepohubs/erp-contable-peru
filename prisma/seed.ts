// prisma/seed.ts
import { PrismaClient, TipoCuentaContable } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el seeding de la base de datos...');

  // Limpiar datos existentes para evitar duplicados en re-ejecuciones
  await prisma.planContable.deleteMany({});
  
  console.log('Creando cuentas contables iniciales...');

  const cuentas = [
    // Activos
    { codigo: '10', descripcion: 'EFECTIVO Y EQUIVALENTES DE EFECTIVO', tipo: TipoCuentaContable.ACTIVO },
    { codigo: '12', descripcion: 'CUENTAS POR COBRAR COMERCIALES – TERCEROS', tipo: TipoCuentaContable.ACTIVO },
    { codigo: '20', descripcion: 'MERCADERÍAS', tipo: TipoCuentaContable.ACTIVO },
    
    // Pasivos
    { codigo: '40', descripcion: 'TRIBUTOS, CONTRAPRESTACIONES Y APORTES AL SISTEMA DE PENSIONES Y DE SALUD POR PAGAR', tipo: TipoCuentaContable.PASIVO },
    { codigo: '42', descripcion: 'CUENTAS POR PAGAR COMERCIALES – TERCEROS', tipo: TipoCuentaContable.PASIVO },
    
    // Patrimonio
    { codigo: '50', descripcion: 'CAPITAL', tipo: TipoCuentaContable.PATRIMONIO },
    
    // Gastos
    { codigo: '60', descripcion: 'COMPRAS', tipo: TipoCuentaContable.GASTO },
    { codigo: '63', descripcion: 'GASTOS DE SERVICIOS PRESTADOS POR TERCEROS', tipo: TipoCuentaContable.GASTO },

    // Ingresos
    { codigo: '70', descripcion: 'VENTAS', tipo: TipoCuentaContable.INGRESO },
  ];
  
  await prisma.planContable.createMany({
    data: cuentas,
  });

  console.log('Cuentas contables creadas exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding finalizado.');
  });