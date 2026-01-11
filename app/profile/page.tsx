'use client';

import { trpc } from '@/trpc/client';
import { SettingsItem } from '@/components/settings/SettingsItem';
import {
  BuildingsIcon,
  CurrencyDollarSimpleIcon,
  GearIcon,
  StarIcon,
  SunIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { PageHeader } from '@/components/PageHeader';

export default function ProfilePage() {
  const { data: business } = trpc.business.mine.useQuery();
  const { data: session } = useSession();

  const settingsOptions = [
    {
      label: 'Twój biznes',
      icon: BuildingsIcon,
      href: business ? '/profile/business' : 'profile/create-business',
    },
    {
      label: 'Reputacja',
      icon: StarIcon,
      href: '/profile/reputation',
    },
    {
      label: 'Twój plan',
      icon: CurrencyDollarSimpleIcon,
      href: '/profile/plan',
    },
    {
      label: 'Motyw aplikacji',
      icon: SunIcon,
      href: '/profile/theme',
    },
    {
      label: 'Ustawienia konta',
      icon: GearIcon,
      href: '/profile/settings',
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col bg-background p-4 pt-0">
      <PageHeader title="Mój Profil" />
      
      <main className="flex-1 overflow-y-auto flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {settingsOptions.map((option, index) => (
            <SettingsItem key={index} icon={option.icon} label={option.label} href={option.href} />
          ))}
        </div>

        {session && (
          <div className="flex items-center gap-2 justify-center flex-col">
            Zalogowany użytkownik:
            <span className="text-sm text-muted-foreground">
              {session.user.firstName} {session.user.lastName}
            </span>
            <Button variant="destructive" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
              Logout
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
