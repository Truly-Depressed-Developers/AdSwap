'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeatureBadge } from '@/components/map/FeatureBadge';
import { MapPinIcon, TagIcon } from '@phosphor-icons/react';

type SwipeCardBusiness = {
  id: string;
  name: string;
  description: string;
  address: string;
  imageUrl: string | null;
  logoUrl: string | null;
  tags: { id: string; name: string }[];
  adspaces: {
    id: string;
    name: string;
    imageUrl: string;
    maxWidth: number;
    maxHeight: number;
    isBarterAvailable: boolean;
    pricePerWeek: number | null;
  }[];
};

type SwipeCardProps = {
  business: SwipeCardBusiness;
};

export function SwipeCard({ business }: SwipeCardProps) {
  const featuredAdspace = business.adspaces[0];

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden">
      {/* Business/Adspace Image */}
      <div className="relative h-64 w-full bg-muted">
        <Image
          src={featuredAdspace?.imageUrl || business.imageUrl || 'https://placehold.co/400x300'}
          alt={business.name}
          fill
          className="object-cover"
        />
        {/* Business logo overlay */}
        {business.logoUrl && (
          <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full border-2 border-white overflow-hidden bg-white">
            <Image
              src={business.logoUrl}
              alt={`${business.name} logo`}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Business name */}
        <h2 className="text-xl font-bold">{business.name}</h2>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon size={16} />
          <span>{business.address}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>

        {/* Tags */}
        {business.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {business.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="gap-1">
                <TagIcon size={12} />
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Featured Adspace Section */}
        {featuredAdspace && (
          <div className="border-t pt-3 mt-3">
            <h3 className="text-sm font-semibold mb-2">Dostepna przestrzen:</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">{featuredAdspace.name}</span>
              <div className="flex gap-1">
                <FeatureBadge label="Barter" active={featuredAdspace.isBarterAvailable} />
                <FeatureBadge label="Sprzedaz" active={featuredAdspace.pricePerWeek !== null} />
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {featuredAdspace.maxWidth} x {featuredAdspace.maxHeight} cm
              {featuredAdspace.pricePerWeek && (
                <span className="ml-2 font-medium text-foreground">
                  {featuredAdspace.pricePerWeek}zl/tyg
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
