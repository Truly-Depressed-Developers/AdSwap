'use client';

import { useParams } from 'next/navigation';
import AdspaceForm from '@/components/AdspaceForm';

export default function EditAdspace() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-4">
      <AdspaceForm adspaceId={id} />
    </div>
  );
}
