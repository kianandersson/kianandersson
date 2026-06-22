import type { Decorator, Meta, StoryObj } from '@storybook/preact-vite';
import { expect, within } from 'storybook/test';
import rawIcon from '../../../assets/icon-rounded.svg?raw';
import { EmailSignature, SIGNATURE_TOKENS, type SignatureTokens } from './EmailSignature';
import { resolveSignatureTokens } from './resolveTokens';

// The CLI rasterises the tile to a single fixed PNG (sharp flattens the SVG's
// prefers-color-scheme swap to its dark default), so strip that swap here too —
// otherwise the browser would re-colour the preview's tile per scheme and stop
// matching the e-mail. The tile is square, sized to --space-4xl (40px).
const iconSvg = rawIcon.replace(/<style>[\s\S]*?<\/style>/, '');
const logo = {
  src: `data:image/svg+xml;utf8,${encodeURIComponent(iconSvg)}`,
  width: 40,
  height: 40,
};

// Storybook-only. A mail client does NOT re-resolve an e-mail's baked colours
// in dark mode — the e-mail only ever carries the light colours; the client
// inverts them on display. We simulate that by flipping each resolved colour's
// HSL lightness while keeping hue and saturation, so the dark preview shows the
// same signature a client would render, not a second hand-picked palette. The
// CLI never does this — it bakes the light colours and stops there.
function invertLightness(hex: string): string {
  const int = Number.parseInt(hex.slice(1), 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return hslToHex(h, s, 1 - l);
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = (
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  ).map((v) => Math.round((v + m) * 255));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

function invertColors(tokens: SignatureTokens): SignatureTokens {
  const inverted = { ...tokens };
  for (const token of SIGNATURE_TOKENS.color) {
    inverted[token] = invertLightness(tokens[token]);
  }
  return inverted;
}

// Frame the signature in a mock e-mail so it can be judged in context — the body
// copy above, the canvas around it, and the gap to the sign-off (which the
// signature owns, so the body stops right after "Best,").
//
// Two different colour models, on purpose:
//  - The signature gets tokens resolved to flat values exactly as the CLI does
//    (light theme, baked), so the preview shows the real e-mail. In dark mode we
//    invert those baked colours the way a mail client would (see invertColors).
//  - Everything around it (canvas, body copy) uses live `var(--token)` and
//    re-themes with Storybook's toggle as normal — that's the page chrome, not
//    the e-mail.
const withMockEmail: Decorator = (Story, context) => {
  const dark = context.globals.theme === 'dark';

  // Resolve the baked LIGHT tokens regardless of the Storybook theme — the
  // e-mail always carries light colours. Force light on the root for the read,
  // then restore so the surrounding chrome keeps the active theme.
  const root = document.documentElement;
  const previousTheme = root.dataset.theme;
  root.dataset.theme = 'light';
  let tokens = resolveSignatureTokens(SIGNATURE_TOKENS);
  if (previousTheme) root.dataset.theme = previousTheme;
  else delete root.dataset.theme;

  if (dark) tokens = invertColors(tokens);
  context.args.tokens = tokens;

  return (
    <div
      style={{
        background: 'var(--color-surface-raised)',
        padding: 'var(--space-3xl) var(--space-xl)',
      }}
    >
      <div
        style={{
          maxWidth: '38em',
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'var(--color-text)',
        }}
      >
        <p style={{ margin: '0 0 1em' }}>Hi Jordan,</p>
        <p style={{ margin: '0 0 1em' }}>
          Thanks for the quick turnaround — the latest build looks great. I'll go through the
          remaining tickets this afternoon and follow up if anything comes up.
        </p>
        <p style={{ margin: 0 }}>Best,</p>
        <Story />
      </div>
    </div>
  );
};

const meta: Meta<typeof EmailSignature> = {
  title: 'Artifacts/EmailSignature',
  component: EmailSignature,
  decorators: [withMockEmail],
  args: {
    logo,
    fullName: 'Kian Andersson',
    role: 'Senior Full-Stack Engineer & Tech Lead',
    website: 'https://kianandersson.com',
    websiteLabel: 'kianandersson.com',
    email: 'hi@kianandersson.dk',
    phone: '+45 12 34 56 78',
  },
};

export default meta;
type Story = StoryObj<typeof EmailSignature>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Kian Andersson')).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: 'Kian Andersson' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /kianandersson\.com/ })).toHaveAttribute(
      'href',
      'https://kianandersson.com',
    );
    await expect(canvas.getByRole('link', { name: /hi@kianandersson\.dk/ })).toHaveAttribute(
      'href',
      'mailto:hi@kianandersson.dk',
    );
  },
};

export const WithoutPhone: Story = {
  args: { phone: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/\+45/)).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: /hi@kianandersson\.dk/ })).toBeInTheDocument();
  },
};
