/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  reactCompiler: true,
  images: {
    qualities: [100, 70, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xvvyfmrtcbnlsnbzfmoq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/:alias",
  //       destination: "/horeca/:alias",
  //     },
  //   ];
  // },
};

export default nextConfig;