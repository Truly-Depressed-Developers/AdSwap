'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeatureBadge } from '@/components/map/FeatureBadge';
import { CheckIcon, MapPinIcon, TagIcon, XIcon } from '@phosphor-icons/react';
import { SwipeCardBusinessDTO } from '@/types/dtos/match';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';

type SwipeCardProps = {
  business: SwipeCardBusinessDTO;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
};

export function SwipeCard({ business, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const featuredAdspace = business.adspaces[0];
  const [exitX, setExitX] = useState(0);
  const [swiped, setSwiped] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const leftIndicatorOpacity = useTransform(x, [-200, -50, 0], [0.7, 1, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 50, 200], [0, 1, 0.7]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      setSwiped(true);
      const direction = info.offset.x > 0 ? 300 : -300;
      setExitX(direction);
      
      setTimeout(() => {
        if (direction > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }, 400);
    }
  };

  return (
    <>
      <motion.div
        style={{ opacity: rightIndicatorOpacity }}
        className="absolute inset-0 flex items-center justify-start pointer-events-none"
      >
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 0% 50%, rgba(34, 197, 94, 0.5) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)'
          }}
        >
          <div className="text-green-500 text-8xl font-bold ml-16"><CheckIcon /></div>
        </div>
      </motion.div>
      
      <motion.div
        style={{ opacity: leftIndicatorOpacity }}
        className="absolute inset-0 flex items-center justify-end pointer-events-none"
      >
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 100% 50%, rgba(239, 68, 68, 0.5) 0%, rgba(239, 68, 68, 0.2) 40%, transparent 70%)'
          }}
        >
          <div className="text-red-500 text-8xl font-bold mr-16"><XIcon /></div>
        </div>
      </motion.div>

      <motion.div
        style={{ x, rotate, opacity }}
        drag={swiped ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{ x: exitX }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full cursor-grab active:cursor-grabbing"
      >
        <div className='px-4'>
          <Card className="w-full h-150 max-w-sm mx-auto overflow-hidden shadow-xl py-0">
            <div className="relative h-64 w-full bg-muted">
              <Image
                src={featuredAdspace?.imageUrl || business.imageUrl || 'https://placehold.co/400x300'}
                alt={business.name}
                fill
                className="object-cover"
              />
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
              <h2 className="text-lg font-medium">{business.name}</h2>

              <div className="flex items-center gap-2 text-base text-muted-foreground">
                <MapPinIcon size={16} />
                <span>{business.address}</span>
              </div>

              <p className="text-base leading-relaxed line-clamp-2">{business.description}</p>

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

              {featuredAdspace && (
                <div className="border-t pt-3 mt-3">
                  <h3 className="text-base font-medium mb-2">Dostępna przestrzeń:</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{featuredAdspace.name}</span>
                    <div className="flex gap-1">
                      <FeatureBadge label="Barter" active={featuredAdspace.isBarterAvailable} />
                      <FeatureBadge label="Sprzedaż" active={featuredAdspace.pricePerWeek !== null} />
                    </div>
                  </div>
                  <div className="text-base text-muted-foreground">
                    {featuredAdspace.maxWidth} x {featuredAdspace.maxHeight} cm
                    {featuredAdspace.pricePerWeek && (
                      <span className="ml-2 font-medium text-foreground">
                        {featuredAdspace.pricePerWeek}zł / tyg
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
}
