interface CheckIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CheckIcon({
  size = 11,
  strokeWidth = 1.8,
  className,
}: CheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2.5 6L5 8.5L9.5 3.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}