// ? Ce fichier est utilisé pour configurer Drizzle ORM
import { defineConfig } from 'drizzle-kit';
import { env } from './env';

const { DATABASE_URL } = env;

export default defineConfig({
    dialect: 'postgresql', // Indique a la db que l'on utilise PostgreSQL
    schema: './src/schemas/index.ts', // Chemin vers le fichier de schéma
    out: './src/migrations', // Répertoire de sortie pour les migrations
    dbCredentials: { // Informations de connexion à la base de données pour dire à Drizzle où se connecte
        url: DATABASE_URL // URL de la base de données
    },
    verbose: true, // Affiche les requêtes SQL dans la console
    strict: true, // Active le mode strict pour les migrations
})
