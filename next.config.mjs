/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async redirects() { return [{ source: "/ai-infrastructure", destination: "/data-center/ai-infrastructure", permanent: true }]; },
  experimental: { optimizePackageImports: ["framer-motion", "gsap"] },
};
export default nextConfig;
