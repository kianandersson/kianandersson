import type { IconProps } from './types';

export function XIcon({ size = 16, class: className, title }: IconProps) {
  return (
    <svg
      class={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {title ? <title>{title}</title> : null}
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
