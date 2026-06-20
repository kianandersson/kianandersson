import type { ContactDetails } from '../../../lib/print-options';
import { DefinitionItem } from '../../molecules/DefinitionItem';
import { SectionHeader } from '../../molecules/SectionHeader';
import styles from './Coordinates.module.css';

type Props = {
  contact: ContactDetails;
};

type ContactItem = { label: string; value: string; href?: string };

function stripScheme(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** Path only (e.g. "/in/kianandersson") — the full URL is too long for the CV,
 *  but stays on the href so the value is still clickable. */
function urlPath(url: string): string {
  return new URL(url).pathname.replace(/\/$/, '');
}

function toItems(contact: ContactDetails): ContactItem[] {
  const items: ContactItem[] = [];
  if (contact.email) {
    items.push({ label: 'Email', value: contact.email, href: `mailto:${contact.email}` });
  }
  if (contact.phone) {
    items.push({
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s+/g, '')}`,
    });
  }
  if (contact.location) {
    items.push({ label: 'Location', value: contact.location });
  }
  if (contact.website) {
    items.push({ label: 'Website', value: stripScheme(contact.website), href: contact.website });
  }
  if (contact.github) {
    items.push({ label: 'GitHub', value: urlPath(contact.github), href: contact.github });
  }
  if (contact.linkedin) {
    items.push({ label: 'LinkedIn', value: urlPath(contact.linkedin), href: contact.linkedin });
  }
  return items;
}

/**
 * Print-only "my coordinates" section for the offline CV (design: "Option A —
 * 3 columns"). Hidden on screen and absent from the public build entirely
 * (rendered only when `PRINT_OPTIONS` supplies the private details).
 */
export function Coordinates({ contact }: Props) {
  const items = toItems(contact);
  if (items.length === 0) return null;

  // Three columns when the private details (email/phone) are present — i.e. the
  // local print build; two for the public print, which only has the links.
  const columns = contact.email || contact.phone ? 3 : 2;

  return (
    <section class={styles.root} id="coordinates" aria-labelledby="coordinates-heading">
      <SectionHeader title="My coordinates" id="coordinates-heading" />
      <dl class={styles.grid} data-columns={columns}>
        {items.map((item) => (
          <DefinitionItem key={item.label} label={item.label} value={item.value} href={item.href} />
        ))}
      </dl>
    </section>
  );
}
