import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { Badge } from '../ui/badge';

type FeatureBadgeProps = {
  label: string;
  active?: boolean;
};

export function FeatureBadge({ label, active = true }: FeatureBadgeProps) {
  return (
    <Badge variant={active ? 'active' : 'inactive'}>
      {active ? <CheckIcon size={16} /> : <XIcon size={16} />}
      <span>{label}</span>
    </Badge>
  );
}
