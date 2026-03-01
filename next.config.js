/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
        // Development needs 'unsafe-eval' for React Fast Refresh
        const isDev = process.env.NODE_ENV === 'development';
        const scriptSrc = isDev
            ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
            : "script-src 'self'";

        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'Content-Security-Policy', value: `default-src 'self'; ${scriptSrc}; connect-src 'self' https://api.openai.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'` },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
