import type { NextConfig } from "next";

/** Default Next output — fits Netlify’s Next runtime. Avoid `output: "standalone"` here (Docker/self-host only). */
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.mp4": {
        type: "asset",
      },
    },
  },
};

export default nextConfig;
