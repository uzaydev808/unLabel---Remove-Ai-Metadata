import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp uses native bindings — keep it external so Next.js does not try to bundle it.
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
