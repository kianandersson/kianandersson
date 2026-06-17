import { useCallback, useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '../../atoms/Icon';
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
  const iconClass = hasInteracted ? `${styles.icon} ${styles.iconAnimate}` : styles.icon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={styles.button}
    >
      <span key={theme ?? 'initial'} className={iconClass} aria-hidden="true">
        {isDark ? <SunIcon title="sun" /> : <MoonIcon title="moon" />}
      </span>
    </button>
  );
}
