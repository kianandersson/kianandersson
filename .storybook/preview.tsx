import type { Decorator, Preview } from '@storybook/preact-vite';
import '../src/styles/tokens.css';
import './preview.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
  }
  return <Story />;
};

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    backgrounds: { disable: true },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Foundations',
          ['Introduction', 'Colors', 'Typography', 'Spacing', 'Radius', 'Icons'],
          'Atoms',
          'Molecules',
          'Organisms',
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Active theme (toggles data-theme="dark" on the document root).',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
