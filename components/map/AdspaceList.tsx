'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAdspaceFilters } from '../../hooks/useAdspaceFilters';
import { filterAdspaces } from '@/lib/filterAdspaces';
import { trpc } from '@/trpc/client';
import { SearchBar } from './SearchBar';
import { ViewToggle } from './ViewToggle';
import { FeatureBadge } from './FeatureBadge';
import { StarIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';

export function AdspaceList() {
  const { filters, updateFilter, clearFilters, activeFiltersCount } = useAdspaceFilters();
  const { data: adspaces, isLoading } = trpc.adspace.list.useQuery();

  const filteredAdspaces = useMemo(
    () => filterAdspaces(adspaces ?? [], filters),
    [adspaces, filters]
  );

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ładowanie...</span>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-background">
      {/* Fixed header with search */}
      <div className="shrink-0 border-b bg-background px-4 py-4">
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

      {/* Scrollable items */}
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
              <Link
                key={adspace.id}
                href={`/oferty/${adspace.id}`}
                className="flex gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50 items-center"
              >
                {/* Image */}
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={adspace.imageUrl} alt={adspace.name} fill className="object-cover" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col">
                  {/* Header with title and price */}
                  <h3 className="font-semibold leading-tight m-0 mb-1">{adspace.name}</h3>

                  {/* Subtitle */}
                  <p className="text-sm text-muted-foreground mb-2">
                    2km stąd • {adspace.business.name}
                  </p>

                  {/* Rating */}
                  <div className="flex justify-between flex-row w-full items-center mb-3">
                    <div className="flex items-center gap-1">
                      <StarIcon size={16} className="text-yellow-400" weight="fill" />
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-sm text-muted-foreground">(12 opinii)</span>
                    </div>
                    {adspace.pricePerWeek && (
                      <span className="shrink-0 text-sm font-semibold">
                        {adspace.pricePerWeek * 7}zł / tyg
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-3">
                    <FeatureBadge label="Barter" active={adspace.isBarterAvailable} />
                    <FeatureBadge label="Sprzedaż" active={adspace.pricePerWeek !== undefined} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
