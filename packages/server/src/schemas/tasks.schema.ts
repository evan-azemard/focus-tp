// ? Dééfinition de la table des tâches
import { pgTable, uuid, varchar, text, date, timestamp } from "drizzle-orm/pg-core";
import { substeps } from "./substeps.schema";
import { users } from "./users.schema";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  substepId: uuid("substep_id").references(() => substeps.id, { onDelete: "cascade"}).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
