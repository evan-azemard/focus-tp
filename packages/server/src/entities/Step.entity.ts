// ? Utile pour typer la table steps dans les requêtes
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { steps } from "../schemas";

export type Step = InferSelectModel<typeof steps>;
export type NewStep = InferInsertModel<typeof steps>;
