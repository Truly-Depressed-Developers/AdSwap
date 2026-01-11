'use client';

import { Button } from '@/components/ui/button';
import { X, Heart } from '@phosphor-icons/react';

type SwipeControlsProps = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  disabled?: boolean;
};

export function SwipeControls({ onSwipeLeft, onSwipeRight, disabled }: SwipeControlsProps) {
  return (
    <div className="flex justify-center gap-8 py-6">
      <Button
        variant="outline"
        className="h-16 w-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={onSwipeLeft}
        disabled={disabled}
      >
        <X size={32} weight="bold" />
      </Button>

      <Button
        variant="outline"
        className="h-16 w-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        onClick={onSwipeRight}
        disabled={disabled}
      >
        <Heart size={32} weight="fill" />
      </Button>
    </div>
  );
}
