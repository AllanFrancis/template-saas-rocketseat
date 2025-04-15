import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**", // permite todos os caminhos
      },
    ],
  },
  // outras opções de configuração
};

export default nextConfig;
