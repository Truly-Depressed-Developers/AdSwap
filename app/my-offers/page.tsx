'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useAdspaceFilters } from '@/hooks/useAdspaceFilters';
import { filterAdspaces } from '@/lib/filterAdspaces';
import { trpc } from '@/trpc/client';
import { SearchBar } from '@/components/map/SearchBar';
import { AdspaceCard } from '@/components/map/AdspaceCard';
import { PlusIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/PageHeader';

export default function MyOffers() {
  const { data: session, status } = useSession();
  const { filters, updateFilter, clearFilters, activeFiltersCount } = useAdspaceFilters();
  const { data: adspaces, isLoading: adspacesLoading } = trpc.adspace.myList.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  const filteredAdspaces = useMemo(
    () => filterAdspaces(adspaces ?? [], filters),
    [adspaces, filters],
  );

  if (status === 'loading') {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ładowanie...</span>
      </div>
    );
  }

  // Not logged in
  if (status === 'unauthenticated') {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium">Musisz być zalogowany</p>
        <p className="text-sm text-muted-foreground">Zaloguj się, aby zobaczyć swoje ogłoszenia</p>
        <Link href="/auth/signin">
          <Button>Zaloguj się</Button>
        </Link>
      </div>
    );
  }

  // Loading adspaces
  if (adspacesLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ładowanie ogłoszeń...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="sticky top-0 z-10 shrink-0 border-b bg-background p-4 pt-0">
        <PageHeader title="Moje ogłoszenia" hideLine={true} />
        <SearchBar
          filters={filters}
          onFilterChange={updateFilter}
          onClear={clearFilters}
          activeFiltersCount={activeFiltersCount}
          className="h-12"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 p-4">
          {filteredAdspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {adspaces?.length === 0 ? (
                <>
                  <p className="text-lg font-medium">Nie masz jeszcze ogłoszeń</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dodaj swoje pierwsze ogłoszenie
                  </p>
                  <Link href="/my-offers/create-offer">
                    <Button className="mt-4">Dodaj ogłoszenie</Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">Brak wyników</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Spróbuj zmienić filtry wyszukiwania
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                    Wyczyść filtry
                  </Button>
                </>
              )}
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

      <Link href="/my-offers/create-offer" className="absolute bottom-5 right-5 z-50">
        <Button size="icon-lg" className="h-14 w-14 rounded-full shadow-lg">
          <PlusIcon size={32} className="size-7" />
        </Button>
      </Link>
    </div>
  );
}
