'use client';

import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import type { FilterState } from '../../hooks/useAdspaceFilters';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClear: () => void;
  onClose: () => void;
};

export function FilterPanel({ filters, onFilterChange, onClear, onClose }: Props) {
  const { data: adspaceTypes } = trpc.adspace.types.useQuery();

  const content = (
    <>
      <div className="fixed inset-0 z-1001 bg-black/20" onClick={onClose} />
      <div className="fixed inset-0 z-1002 bg-background p-4 shadow-lg overflow-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Filtry</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Zamknij
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Typ powierzchni</label>
            <Select
              value={filters.typeId || 'all'}
              onValueChange={(value) => onFilterChange('typeId', value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wszystkie typy" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="all">Wszystkie typy</SelectItem>
                {adspaceTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Dostępność</label>
            <Select
              value={filters.availability}
              onValueChange={(value) =>
                onFilterChange('availability', value as FilterState['availability'])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wszystkie" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="available">Dostępne</SelectItem>
                <SelectItem value="in_use">Zajęte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" onClick={onClear} className="mt-4">
            Wyczyść filtry
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
