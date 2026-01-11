'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ViewToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const query = queryString ? `?${queryString}` : '';

  const [currentTab, changeCurrentTab] = useState(pathname.split('/').reverse()[0]);

  const router = useRouter();

  return (
    <Tabs
      className="w-full h-12"
      value={currentTab}
      onValueChange={(value) => {
        changeCurrentTab(value);
        router.push(`/offers/${value}/${query}`);
      }}
    >
      <TabsList className="w-full flex h-12!">
        <TabsTrigger value="list" className='rounded-4xl'>Lista</TabsTrigger>
        <TabsTrigger value="map" className='rounded-4xl'>Mapa</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
