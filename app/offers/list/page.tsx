import { Suspense } from 'react';
import { AdspaceList } from '@/components/map/AdspaceList';

function ListLoading() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background">
      <span className="text-muted-foreground">Ładowanie...</span>
    </div>
  );
}

export default function ListPage() {
  return (
    <Suspense fallback={<ListLoading />}>
      <AdspaceList />
    </Suspense>
  );
}
