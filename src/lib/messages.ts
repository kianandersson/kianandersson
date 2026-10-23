import type { Locale } from './locale';

type Messages = {
  heroGreeting: string;
  keySkillsTitle: string;
  allSkillsLink: string;
  experienceTitle: string;
  stackLabel: string;
  domainsLabel: string;
  readMore: string;
  readLess: string;
  moreItems: (count: number) => string;
  showLess: string;
  skillsTitle: string;
  miscellaneousTitle: string;
  languagesLabel: string;
  coordinatesTitle: string;
  emailLabel: string;
  phoneLabel: string;
  locationLabel: string;
  websiteLabel: string;
};

export const MESSAGES: Record<Locale, Messages> = {
  en: {
    heroGreeting: "Hi, I'm",
    keySkillsTitle: 'Key skills',
    allSkillsLink: 'All skills →',
    experienceTitle: 'Experience',
    stackLabel: 'Stack',
    domainsLabel: 'Domains',
    readMore: 'Read more',
    readLess: 'Read less',
    moreItems: (count) => `+${count} more`,
    showLess: 'Show less',
    skillsTitle: 'Skills',
    miscellaneousTitle: 'Miscellaneous',
    languagesLabel: 'Languages',
    coordinatesTitle: 'Coordinates',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    locationLabel: 'Location',
    websiteLabel: 'Website',
  },
  da: {
    heroGreeting: 'Hej, jeg hedder',
    keySkillsTitle: 'Nøglekompetencer',
    allSkillsLink: 'Alle kompetencer →',
    experienceTitle: 'Erhvervserfaring',
    stackLabel: 'Stack',
    domainsLabel: 'Domæner',
    readMore: 'Vis mere',
    readLess: 'Vis mindre',
    moreItems: (count) => `+${count} flere`,
    showLess: 'Vis færre',
    skillsTitle: 'Kompetencer',
    miscellaneousTitle: 'Øvrigt',
    languagesLabel: 'Sprog',
    coordinatesTitle: 'Kontakt',
    emailLabel: 'E-mail',
    phoneLabel: 'Telefon',
    locationLabel: 'Bopæl',
    websiteLabel: 'Hjemmeside',
  },
};
