import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ Ignorer les erreurs de type pendant le build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
