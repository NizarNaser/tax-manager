/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        serverComponentsExternalPackages: ["sequelize", "mysql2"],
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            child_process: false,
            net: false,
            tls: false,
            rimraf: false,
            path: false,
            os: false,
            crypto: false,
        };
        return config;
    },
};

export default nextConfig;
