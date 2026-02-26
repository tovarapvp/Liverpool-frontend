import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/rickandmorty': {
                target: 'https://rickandmortyapi.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/rickandmorty/, '/api'),
            },
        },
    },
});
