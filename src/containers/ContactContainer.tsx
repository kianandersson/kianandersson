import { actions } from 'astro:actions';
import { Contact, type ContactProps } from '../components/organisms/Contact';

type Props = Omit<ContactProps, 'onSend'>;

export function ContactContainer(props: Props) {
  return <Contact {...props} onSend={actions.contact.send} />;
}
