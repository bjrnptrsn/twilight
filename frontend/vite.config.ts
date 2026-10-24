import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin(),
  ],
  define: {
    __TWILIGHT_VERSION__: JSON.stringify(version),
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['iife'],
      name: 'TwilightPanel',
      fileName: () => 'twilight-panel.js',
    },
    outDir: '../custom_components/twilight/frontend',
    // false so this build doesn't delete a twilight-dev-panel.js already
    // sitting in the shared outDir from vite.config.dev.ts (which is itself
    // emptyOutDir: false for the same reason, symmetrically).
    emptyOutDir: false,
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
})
