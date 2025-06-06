// ? Utile pour typer la table substeps dans les requêtes
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { substeps } from "../schemas";

export type Substep = InferSelectModel<typeof substeps>;
export type NewSubstep = InferInsertModel<typeof substeps>;
