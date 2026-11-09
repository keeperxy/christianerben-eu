import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const tailnetHost = process.env.DEV_TAILNET_HOST ?? "lyra.tail81f562.ts.net";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  adapterPath: path.join(projectRoot, "scripts/vercel-static-404-adapter.mjs"),
  experimental: {
    useTypeScriptCli: true,
  },
  allowedDevOrigins: [tailnetHost],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // The /cv page embeds its own PDFs, so framing stays same-origin only.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</llms.txt>; rel="describedby"; type="text/plain"',
          },
          {
            key: "Vary",
            value: "Accept",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "header",
              key: "accept",
              value: ".*[Tt][Ee][Xx][Tt]/[Mm][Aa][Rr][Kk][Dd][Oo][Ww][Nn].*",
            },
          ],
          destination: "/api/markdown/homepage",
        },
      ],
    };
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.credly.com",
      },
    ],
  },
};

export default nextConfig;
