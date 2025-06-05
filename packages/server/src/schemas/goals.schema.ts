// ? Définition de la table des objectifs
import { pgTable, integer, date, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from './users.schema'

export const goals = pgTable('goals', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: "set null" }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    startDate: date('start_date').notNull(),
    dueDate: date('dueDate').notNull(),
    difficulty: integer('difficulty').notNull(),
    status: varchar('status', { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

})