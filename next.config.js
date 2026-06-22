/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://10.2.15.8:8000/:path*",
      },
    ];
  },
};

module.exports = nextConfig;