// ? Utile pour typer la table tasks dans les requêtes
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { tasks } from "../schemas";

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;