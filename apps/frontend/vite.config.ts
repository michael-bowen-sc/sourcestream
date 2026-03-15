import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import type { TerserOptions } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html showing bundle composition
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ],
  build: {
    // Optimize build output
    target: 'ES2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    } as TerserOptions,

    // Rollup configuration for chunking and code splitting
    rollupOptions: {
      output: {
        // Manual chunk configuration for better caching
        manualChunks: {
          // Separate vendor chunks for better cache busting
          'vendor-react': ['react', 'react-dom'],
          'vendor-chakra': ['@chakra-ui/react', '@chakra-ui/theme', '@emotion/react', '@emotion/styled'],
          'vendor-icons': ['react-icons'],
          'vendor-utils': ['framer-motion', 'autoprefixer'],
          'vendor-grpc': ['google-protobuf', 'grpc-web'],
          'vendor-tailwind': ['tailwindcss'],
        },
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 600,

    // Source map for production debugging (minified)
    sourcemap: 'hidden',
  },

  // Optimize dependencies with pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@chakra-ui/react',
      '@chakra-ui/theme',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      'react-icons',
    ],
    exclude: ['dist', 'node_modules'],
  },
})
