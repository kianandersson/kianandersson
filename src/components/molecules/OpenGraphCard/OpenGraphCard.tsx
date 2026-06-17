import { Chip } from '../../atoms/Chip';
import styles from './OpenGraphCard.module.css';

type Props = {
  firstName: string;
  lastName: string;
  role: string;
  skills: string[];
};

/**
 * Renders to the off-screen `/og` page which the build screenshots into og.png.
 * The card is authored at a fixed 600px canvas (scaled 2× for the 1200×630 OG
 * frame), so it uses literal pixel sizes — not the token-based responsive scale
 * that Heading/Text are wired to. Bypassing those primitives here is intentional.
 */
export function OpenGraphCard({ firstName, lastName, role, skills }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.identity}>
        <h1 className={styles.name}>
          {firstName}
          <br />
          {lastName}
        </h1>
        <p className={styles.role}>{role}</p>
      </div>

      <div className={styles.chips}>
        {skills.map((label) => (
          <Chip key={label} label={label} variant="stack" />
        ))}
      </div>
    </div>
  );
}
