import { AvailabilityPill } from '../AvailabilityPill/AvailabilityPill';
import { Chip } from '../Chip/Chip';
import styles from './OpenGraphCard.module.css';

type Props = {
  name: string;
  role: string;
  skills: string[];
  availableFrom?: Date;
};

export function OpenGraphCard({ name, role, skills, availableFrom }: Props) {
  const [firstName, ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(' ');

  return (
    <div className={styles.card}>
      <div className={styles.badge}>
        <AvailabilityPill availableFrom={availableFrom} />
      </div>

      <div className={styles.identity}>
        <h1 className={styles.name}>
          {firstName}
          {lastName && (
            <>
              <br />
              {lastName}
            </>
          )}
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
