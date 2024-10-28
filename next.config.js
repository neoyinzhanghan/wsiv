module.exports = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: "/uploads/:path*",
          destination: "/public/uploads/:path*",
        },
      ];
    },
  };
  