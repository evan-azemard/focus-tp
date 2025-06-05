// ? Définition de la table des étapes
import { pgTable, uuid, varchar, text, date, timestamp } from "drizzle-orm/pg-core";
import { goals } from "./goals.schema";
import { users } from "./users.schema";

export const steps = pgTable("steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id").references(() => goals.id, { onDelete: "cascade"}).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
