import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/KidVision_Local_App_Windows_v13_vocab/:path*",
        destination: "/kidclimbR_Local_App_Windows_v13_vocab/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/kidclimbR_Local_App_Windows_v13_vocab/:path*",
        destination: "/KidVision_Local_App_Windows_v13_vocab/:path*",
      },
    ];
  },
};

export default nextConfig;
