import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Garantir que o build não trave por avisos de tipo se estivermos com pressa
    ignoreBuildErrors: false,
  },
  eslint: {
    // Mesma lógica para o ESLint
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
