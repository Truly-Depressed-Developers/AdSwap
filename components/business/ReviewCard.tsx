'use client';

import { StarIcon } from '@phosphor-icons/react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RatingDTO } from '@/types/dtos/rating';

type Props = {
  rating: RatingDTO;
};

export function ReviewCard({ rating }: Props) {
  const timeAgo = formatDistanceToNow(new Date(rating.createdAt), {
    addSuffix: true,
    locale: pl,
  })
    .replace('temu', '')
    .trim();

  const shortTimeAgo = timeAgo
    .replace('około ', '')
    .replace('ponad ', '')
    .replace('tydzień', 'tyg')
    .replace('tygodnie', 'tyg')
    .replace('tygodni', 'tyg')
    .replace('miesiąc', 'mies.')
    .replace('miesiące', 'mies.')
    .replace('miesięcy', 'mies.')
    .replace('rok', 'r.')
    .replace('lata', 'l.')
    .replace('lat', 'l.')
    .replace('godziny', 'h')
    .replace('godzinę', 'h')
    .replace('godzin', 'h')
    .replace('minuty', 'min')
    .replace('minutę', 'min')
    .replace('minut', 'min');

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="size-12 border shrink-0">
        <AvatarImage
          // src={rating.user.avatarUrl}
          alt={`${rating.user.firstName} ${rating.user.lastName}`}
        />
        <AvatarFallback>
          {rating.user.firstName.charAt(0)}
          {rating.user.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-base leading-none">
            {rating.user.firstName} {rating.user.lastName}
          </h3>
          <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">
            {shortTimeAgo}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              size={14}
              weight="fill"
              className={i < rating.score ? 'text-yellow-400' : 'text-gray-200'}
            />
          ))}
        </div>

        {rating.comment && (
          <p className="text-sm text-muted-foreground leading-relaxed">{rating.comment}</p>
        )}
      </div>
    </div>
  );
}
