// ? Ce fichier est utilisé pour extraire les variables d'environnement et les configurer pour l'application
import { EnvConfig } from "../types/env";
import "dotenv/config";

export const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || "3000"),
    NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
    ORIGIN: process.env.ORIGIN || "http://localhost:3000",
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/focus",
    JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret",
};