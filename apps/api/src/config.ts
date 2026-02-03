export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const DATABASE_URL = process.env.DATABASE_URL;
export const TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const PORT = Number(process.env.PORT ?? 4000);
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
