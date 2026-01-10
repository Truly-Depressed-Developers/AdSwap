'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAdspaceFilters } from './useAdspaceFilters';
import { mockAdspaces, filterAdspaces } from './mockData';
import { SearchBar } from './SearchBar';
import { ViewToggle } from './ViewToggle';
import { FeatureBadge } from './FeatureBadge';

export function AdspaceList() {
  const { filters, updateFilter, clearFilters, activeFiltersCount } = useAdspaceFilters();

  const filteredAdspaces = filterAdspaces(mockAdspaces, filters);

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
                  {adspace.imageUrl ? (
                    <Image
                      src={adspace.imageUrl}
                      alt={adspace.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                  )}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-yellow-400"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
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
