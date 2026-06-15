// Shared between the contact action (server) and ContactForm (client) so
// both sides accept exactly the same payloads.
export const CONTACT_SUBJECT_MAX = 120;
export const CONTACT_MESSAGE_MAX = 5000;
export const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
