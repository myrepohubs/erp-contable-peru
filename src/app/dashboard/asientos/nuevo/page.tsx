// src/app/dashboard/asientos/nuevo/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner'; // ¡Importación actualizada!
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { ComboboxContable } from '@/components/asientos/ComboboxContable';
import { PlanContable } from '@prisma/client';

interface DetalleState {
  id: string;
  planContableId: string;
  descripcion: string;
  debe: string;
  haber: string;
}

export default function NuevoAsientoPage() {
  const router = useRouter();
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [glosa, setGlosa] = useState('');
  const [detalles, setDetalles] = useState<DetalleState[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addDetalle = () => {
    setDetalles([
      ...detalles,
      {
        id: uuidv4(),
        planContableId: '',
        descripcion: '',
        debe: '0.00',
        haber: '0.00',
      },
    ]);
  };

  const removeDetalle = (id: string) => {
    setDetalles(detalles.filter((d) => d.id !== id));
  };

  const handleDetalleChange = (
    id: string,
    field: keyof DetalleState,
    value: string
  ) => {
    setDetalles(
      detalles.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };
  
  const handleCuentaSelect = (id: string, cuenta: PlanContable) => {
    setDetalles(
      detalles.map((d) =>
        d.id === id
          ? { ...d, planContableId: cuenta.id, descripcion: cuenta.descripcion }
          : d
      )
    );
  };

  const { totalDebe, totalHaber } = useMemo(() => {
    return detalles.reduce(
      (acc, detalle) => {
        acc.totalDebe += parseFloat(detalle.debe) || 0;
        acc.totalHaber += parseFloat(detalle.haber) || 0;
        return acc;
      },
      { totalDebe: 0, totalHaber: 0 }
    );
  }, [detalles]);

  const isCuadrado =
    Math.abs(totalDebe - totalHaber) < 0.01 && totalDebe > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCuadrado) {
      toast.error('Error de validación', {
        description: 'El asiento no está cuadrado o el total es cero.',
      });
      return;
    }
    setIsLoading(true);

    const payload = {
      fecha,
      glosa,
      detalles: detalles.map((d) => ({
        planContableId: d.planContableId,
        descripcion: d.descripcion,
        debe: parseFloat(d.debe),
        haber: parseFloat(d.haber),
      })),
    };

    try {
      const response = await fetch('/api/asientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el asiento');
      }

      toast.success('Éxito', {
        description: 'El asiento contable ha sido creado exitosamente.',
      });
      router.push('/dashboard/asientos');

    } catch (error) { // <-- LA CORRECCIÓN ESTÁ AQUÍ
      if (error instanceof Error) {
        toast.error('Error', {
          description: error.message,
        });
      } else {
        toast.error('Error', {
          description: 'Ocurrió un error desconocido.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nuevo Asiento Contable</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cabecera */}
        <div className="p-4 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="glosa">Glosa (Descripción)</Label>
            <Input
              id="glosa"
              type="text"
              value={glosa}
              onChange={(e) => setGlosa(e.target.value)}
              placeholder="Ej: Por la venta de mercadería según F001-123"
              required
            />
          </div>
        </div>

        {/* Detalles */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Detalles del Asiento</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cuenta</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Debe</TableHead>
                <TableHead className="text-right">Haber</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalles.map((detalle) => (
                <TableRow key={detalle.id}>f
                  <TableCell>
                    <ComboboxContable
                      onSelect={(cuenta) => handleCuentaSelect(detalle.id, cuenta)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={detalle.descripcion}
                      onChange={(e) =>
                        handleDetalleChange(detalle.id, 'descripcion', e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      className="text-right"
                      value={detalle.debe}
                      onChange={(e) =>
                        handleDetalleChange(detalle.id, 'debe', e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      className="text-right"
                      value={detalle.haber}
                      onChange={(e) =>
                        handleDetalleChange(detalle.id, 'haber', e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDetalle(detalle.id)}
                    >
                      Quitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Totales</TableCell>
                <TableCell className="text-right font-bold">
                  {totalDebe.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {totalHaber.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <Button type="button" variant="outline" onClick={addDetalle} className="mt-4">
            Añadir Fila
          </Button>
        </div>
        
        {/* Acciones Finales */}
        <div className="flex justify-end items-center space-x-4">
            {!isCuadrado && totalDebe > 0 && (
                <p className="text-red-500">El asiento no está cuadrado</p>
            )}
            <Button type="submit" disabled={!isCuadrado || isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Asiento'}
            </Button>
        </div>
      </form>
    </div>
  );
}