import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Import existing Tailwind + design tokens

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0F171B' }, // --bg-800
        { name: 'darker', value: '#0A2A3A' }, // --bg-900
        { name: 'light', value: '#1A2B35' }, // --bg-700
      ],
    },
    layout: 'centered',
    // Accessibility addon configuration
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
        ],
      },
    },
  },
  // Global decorators for glassmorphism context
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-b from-bg-900 to-bg-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export default preview;
