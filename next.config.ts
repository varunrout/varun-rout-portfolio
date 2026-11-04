import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Temporary while opponent-adjusted-metrics is redesigned: old links (CVs, posts) land on the work list.
      { source: '/work/opponent-adjusted-metrics', destination: '/#work', permanent: false },
    ];
  },
};

export default nextConfig;
