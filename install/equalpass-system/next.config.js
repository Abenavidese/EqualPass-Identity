/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
        "pino-pretty": false,
        "pino-std-serializers": false,
        "process-warning": false,
        "thread-stream": false,
        "@react-native-async-storage/async-storage": false,
      };
    }
    return config;
  },
  images: {
    domains: ["zk-scholar.onrender.com"], // si cargas imágenes desde el backend
  },
};

module.exports = nextConfig;
