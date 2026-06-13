import styles from './Footer.module.css';

type Props = {
  name: string;
  year: number;
  sourceHref: string;
};

export function Footer({ name, year, sourceHref }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>
          © {year} {name}
        </span>
        <span className={styles.source}>
          This website is{' '}
          <a href={sourceHref} className={styles.link} target="_blank" rel="noopener noreferrer">
            open-source
          </a>
        </span>
      </div>
    </footer>
  );
}
