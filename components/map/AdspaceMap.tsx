'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAdspaceFilters } from '../../hooks/useAdspaceFilters';
import { filterAdspaces } from '@/lib/filterAdspaces';
import { trpc } from '@/trpc/client';
import { SearchBar } from './SearchBar';
import { ViewToggle } from './ViewToggle';
import { ImageSquareIcon } from '@phosphor-icons/react';
import { PageHeader } from '@/components/PageHeader';

// Fix for default marker icons in Leaflet with webpack/next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Krakow center coordinates
const KRAKOW_CENTER: [number, number] = [50.0647, 19.945];
const DEFAULT_ZOOM = 13;

export function AdspaceMap() {
  const { filters, updateFilter, clearFilters, activeFiltersCount } = useAdspaceFilters();
  const [mounted, setMounted] = useState(false);
  const { data: adspaces, isLoading } = trpc.adspace.list.useQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredAdspaces = useMemo(
    () => filterAdspaces(adspaces ?? [], filters),
    [adspaces, filters],
  );

  if (!mounted || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <span className="text-muted-foreground">Ładowanie mapy...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <PageHeader title="Oferty" />

      <div className="relative flex-1">
        <MapContainer
          center={KRAKOW_CENTER}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full"
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredAdspaces.map((adspace) => (
            <Marker
              key={adspace.id}
              position={[adspace.business.coords.latitude, adspace.business.coords.longitude]}
            >
              <Popup className="adspace-popup" minWidth={240} maxWidth={320}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-22 w-22 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {adspace.business.imageUrl ? (
                        <Image
                          src={adspace.business.imageUrl}
                          alt={adspace.business.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center text-gray-400 bg-black">
                          <ImageSquareIcon size={64} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black opacity-50 z-1000"></div>
                      <div className="absolute text-4xl top-1/2 left-1/2 -translate-1/2 text-foreground z-1001">
                        4+
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm leading-tight">
                        {adspace.business.name}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1 mb-2">
                        2km stąd • {adspace.business.address.split(',')[0]}
                      </span>
                      <Link href={`/offers/${adspace.id}`} className="w-full">
                        <Button className="w-full bg-chart-4 text-foreground" size="sm">
                          Zobacz oferty
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute left-4 right-4 top-4 z-1000 flex items-center flex-col gap-3">
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
    </div>
  );
}
