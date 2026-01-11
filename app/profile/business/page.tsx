'use client';

import { BusinessProfileView } from '@/components/business/BusinessProfileView';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyBusinessPage() {
  const router = useRouter();
  const { data: business, isLoading, isError } = trpc.business.mine.useQuery();

  useEffect(() => {
    if (!isLoading && !business && !isError) {
      router.replace('/profile/create-business');
    }
  }, [business, isLoading, isError, router]);

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
        <p className="text-lg font-medium">Wystąpił błąd</p>
        <button onClick={() => router.back()} className="text-primary hover:underline">
          Wróć
        </button>
      </div>
    );
  }

  return <BusinessProfileView business={business} isOwner={true} />;
}
