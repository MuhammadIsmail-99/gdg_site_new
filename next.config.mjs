/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
