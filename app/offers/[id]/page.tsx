'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { FeatureBadge } from '@/components/map/FeatureBadge';
import { ArrowLeftIcon, StarIcon, GlobeIcon } from '@phosphor-icons/react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useNavbar } from '@/hooks/useNavbar';

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

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [mounted, setMounted] = useState(false);

  const { setIsVisible } = useNavbar();
  useEffect(() => {
    setIsVisible(false);
    return () => setIsVisible(true);
  }, [setIsVisible]);

  const { data: adspace, isLoading, isError } = trpc.adspace.getById.useQuery({ id });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ładowanie...</span>
      </div>
    );
  }

  if (isError || !adspace) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium">Nie znaleziono oferty</p>
        <p className="text-sm text-muted-foreground">
          Oferta mogła zostać usunięta lub nie istnieje
        </p>
        <Button onClick={() => router.back()}>Wróć</Button>
      </div>
    );
  }

  const coords = adspace.business.coords;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <div className="sticky top-0 z-20 flex items-center p-4 bg-transparent pointer-events-none">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md pointer-events-auto"
        >
          <ArrowLeftIcon size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto -mt-[78px]">
        <div className="relative h-48 w-full bg-muted">
          <Image src={adspace.imageUrl} alt={adspace.name} fill className="object-cover" />
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-lg font-medium mb-1">{adspace.name}</h1>
            <p className="text-base text-muted-foreground">
              2km stąd • {adspace.business.address.split(',')[0]}
            </p>
          </div>

          {adspace.description && (
            <p className="text-base leading-relaxed">{adspace.description}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <FeatureBadge label="Barter" active={adspace.isBarterAvailable} />
              <FeatureBadge label="Sprzedaż" active={adspace.pricePerWeek !== undefined} />
            </div>
            {adspace.pricePerWeek && (
              <span className="font-medium">{adspace.pricePerWeek}zł / tyg</span>
            )}
          </div>

          <div className="space-y-3 py-2">
            {adspace.business.website && (
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">Strona internetowa:</span>
                <div className="flex items-center gap-2">
                  <GlobeIcon size={20} />
                  <a
                    href={
                      adspace.business.website.startsWith('http')
                        ? adspace.business.website
                        : `https://${adspace.business.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base underline hover:text-primary"
                  >
                    {adspace.business.website}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-base  font-medium">Typ reklamy:</span>
              <span className="text-base">{adspace.type.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base  font-medium">Wymiary:</span>
              <span className="text-base">
                {adspace.maxWidth} x {adspace.maxHeight} cm
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base font-medium">Grupa docelowa:</span>
              <span className="text-base">{adspace.business.targetAudience}</span>
            </div>
          </div>

          <Link
            href={`/businesses/${adspace.business.id}`}
            className="flex items-center gap-3 py-2 hover:bg-muted/50 rounded-lg transition-colors -mx-2 px-2"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
              {adspace.business.imageUrl ? (
                <Image
                  src={adspace.business.imageUrl}
                  alt={adspace.business.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-yellow-400 text-white font-bold">
                  {adspace.business.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{adspace.business.name}</p>
              <div className="flex items-center gap-1">
                <StarIcon size={14} className="text-yellow-400" weight="fill" />
                <span className="text-base font-medium">4.8</span>
                <span className="text-base text-muted-foreground">(12 opinii)</span>
              </div>
            </div>
          </Link>

          {/* Map in bordered box */}
          {coords && (
            <div className="rounded-xl border overflow-hidden h-55">
              {mounted && (
                <MapContainer
                  center={[coords.latitude, coords.longitude]}
                  zoom={15}
                  className="h-full w-full"
                  scrollWheelZoom={false}
                  zoomControl={true}
                  dragging={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[coords.latitude, coords.longitude]} />
                </MapContainer>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 p-4 bg-background border-t z-1000">
        <Button className="w-full" size="lg">
          Napisz Wiadomość
        </Button>
      </div>
    </div>
  );
}
