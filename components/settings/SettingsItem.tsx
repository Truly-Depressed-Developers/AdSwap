'use client';

import Link from 'next/link';
import { CaretRightIcon, Icon } from '@phosphor-icons/react';

type Props = {
  icon: Icon;
  label: string;
  href: string;
};

export const SettingsItem = ({ icon: Icon, label, href }: Props) => {
  return (
    <Link
      href={href}
      prefetch={true}
      className="flex w-full items-center justify-between py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5D1] text-[#7A9E45]">
          <Icon size={28} />
        </div>
        <span className="text-base font-medium">{label}</span>
      </div>
      <CaretRightIcon size={28} weight="regular" className="text-[#A3A3A3]" />
    </Link>
  );
};
