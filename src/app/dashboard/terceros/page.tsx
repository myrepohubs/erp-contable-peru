// src/app/dashboard/terceros/page.tsx
import { Tercero } from '@prisma/client';
import { AddTerceroButton } from '@/components/terceros/AddTerceroButton';
import { TercerosTable } from '@/components/terceros/TercerosTable';

// Función para obtener los datos desde nuestra API
async function fetchTerceros(): Promise<Tercero[]> {
  const res = await fetch('http://localhost:3000/api/terceros', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch terceros');
  }
  return res.json();
}

export default async function TercerosPage() {
  const terceros = await fetchTerceros();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Terceros</h1>
        <AddTerceroButton />
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <TercerosTable terceros={terceros} />
      </div>
    </div>
  );
}