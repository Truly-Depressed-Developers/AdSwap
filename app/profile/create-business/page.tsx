'use client';

import BusinessForm from '@/components/BusinessForm';
import { PageHeaderWithBack } from '@/components/FormHeader';

export default function CreateBusinessPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <PageHeaderWithBack title="Utwórz biznes" />
      <div className="flex-1 overflow-y-auto p-4">
        <BusinessForm />
      </div>
    </div>
  );
}
