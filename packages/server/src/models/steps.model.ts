// ! Ce fichier contient le modèle pour gérer les étapes d’un objectif
import { Step, NewStep } from '../entities/Step.entity';
import { db } from '../config/pool';
import { steps, substeps, tasks, goals } from '../schemas';
import { and, eq } from 'drizzle-orm';
import logger, { logError } from '../utils/logger';

// ? Relations imbriquées pour plus de lisibilité des données
const taskWith = {
    columns: { id: true, title: true, description: true, substepId: true, dueDate: true, status: true, createdAt: true, updatedAt: true }
};

const substepWith = {
    columns: { id: true, title: true, description: true, stepId: true, dueDate: true, status: true, createdAt: true, updatedAt: true },
    with: { tasks: taskWith }
};

export const stepModel = {
    // * Récupération de toutes les étapes liées à un objectif
    getAll: async (goalId: string, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin ? eq(steps.goalId, goalId) : and(eq(steps.goalId, goalId), eq(steps.userId, authorId));

            return await db.query.steps.findMany({
                where: whereClause
            });
        } catch (err: any) {
            logError('STEP_MODEL_GETALL_ERROR', err, 'Erreur lors de la récupération des étapes', {
                goalId,
                authorId,
                isAdmin
            });
            throw new Error('Erreur lors de la récupération des étapes');
        }
    },

    // * Récupération d'une étape avec ses sous-étapes et tâches
    get: async (stepId: string, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin ? eq(steps.id, stepId) : and(eq(steps.id, stepId), eq(steps.userId, authorId));

            return await db.query.steps.findFirst({
                where: whereClause,
                with: { substeps: substepWith }
            });
        } catch (err: any) {
            logError('STEP_MODEL_GET_ERROR', err, 'Erreur lors de la récupération de l\'étape', {
                stepId,
                authorId,
                isAdmin
            });
            throw new Error('Erreur lors de la récupération de l\'étape');
        }
    },

    // * Création d’une nouvelle étape
    create: async (step: NewStep, authorId: string) => {
        try {
            return await db.insert(steps).values({
                ...step,
                userId: authorId
            }).returning();
        } catch (err: any) {
            logError('STEP_MODEL_CREATE_ERROR', err, 'Erreur lors de la création de l\'étape', {
                step,
                authorId
            });
            throw new Error('Erreur lors de la création de l\'étape');
        }
    },

    // * Mise à jour d'une étape
    update: async (stepId: string, data: Partial<Step>, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin? eq(steps.id, stepId) : and(eq(steps.id, stepId), eq(steps.userId, authorId));

            return await db.update(steps).set(data).where(whereClause);
        } catch (err: any) {
            logError('STEP_MODEL_UPDATE_ERROR', err, 'Erreur lors de la mise à jour de l\'étape', {
                stepId,
                authorId,
                isAdmin,
                data
            });
            throw new Error('Erreur lors de la mise à jour de l\'étape');
        }
    },

    // * Suppression d'une étape
    delete: async (stepId: string, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin
                ? eq(steps.id, stepId)
                : and(eq(steps.id, stepId), eq(steps.userId, authorId));

            return await db.delete(steps).where(whereClause);
        } catch (err: any) {
            logError('STEP_MODEL_DELETE_ERROR', err, 'Erreur lors de la suppression de l\'étape', {
                stepId,
                authorId,
                isAdmin
            });
            throw new Error('Erreur lors de la suppression de l\'étape');
        }
    }
};