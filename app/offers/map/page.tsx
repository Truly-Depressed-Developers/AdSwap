import { Suspense } from 'react';
import { AdspaceMap } from '@/components/map/AdspaceMap';

function MapLoading() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-muted">
      <span className="text-muted-foreground">Ładowanie mapy...</span>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<MapLoading />}>
      <AdspaceMap />
    </Suspense>
  );
}
