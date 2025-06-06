// ! Ce fichier contient le modèle pour gérer les sous-étapes d’une étape
import { Substep, NewSubstep } from '../entities/Substep.entity';
import { db } from '../config/pool';
import { substeps } from '../schemas';
import { and, eq } from 'drizzle-orm';
import { logError } from '../utils/logger';

// ? Relations imbriquées pour plus de lisibilité des données
const taskWith = {
    columns: { id: true, title: true, description: true, substepId: true, dueDate: true, status: true, createdAt: true, updatedAt: true }
};

export const substepModel = {
    // * Récupération de toutes les sous-étapes liées à une étape
    getAll: async (stepId: string, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin? eq(substeps.stepId, stepId): and(eq(substeps.stepId, stepId), eq(substeps.userId, authorId));

            return await db.query.substeps.findMany({
                where: whereClause,
                with: { tasks: taskWith }
            });
        } catch (err: any) {
            logError('SUBSTEP_MODEL_GETALL_ERROR', err, 'Erreur lors de la récupération des sous-étapes', {
                stepId,
                authorId,
                isAdmin
            });
            throw new Error('Erreur lors de la récupération des sous-étapes');
        }
    },

    // * Récupération d'une sous-étape
    get: async (substepId: string, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin ? eq(substeps.id, substepId) : and(eq(substeps.id, substepId), eq(substeps.userId, authorId));

            return await db.query.substeps.findFirst({
                where: whereClause,
                with: { tasks: taskWith }
            });
        } catch (err: any) {
            logError('SUBSTEP_MODEL_GET_ERROR', err, 'Erreur lors de la récupération de la sous-étape', {
                substepId,
                authorId,
                isAdmin
            });
            throw new Error('Erreur lors de la récupération de la sous-étape');
        }
    },

    // * Création d’une nouvelle sous-étape
    create: async (substep: NewSubstep, authorId: string) => {
        try {
            return await db.insert(substeps).values({
                ...substep,
                userId: authorId
            }).returning();
        } catch (err: any) {
            logError('SUBSTEP_MODEL_CREATE_ERROR', err, 'Erreur lors de la création de la sous-étape', {
                substep,
                authorId
            });
            throw new Error('Erreur lors de la création de la sous-étape');
        }
    },

    // * Mise à jour d'une sous-étape
    update: async (substepId: string, data: Partial<Substep>, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin? eq(substeps.id, substepId) : and(eq(substeps.id, substepId), eq(substeps.userId, authorId));

            return await db.update(substeps).set(data).where(whereClause);
        } catch (err: any) {
            logError('SUBSTEP_MODEL_UPDATE_ERROR', err, 'Erreur lors de la mise à jour de la sous-étape', {
                substepId,
                authorId,
                isAdmin,
                data
            });
            throw new Error('Erreur lors de la mise à jour de la sous-étape');
        }
    },

    // * Suppression d'une sous-étape
    delete: async (substepId: string, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin ? eq(substeps.id, substepId)  : and(eq(substeps.id, substepId), eq(substeps.userId, authorId));

            return await db.delete(substeps).where(whereClause);
        } catch (err: any) {
            logError('SUBSTEP_MODEL_DELETE_ERROR', err, 'Erreur lors de la suppression de la sous-étape', {
                substepId,
                authorId,
                isAdmin
            });
            throw new Error('Erreur lors de la suppression de la sous-étape');
        }
    }
};
