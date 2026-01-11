'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FeatureBadge } from './FeatureBadge';
import { StarIcon } from '@phosphor-icons/react';

type Props = {
  id: string;
  name: string;
  imageUrl: string;
  pricePerWeek?: number;
  isBarterAvailable: boolean;
  businessName: string;
};

export function AdspaceCard({
  id,
  name,
  imageUrl,
  pricePerWeek,
  isBarterAvailable,
  businessName,
}: Props) {
  return (
    <Link
      href={`/offers/${id}`}
      className="flex gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50 items-center"
    >
      <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="font-medium leading-tight m-0 mb-1">{name}</h3>

        <p className="text-sm text-muted-foreground mb-2">2km stąd • {businessName}</p>

        <div className="flex justify-between flex-row w-full items-center mb-3">
          <div className="flex items-center gap-1">
            <StarIcon size={16} className="text-yellow-400" weight="fill" />
            <span className="font-medium">4.8</span>
            <span className="text-muted-foreground">(12 opinii)</span>
          </div>
          {pricePerWeek && <span className="shrink-0 font-medium">{pricePerWeek}zł / tyg</span>}
        </div>

        <div className="flex items-center gap-3">
          <FeatureBadge label="Barter" active={isBarterAvailable} />
          <FeatureBadge label="Sprzedaż" active={pricePerWeek !== undefined} />
        </div>
      </div>
    </Link>
  );
}
