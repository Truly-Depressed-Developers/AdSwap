import { CheckIcon, XIcon } from '@phosphor-icons/react';

type FeatureBadgeProps = {
  label: string;
  active?: boolean;
};

export function FeatureBadge({ label, active = true }: FeatureBadgeProps) {
  return (
    <div
      className={`flex items-center gap-1 text-sm ${
        active ? 'text-green-600' : 'text-muted-foreground'
      }`}
    >
      {active ? <CheckIcon size={16} /> : <XIcon size={16} />}
      <span>{label}</span>
    </div>
  );
}
