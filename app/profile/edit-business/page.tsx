'use client';

import BusinessForm from '@/components/BusinessForm';
import { PageHeaderWithBack } from '@/components/FormHeader';
import { trpc } from '@/trpc/client';

export default function EditBusinessPage() {
  const { data: business, isLoading, isError } = trpc.business.mine.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <span className="text-muted-foreground">Ładowanie danych...</span>
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-background">
        <p className="text-lg font-medium">Błąd podczas ładowania danych</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <PageHeaderWithBack title="Edytuj biznes" />
      <div className="flex-1 overflow-y-auto p-4">
        <BusinessForm initialData={business} />
      </div>
    </div>
  );
}
