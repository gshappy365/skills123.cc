// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://gshappy365.github.io',
  base: '/skills123.cc',
  vite: {
    plugins: [tailwindcss()]
  }
});