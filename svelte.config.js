import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    csrf: {
      trustedOrigins: ['http://192.168.1.16:5173']
    },
    alias: {
      "$lib": "./src/lib",
      "$lib/*": "./src/lib/*"
    }
  }
};

export default config;