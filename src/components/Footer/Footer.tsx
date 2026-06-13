import styles from './Footer.module.css';

type Props = {
  name: string;
  year: number;
  sourceHref: string;
};

export function Footer({ name, year, sourceHref }: Props) {
  return (
    <footer className={styles.footer} data-chrome="bottom">
      <div className={styles.inner}>
        <span>
          © {year} {name}
        </span>
        <span className={styles.source}>
          This website is{' '}
          <a href={sourceHref} className={styles.link} rel="noopener">
            open-source
          </a>
        </span>
      </div>
    </footer>
  );
}
