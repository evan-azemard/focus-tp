// ? Ce fichier contient le modèle pour les objectifs, il est utilisé pour interagir avec la base de données.

import { Goal, NewGoal } from '../entities/Goal.entity';
import { db } from '../config/pool';
import { goals, steps, substeps, tasks } from '../schemas';
import logger from '../utils/logger';
import { and, eq } from 'drizzle-orm';

// Relations imbriquées
const taskWith = {
    columns: { id: true, title: true, description: true, substepId: true, dueDate: true, status: true, createdAt: true, updatedAt: true }
};

const substepWith = {
    columns: { id: true, title: true, description: true, stepId: true, dueDate: true, status: true, createdAt: true, updatedAt: true },
    with: { tasks: taskWith }
};

const stepWith = {
    columns: { id: true, title: true, description: true, goalId: true, dueDate: true, status: true, createdAt: true, updatedAt: true },
    with: { substeps: substepWith }
};

export const goalModel = {
    getAll: () => {
        try {
            return db.select({
                id: goals.id,
                title: goals.title,
                description: goals.description,
                userId: goals.userId,
                dueDate: goals.dueDate,
                status: goals.status,
                createdAt: goals.createdAt,
                updatedAt: goals.updatedAt,
                startDate: goals.startDate,
                difficulty: goals.difficulty,
            }).from(goals);
        } catch (err: any) {
            logger.error(`Erreur lors de la récupération des objectifs : ${err.message}`);
            throw new Error('Erreur lors de la récupération des objectifs');
        }
    },

    get: (id: string) => {
        try {
            return db.query.goals.findFirst({
                where: eq(goals.id, id),
                columns: {
                    id: true,
                    title: true,
                    description: true,
                    userId: true,
                    dueDate: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    startDate: true,
                    difficulty: true,
                },
                with: { steps: stepWith }
            });
        } catch (err: any) {
            logger.error(`Erreur lors de la récupération de l'objectif : ${err.message}`);
            throw new Error('Erreur lors de la récupération de l\'objectif');
        }
    },

    create: (goal: NewGoal) => {
        try {
            return db.insert(goals).values(goal).returning({ id: goals.id });
        } catch (err: any) {
            logger.error(`Erreur lors de la création de l'objectif : ${err.message}`);
            throw new Error('Erreur lors de la création de l\'objectif');
        }
    },

    update: (id: string, data: Partial<Goal>) => {
        try {
            return db.update(goals).set(data).where(eq(goals.id, id));
        } catch (err: any) {
            logger.error(`Erreur lors de la mise à jour de l'objectif : ${err.message}`);
            throw new Error('Erreur lors de la mise à jour de l\'objectif');
        }
    },

    delete: (id: string, authorId: string) => {
        try {
            return db.delete(goals).where(
                and(
                    eq(goals.id, id),
                    eq(goals.userId, authorId),
                )
            );
        } catch (err: any) {
            logger.error(`Erreur lors de la suppression de l'objectif : ${err.message}`);
            throw new Error('Erreur lors de la suppression de l\'objectif');
        }
    }
};
