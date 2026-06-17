import type { IconProps } from '../types';

export type ChevronDirection = 'down';

type Props = IconProps & {
  direction: ChevronDirection;
};

const ROTATIONS: Record<ChevronDirection, number> = {
  down: 0,
};

export function ChevronIcon({ size = 15, class: className, direction }: Props) {
  const rotation = ROTATIONS[direction];
  const style = rotation === 0 ? undefined : { transform: `rotate(${rotation}deg)` };
  return (
    <svg
      class={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}
