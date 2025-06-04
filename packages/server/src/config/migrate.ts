// ? Ce fichier est généré automatiquement par la commande `pnpm migrate`.
// ? Il est utilisé pour appliquer les migrations à la base de données PostgreSQL.
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { env } from "./env";

const { DATABASE_URL } = env;

export async function main() {
    // Un pool sert à gérer les connexions à la base de données PostgreSQL.
    const pool = new Pool({ connectionString: DATABASE_URL });

    // La fonction drizzle permet de créer une instance de la base de données avec le pool.
    const db:  NodePgDatabase = drizzle(pool);

    console.info("Starting migration...");

    // La fonction migrate permet d'appliquer les migrations à la base de données.
    await migrate(db, { migrationsFolder: "src/migrations" });

    console.info("Migration completed successfully.");

    // Ferme le pool de connexions pour éviter les fuites de mémoire.
    await pool.end();
}

main();