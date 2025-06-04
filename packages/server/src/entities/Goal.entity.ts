// ? Utile pour typer la table goals dans les requêtes
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { goals } from "../schemas";

export type Goal = InferSelectModel<typeof goals>;
export type newGoal = InferInsertModel<typeof goals>;
