import type { JSX } from 'preact';

/**
 * The design tokens the signature uses, grouped by how each resolves to a flat
 * inline value for e-mail (colours → sRGB hex, lengths → px, leadings → ratio,
 * fonts → fallback stack). One source of truth, shared by the component, the
 * CLI resolver, and the Storybook preview — keyed by the real token names so
 * there's no translation layer to keep in sync.
 */
export const SIGNATURE_TOKENS = {
  color: ['--color-text', '--color-accent', '--color-text-muted', '--color-divider'],
  length: [
    '--space-m',
    '--space-6xl',
    '--space-s',
    '--space-2xs',
    '--text-heading-m-size',
    '--text-label-size',
    '--text-caption-s-size',
  ],
  ratio: ['--text-heading-m-leading', '--text-caption-m-leading'],
  font: ['--font-sans', '--font-mono'],
} as const;

export type SignatureTokenManifest = typeof SIGNATURE_TOKENS;
type SignatureTokenName = SignatureTokenManifest[keyof SignatureTokenManifest][number];

/**
 * Each design token resolved to a flat value. Storybook passes live
 * `var(--token)` references (themed preview); the CLI passes values resolved to
 * flat sRGB hex / px — e-mail clients understand no CSS variables.
 */
export type SignatureTokens = Record<SignatureTokenName, string>;

export type EmailSignatureProps = {
  /** Wordmark — the two initials, e.g. "ka". */
  mark: string;
  fullName: string;
  role: string;
  /** Full URL for the link target. */
  website: string;
  /** Display text for the website, e.g. "kianandersson.com". */
  websiteLabel: string;
  email?: string;
  phone?: string;
  tokens: SignatureTokens;
};

// Non-breaking spaces keep the separators and the divider cell from collapsing.
const NBSP = '\u00A0';

// Inline styles + table layout = maximum client compatibility: no external
// stylesheets, no web fonts to load. The wordmark's weight and tracking are
// brand specifics with no token, so they stay literal.
export function EmailSignature({
  mark,
  fullName,
  role,
  website,
  websiteLabel,
  email,
  phone,
  tokens: t,
}: EmailSignatureProps) {
  const linkStyle: JSX.CSSProperties = { color: t['--color-text-muted'], textDecoration: 'none' };
  const separator = <span style={{ color: t['--color-divider'] }}>{`${NBSP}·${NBSP}`}</span>;
  const [emailUser, emailDomain] = (email ?? '').split('@');

  return (
    <table
      role="presentation"
      cellPadding="0"
      cellSpacing="0"
      style={{ borderCollapse: 'collapse' }}
    >
      <tbody>
        <tr>
          <td
            style={{
              paddingTop: t['--space-m'],
              borderTop: `1px solid ${t['--color-divider']}`,
              fontFamily: t['--font-sans'],
            }}
          >
            <table
              role="presentation"
              cellPadding="0"
              cellSpacing="0"
              style={{ borderCollapse: 'collapse' }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      width: t['--space-6xl'],
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: t['--text-heading-m-size'],
                        letterSpacing: '-1.2px',
                        color: t['--color-text'],
                      }}
                    >
                      {mark}
                      <span style={{ color: t['--color-accent'] }}>.</span>
                    </span>
                  </td>
                  <td
                    style={{
                      width: '1px',
                      background: t['--color-divider'],
                      fontSize: 0,
                      lineHeight: 0,
                    }}
                  >
                    {NBSP}
                  </td>
                  <td style={{ verticalAlign: 'top', paddingLeft: t['--space-s'] }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: t['--text-label-size'],
                        lineHeight: t['--text-heading-m-leading'],
                        color: t['--color-text'],
                      }}
                    >
                      {fullName}
                    </div>
                    <div
                      style={{
                        fontFamily: t['--font-mono'],
                        fontSize: t['--text-caption-s-size'],
                        lineHeight: t['--text-heading-m-leading'],
                        color: t['--color-text-muted'],
                        paddingTop: t['--space-2xs'],
                      }}
                    >
                      {role}
                    </div>
                    {/* Contact line shares the column so the rule runs full height. */}
                    <div
                      style={{
                        fontFamily: t['--font-mono'],
                        fontSize: t['--text-caption-s-size'],
                        lineHeight: t['--text-caption-m-leading'],
                        color: t['--color-text-muted'],
                        paddingTop: t['--space-2xs'],
                      }}
                    >
                      <a href={website} style={linkStyle}>
                        {websiteLabel}
                      </a>
                      {email ? (
                        <>
                          {separator}
                          <a href={`mailto:${email}`} style={linkStyle}>
                            {emailUser}
                            <span style={{ color: t['--color-accent'] }}>@</span>
                            {emailDomain}
                          </a>
                        </>
                      ) : null}
                      {phone ? (
                        <>
                          {separator}
                          <span style={{ whiteSpace: 'nowrap' }}>{phone}</span>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
