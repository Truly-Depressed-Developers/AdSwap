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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {active ? (
          <polyline points="20 6 9 17 4 12" />
        ) : (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        )}
      </svg>
      <span>{label}</span>
    </div>
  );
}
