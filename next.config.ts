import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is fully static: `next build` writes plain HTML/CSS/JS to ./out.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
