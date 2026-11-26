import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      // ignore transient editor / atomic-write artifacts (they can lock the watcher)
      ignored: ['**/*.tmpdir/**', '**/.*.tmp', '**/*.tmp'],
    }
  }
});
