'use client';

import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import type { FilterState } from '../../hooks/useAdspaceFilters';

type FilterPanelProps = {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClear: () => void;
  onClose: () => void;
};

export function FilterPanel({ filters, onFilterChange, onClear, onClose }: FilterPanelProps) {
  const { data: adspaceTypes } = trpc.adspace.types.useQuery();

  const content = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-1001 bg-black/20" onClick={onClose} />
      {/* Panel */}
      <div className="fixed inset-0 z-1002 bg-background p-4 shadow-lg overflow-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Filtry</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Zamknij
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Typ powierzchni</label>
            <select
              className="rounded-md border bg-background px-3 py-2 text-sm"
              value={filters.typeId || ''}
              onChange={(e) => onFilterChange('typeId', e.target.value || null)}
            >
              <option value="">Wszystkie typy</option>
              {adspaceTypes?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Dostępność</label>
            <select
              className="rounded-md border bg-background px-3 py-2 text-sm"
              value={filters.availability}
              onChange={(e) =>
                onFilterChange('availability', e.target.value as FilterState['availability'])
              }
            >
              <option value="all">Wszystkie</option>
              <option value="available">Dostępne</option>
              <option value="in_use">Zajęte</option>
            </select>
          </div>

          <Button variant="outline" size="sm" onClick={onClear}>
            Wyczyść filtry
          </Button>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
