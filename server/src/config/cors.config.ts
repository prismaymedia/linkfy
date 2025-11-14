import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const defaultOrigins = [
  'http://localhost:5173',
  'https://prismaymedia.github.io',
  'https://linkfy-app.vercel.app',
  'chrome-extension://mefdblccfmhfhhcgeckmcicgfnfgolpf',
];

const whitelist = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : defaultOrigins;

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'sentry-trace', 'baggage'],
  exposedHeaders: ['Authorization'],
};
