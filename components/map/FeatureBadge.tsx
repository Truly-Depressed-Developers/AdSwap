import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { Badge } from '../ui/badge';

type FeatureBadgeProps = {
  label: string;
  active?: boolean;
};

export function FeatureBadge({ label, active = true }: FeatureBadgeProps) {
  return (
    <Badge variant={active ? 'active' : 'inactive'} className="h-7">
      <div>{active ? <CheckIcon size={20} /> : <XIcon size={20} />}</div>
      <span className="text-base font-normal">{label}</span>
    </Badge>
  );
}
