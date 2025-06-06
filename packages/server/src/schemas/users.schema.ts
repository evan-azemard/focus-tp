// ? Dééfinition de la table des utilisateurs
import { pgTable, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    registeredAt: timestamp('registered_at', { withTimezone: true }).notNull().defaultNow(),
    isAdmin: boolean('is_admin').notNull().default(false),
})