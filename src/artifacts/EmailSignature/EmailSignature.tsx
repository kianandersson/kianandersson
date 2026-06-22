import type { JSX } from 'preact';

/**
 * Concrete style values for the signature, one per design-token role. Kept as
 * plain strings so the same component renders two ways: Storybook passes live
 * `var(--token)` references (themed preview), while the CLI passes values
 * resolved to flat sRGB hex / px — e-mail clients understand no CSS variables.
 */
export type SignatureTokens = {
  text: string; // name + wordmark
  accent: string; // the dot and the @
  contact: string; // contact line
  role: string; // role/title
  divider: string; // rule + separators
  topPad: string;
  markWidth: string;
  gap: string;
  indent: string; // contact line hang, clears the wordmark column
  rolePad: string;
  contactPad: string;
  markSize: string;
  nameSize: string;
  metaSize: string;
  tightLeading: string | number;
  contactLeading: string | number;
  sans: string;
  mono: string;
};

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
  const linkStyle: JSX.CSSProperties = { color: t.contact, textDecoration: 'none' };
  const separator = <span style={{ color: t.divider }}>{`${NBSP}·${NBSP}`}</span>;
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
              paddingTop: t.topPad,
              borderTop: `1px solid ${t.divider}`,
              fontFamily: t.sans,
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
                  <td style={{ width: t.markWidth, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: t.markSize,
                        letterSpacing: '-1.2px',
                        color: t.text,
                      }}
                    >
                      {mark}
                      <span style={{ color: t.accent }}>.</span>
                    </span>
                  </td>
                  <td style={{ width: '1px', background: t.divider, fontSize: 0, lineHeight: 0 }}>
                    {NBSP}
                  </td>
                  <td style={{ verticalAlign: 'top', paddingLeft: t.gap }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: t.nameSize,
                        lineHeight: t.tightLeading,
                        color: t.text,
                      }}
                    >
                      {fullName}
                    </div>
                    <div
                      style={{
                        fontFamily: t.mono,
                        fontSize: t.metaSize,
                        lineHeight: t.tightLeading,
                        color: t.role,
                        paddingTop: t.rolePad,
                      }}
                    >
                      {role}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                fontFamily: t.mono,
                fontSize: t.metaSize,
                lineHeight: t.contactLeading,
                color: t.contact,
                paddingTop: t.contactPad,
                paddingLeft: t.indent,
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
                    <span style={{ color: t.accent }}>@</span>
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
  );
}
