// ? Définition de la table des sous-étapes
import { pgTable, uuid, varchar, text, date, timestamp } from "drizzle-orm/pg-core";
import { steps } from "./steps.schema";

export const substeps = pgTable("substeps", {
  id: uuid("id").primaryKey().defaultRandom(),
  stepId: uuid("step_id").references(() => steps.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
