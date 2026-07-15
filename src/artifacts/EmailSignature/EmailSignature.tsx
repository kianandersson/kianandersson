import { type CSSProperties, Fragment } from 'preact';

/**
 * The design tokens the signature uses, grouped by how each resolves to a flat
 * inline value for e-mail (colours → sRGB hex, lengths → px, leadings → ratio,
 * fonts → fallback stack). One source of truth, shared by the component, the
 * CLI resolver, and the Storybook preview — keyed by the real token names so
 * there's no translation layer to keep in sync.
 */
export const SIGNATURE_TOKENS = {
  color: ['--color-text', '--color-text-muted', '--color-divider'],
  length: [
    '--space-m',
    '--space-2xs',
    '--space-l', // gap above the signature, to the message it follows
    '--space-4xl', // logo size — the CLI rasterises the tile to this
    '--text-label-size',
    '--text-caption-s-size',
  ],
  ratio: ['--text-label-leading', '--text-caption-s-leading'],
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

/**
 * The brand icon tile, as an `<img>` with explicit width/height (display px).
 * Optional: the CLI omits it and copies the tile to the clipboard as a separate
 * image instead — many clients strip an inline image, so the signature is pasted
 * up to the divider and the real PNG pasted in below it, where it embeds as a
 * `cid:` attachment every client renders. Storybook passes the source SVG so the
 * preview shows the assembled result.
 *
 * The tile carries its own dark background, so it stays legible on any e-mail
 * background — light or dark — with no `prefers-color-scheme` swap, which a
 * raster couldn't honour and many clients ignore anyway.
 */
export type SignatureLogo = { src: string; width: number; height: number };

export type EmailSignatureProps = {
  logo?: SignatureLogo;
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

// Inline styles + table layout = maximum client compatibility: no external
// stylesheets, no web fonts to load. A single vertical column, stacked top to
// bottom: name, role, website, e-mail, phone, a divider rule, then the logo.
export function EmailSignature({
  logo,
  fullName,
  role,
  website,
  websiteLabel,
  email,
  phone,
  tokens: t,
}: EmailSignatureProps) {
  const linkStyle: CSSProperties = { color: t['--color-text-muted'], textDecoration: 'none' };
  // Every line below the name shares one style: mono caption, muted, each nudged
  // down from the line above by the same small step for an even stack.
  const lineStyle: CSSProperties = {
    fontFamily: t['--font-mono'],
    fontSize: t['--text-caption-s-size'],
    lineHeight: t['--text-caption-s-leading'],
    color: t['--color-text-muted'],
  };
  // Always break the role onto its own lines (a hard <br>, not a soft wrap):
  // after each comma, and before each "&" so the ampersand leads the next line.
  const roleLines = role.split(/\s+(?=&)|(?<=,)\s+/);
  const [emailUser, emailDomain] = (email ?? '').split('@');

  return (
    <>
      <table
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        style={{ borderCollapse: 'collapse' }}
      >
        <tbody>
          <tr>
            <td style={{ paddingTop: t['--space-l'], fontFamily: t['--font-sans'] }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: t['--text-label-size'],
                  lineHeight: t['--text-label-leading'],
                  color: t['--color-text'],
                }}
              >
                {fullName}
              </div>
              <div style={{ ...lineStyle, paddingTop: t['--space-2xs'] }}>
                {roleLines.map((line, i) => (
                  <Fragment key={line}>
                    {i > 0 ? <br /> : null}
                    {line.startsWith('&') ? (
                      <>
                        <span style={{ color: t['--color-text-muted'] }}>&</span>
                        {line.slice(1)}
                      </>
                    ) : (
                      line
                    )}
                  </Fragment>
                ))}
              </div>
              <div style={{ ...lineStyle, paddingTop: t['--space-m'] }}>
                <a href={website} style={linkStyle}>
                  {websiteLabel}
                </a>
              </div>
              {email ? (
                <div style={{ ...lineStyle, paddingTop: t['--space-2xs'] }}>
                  <a href={`mailto:${email}`} style={linkStyle}>
                    {emailUser}
                    <span style={{ color: t['--color-text-muted'] }}>@</span>
                    {emailDomain}
                  </a>
                </div>
              ) : null}
              {phone ? (
                <div style={{ ...lineStyle, paddingTop: t['--space-2xs'] }}>
                  <a href={`tel:${phone}`} style={linkStyle}>
                    {phone.startsWith('+') ? (
                      <>
                        <span style={{ color: t['--color-text-muted'] }}>+</span>
                        {phone.slice(1)}
                      </>
                    ) : (
                      phone
                    )}
                  </a>
                </div>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>{' '}
      <br />
      {logo ? (
        <img
          src={logo.src}
          alt={fullName}
          width={logo.width}
          height={logo.height}
          style={{ display: 'block', border: 0 }}
        />
      ) : (
        'LOGO'
      )}
    </>
  );
}
