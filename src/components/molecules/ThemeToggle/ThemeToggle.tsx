import { useCallback, useEffect, useState } from 'preact/hooks';
import { IconButton } from '../../atoms/IconButton';
import { DarkModeIcon, LightModeIcon } from '../../atoms/icons';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = useCallback(() => {
    setHasInteracted(true);
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* localStorage unavailable — degrade silently */
      }
      return next;
    });
  }, []);

  const isDark = theme === 'dark';

  return (
    <IconButton
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span key={theme ?? 'initial'} class={hasInteracted ? styles.iconAnimate : undefined}>
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </span>
    </IconButton>
  );
}
