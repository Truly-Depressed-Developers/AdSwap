'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapTrifoldIcon, NoteIcon, ChatCircleDotsIcon, UserIcon } from '@phosphor-icons/react';
import { useNavbar } from '@/hooks/useNavbar';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    href: '/offers/list',
    label: 'Oferty',
    icon: <MapTrifoldIcon size={24} />,
  },
  {
    href: '/my-offers',
    label: 'Moje oferty',
    icon: <NoteIcon size={24} />,
  },
  {
    href: '/chats',
    label: 'Chaty',
    icon: <ChatCircleDotsIcon size={24} />,
  },
  {
    href: '/profile',
    label: 'Profil',
    icon: <UserIcon size={24} />,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { isVisible } = useNavbar();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 px-4 py-3 transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
