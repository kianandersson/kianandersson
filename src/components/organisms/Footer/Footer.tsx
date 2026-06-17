import { TextLink } from '../../atoms/TextLink';
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
          <TextLink href={sourceHref} target="_blank" rel="noopener noreferrer" tone="default">
            open-source
          </TextLink>
        </span>
      </div>
    </footer>
  );
}
