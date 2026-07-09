const isDev = process.argv.includes('dev')

// In dev, run Velite in watch mode so content hot-reloads. In production the
// `prebuild` script generates content before `next build` runs (more reliable
// on Vercel / any CI than doing it inside the config).
if (isDev && !process.env.VELITE_STARTED) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: true, clean: false })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Vercel Image Optimization serves modern formats automatically.
    formats: ['image/avif', 'image/webp'],
    // Content images live in /public; remote covers can opt in here.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
}

export default nextConfig
