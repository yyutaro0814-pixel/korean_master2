import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* GitHub Pagesで公開するための必須設定 */
  output: 'export', // 静的ファイルとして書き出す設定
  images: {
    unoptimized: true, // 静的エクスポートでは画像の最適化が使えないため無効化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
