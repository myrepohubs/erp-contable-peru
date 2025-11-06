// src/components/terceros/TercerosTable.tsx
import { Tercero } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TercerosTableProps {
  terceros: Tercero[];
}

export function TercerosTable({ terceros }: TercerosTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>RUC</TableHead>
          <TableHead>Razón Social</TableHead>
          <TableHead>Tipo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {terceros.map((tercero) => (
          <TableRow key={tercero.id}>
            <TableCell>{tercero.ruc}</TableCell>
            <TableCell>{tercero.razonSocial}</TableCell>
            <TableCell>{tercero.tipo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}