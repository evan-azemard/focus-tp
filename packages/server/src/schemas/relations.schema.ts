// ! Ce fichier contient les relations entre les tables de la base de données, il est utilisé pour typer les relations dans TypeScript.
// TODO : Ajouter une détail à une tâche

import { relations } from "drizzle-orm";
import { goals, steps, substeps, tasks, users } from "./index";

// * Un utilisateur peut avoir plusieurs objectifs
export const usersRelations = relations(users, ({ many }) => ({
    goals: many(goals),
}));

// * Un objectif peut appartenir à un utilisateur et avoir plusieurs étapes
export const goalsRelations = relations(goals, ({ one, many }) => ({
    users: one(users, {
        fields: [goals.userId], 
        references: [users.id],
    }),
    steps: many(steps),
}));

// * Une étape appartient à un objectif et peut avoir plusieurs sous-étapes
export const stepsRelation = relations(steps, ({ one, many }) => ({
    goal: one(goals, {
        fields: [steps.goalId], 
        references: [goals.id],
    }),
        user: one(users, {
        fields: [steps.userId],
        references: [users.id],
    }),
    substeps: many(substeps),
}));

// * Une sous-étape appartient à une étape et peut avoir plusieurs tâches
export const substepsRelations = relations(substeps, ({ one, many}) => ({
    steps: one(steps, {
        fields: [substeps.stepId], 
        references: [steps.id],
    }),
        user: one(users, {
        fields: [substeps.userId],
        references: [users.id],
    }),
    tasks: many(tasks),
}));

// * Une tâche appartient à une sous-étape
export const tasksRelations = relations(tasks, ({ one}) => ({
    substeps: one(substeps, {
        fields: [tasks.substepId], 
        references: [substeps.id],
    }),
        user: one(users, {
        fields: [tasks.userId],
        references: [users.id],
    }),
}))