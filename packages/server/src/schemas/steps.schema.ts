// ? Définition de la table des étapes
import { pgTable, uuid, varchar, text, date, timestamp } from "drizzle-orm/pg-core";
import { goals } from "./goals.schema";

export const steps = pgTable("steps", {
  id: uuid("id").primaryKey(),
  goalId: uuid("goal_id").references(() => goals.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
