import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const defaultOrigins = [
  'http://localhost:5173',
  'https://prismaymedia.github.io',
  'https://linkfy-app.vercel.app',
  'chrome-extension://mefdblccfmhfhhcgeckmcicgfnfgolpf',
];

const whitelist = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : defaultOrigins;

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'sentry-trace', 'baggage'],
  exposedHeaders: ['Authorization'],
};
