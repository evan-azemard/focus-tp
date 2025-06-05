// ? Utile pour typer la table users dans les requêtes à partir des schemas
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "../schemas";

export type User = InferSelectModel<typeof users>;

export type NewUser = InferInsertModel<typeof users>;
