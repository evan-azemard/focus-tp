export interface EnvConfig {
    PORT: number;
    DATABASE_URL: string;
    ORIGIN: string;
    JWT_SECRET: string;
    NODE_ENV: 'development' | 'production' | 'test';
}