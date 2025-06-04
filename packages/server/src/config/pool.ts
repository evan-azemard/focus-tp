// ? Ce fichier sert à configurer le pool de connexions pour l'application.
import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { env } from "./env";

import * as schema from "../schemas";

const { DATABASE_URL } = env;

// Création d'un pool de connexions à la base de données PostgreSQL

export const pool = new Pool({ connectionString: DATABASE_URL });

// Création d'une instance de la base de données avec le pool
export const db: NodePgDatabase<typeof schema> =  drizzle(pool, { schema});