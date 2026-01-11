'use client';

import AdspaceForm from '@/components/AdspaceForm';
import { PageHeaderWithBack } from '@/components/FormHeader';

export default function CreateAdspace() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <PageHeaderWithBack title="Utwórz ofertę" />
      <div className="flex-1 overflow-y-auto p-4">
        <AdspaceForm />
      </div>
    </div>
  );
}
