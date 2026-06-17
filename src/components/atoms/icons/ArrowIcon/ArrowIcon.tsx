import type { IconProps } from '../types';

export type ArrowDirection = 'up' | 'right' | 'down' | 'left';

type Props = IconProps & {
  direction: ArrowDirection;
};

const ROTATIONS: Record<ArrowDirection, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

export function ArrowIcon({ size = 16, class: className, direction }: Props) {
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
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
