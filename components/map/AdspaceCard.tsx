'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FeatureBadge } from './FeatureBadge';
import { StarIcon } from '@phosphor-icons/react';
import type { AdspacesWithBusinessDTO } from '@/types/dtos/adspace';

type AdspaceCardProps = {
  adspace: AdspacesWithBusinessDTO;
};

export function AdspaceCard({ adspace }: AdspaceCardProps) {
  return (
    <Link
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
              {adspace.pricePerWeek}zł / tyg
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
  );
}
