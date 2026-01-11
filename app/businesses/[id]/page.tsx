'use client';

import { BusinessProfileView } from '@/components/business/BusinessProfileView';
import { trpc } from '@/trpc/client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BusinessPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: business, isLoading, isError } = trpc.business.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ładowanie profilu...</span>
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium">Nie znaleziono biznesu</p>
        <p className="text-sm text-muted-foreground">
          Profil mógł zostać usunięty lub nie istnieje
        </p>
        <Button onClick={() => router.back()}>Wróć</Button>
      </div>
    );
  }

  return <BusinessProfileView business={business} isOwner={false} />;
}
