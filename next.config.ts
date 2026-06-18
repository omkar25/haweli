import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["some-stars-stay.loca.lt"],
  serverExternalPackages: [
    "pg",
    "@prisma/adapter-pg",
    "@prisma/client",
    "@prisma/driver-adapter-utils",
    "pusher",
  ],
  turbopack: {
    root: ".",
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
