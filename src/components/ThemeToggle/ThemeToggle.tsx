import { useCallback, useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = useCallback(() => {
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
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={styles.button}
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <title>sun</title>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.6v2M12 19.4v2M4.7 4.7l1.4 1.4M17.9 17.9l1.4 1.4M2.6 12h2M19.4 12h2M4.7 19.3l1.4-1.4M17.9 6.1l1.4-1.4" />
          </svg>
        ) : (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>moon</title>
            <path d="M20 14.6A8 8 0 0 1 9.4 4 6.5 6.5 0 1 0 20 14.6Z" />
          </svg>
        )}
      </span>
    </button>
  );
}
