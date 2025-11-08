// src/components/asientos/ComboboxContable.tsx
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PlanContable } from '@prisma/client';

// CORRECCIÓN IMPORTANTE: Definir el tipo de las props
interface ComboboxContableProps {
  onSelect: (cuenta: PlanContable) => void;
}

export function ComboboxContable({ onSelect }: ComboboxContableProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [cuentas, setCuentas] = React.useState<PlanContable[]>([]);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        const res = await fetch(`/api/plan-contable?q=${searchTerm}`);
        const data = await res.json();
        setCuentas(data);
      } else {
        setCuentas([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? value
            : 'Selecciona cuenta...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar por código o descripción..."
            onValueChange={(search) => setSearchTerm(search)}
          />
          <CommandEmpty>No se encontró la cuenta.</CommandEmpty>
          <CommandGroup>
            {cuentas.map((cuenta) => (
              <CommandItem
                key={cuenta.id}
                value={`${cuenta.codigo} - ${cuenta.descripcion}`}
                onSelect={() => { // Usamos una función anónima aquí para más claridad
                  setValue(cuenta.codigo);
                  onSelect(cuenta); // Informa al componente padre sobre la selección
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === cuenta.codigo ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {cuenta.codigo} - {cuenta.descripcion}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}