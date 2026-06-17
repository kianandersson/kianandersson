import type { IconProps } from './types';

export function ArrowLeftIcon({ size = 16, class: className, title }: IconProps) {
  return (
    <svg
      class={className}
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
      {title ? <title>{title}</title> : null}
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  );
}
