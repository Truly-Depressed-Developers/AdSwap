'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { trpc } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { SwipeCard } from '@/components/match/SwipeCard';
import { SwipeControls } from '@/components/match/SwipeControls';
import { MatchDialog } from '@/components/match/MatchDialog';

export default function MatchPage() {
  const { status } = useSession();
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [matchInfo, setMatchInfo] = useState<{
    businessName: string;
    chatId: string;
  } | null>(null);

  const {
    data: currentCard,
    isLoading,
    isError,
    refetch,
  } = trpc.match.getNextCard.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  const swipeMutation = trpc.match.swipe.useMutation({
    onSuccess: (result) => {
      if (result.matched && result.chatId && result.matchedBusinessName) {
        setMatchInfo({
          businessName: result.matchedBusinessName,
          chatId: result.chatId,
        });
        setMatchDialogOpen(true);
      }
      // Fetch next card
      refetch();
    },
  });

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentCard) return;
    swipeMutation.mutate({
      targetBusinessId: currentCard.id,
      direction,
    });
  };

  const handleMatchDialogClose = () => {
    setMatchDialogOpen(false);
    setMatchInfo(null);
  };

  // Auth loading
  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ladowanie...</span>
      </div>
    );
  }

  // Not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium">Musisz byc zalogowany</p>
        <p className="text-sm text-muted-foreground">Zaloguj sie, aby przegladac dopasowania</p>
        <Link href="/auth/signin">
          <Button>Zaloguj sie</Button>
        </Link>
      </div>
    );
  }

  // Loading cards
  if (isLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ladowanie...</span>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium">Wystapil blad</p>
        <Button onClick={() => refetch()}>Sprobuj ponownie</Button>
      </div>
    );
  }

  // No more cards
  if (!currentCard) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-lg font-medium text-center">Brak nowych firm do przejrzenia</p>
        <p className="text-sm text-muted-foreground text-center">
          Wroc pozniej lub sprawdz swoje czaty
        </p>
        <Link href="/chats">
          <Button>Przejdz do czatow</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b p-4 text-center">
        <h1 className="text-lg font-semibold">Odkrywaj</h1>
      </header>

      {/* Card container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <SwipeCard business={currentCard} />
        <SwipeControls
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
          disabled={swipeMutation.isPending}
        />
      </main>

      {/* Match Dialog */}
      {matchInfo && (
        <MatchDialog
          open={matchDialogOpen}
          onClose={handleMatchDialogClose}
          matchedBusinessName={matchInfo.businessName}
          chatId={matchInfo.chatId}
        />
      )}
    </div>
  );
}
