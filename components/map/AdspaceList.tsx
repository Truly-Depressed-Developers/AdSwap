'use client';

import { Button } from '@/components/ui/button';
import { useAdspaceFilters } from '../../hooks/useAdspaceFilters';
import { filterAdspaces } from '@/lib/filterAdspaces';
import { trpc } from '@/trpc/client';
import { SearchBar } from './SearchBar';
import { ViewToggle } from './ViewToggle';
import { AdspaceCard } from './AdspaceCard';
import { useMemo } from 'react';
import { PageHeader } from '@/components/PageHeader';

export function AdspaceList() {
  const { filters, updateFilter, clearFilters, activeFiltersCount } = useAdspaceFilters();
  const { data: adspaces, isLoading } = trpc.adspace.list.useQuery();

  const filteredAdspaces = useMemo(
    () => filterAdspaces(adspaces ?? [], filters),
    [adspaces, filters],
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ładowanie...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="sticky top-0 z-10 shrink-0 border-b bg-background p-4 pt-0">
        <PageHeader title="Oferty" hideLine={true} />
        <div className="flex items-center gap-3 flex-col">
          <SearchBar
            filters={filters}
            onFilterChange={updateFilter}
            onClear={clearFilters}
            activeFiltersCount={activeFiltersCount}
            className="flex-1"
          />
          <ViewToggle />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 p-4">
          {filteredAdspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">Brak wyników</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Spróbuj zmienić filtry wyszukiwania
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                Wyczyść filtry
              </Button>
            </div>
          ) : (
            filteredAdspaces.map((adspace) => (
              <AdspaceCard
                key={adspace.id}
                id={adspace.id}
                name={adspace.name}
                imageUrl={adspace.imageUrl}
                pricePerWeek={adspace.pricePerWeek}
                isBarterAvailable={adspace.isBarterAvailable}
                businessName={adspace.business.name}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
