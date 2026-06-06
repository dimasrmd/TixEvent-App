import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/panitia/checkin",
        destination: "/panitia/check-in",
        permanent: true,
      },
      {
        source: "/kru/absensi",
        destination: "/crew/absensi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
