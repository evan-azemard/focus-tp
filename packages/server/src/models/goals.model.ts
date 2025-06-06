// ! Ce fichier contient le modèle pour gérer les objectifs d'un utilisateur
import { Goal, NewGoal } from '../entities/Goal.entity';
import { db } from '../config/pool';
import { goals } from '../schemas';
import { logError } from '../utils/logger';
import { and, eq } from 'drizzle-orm';

// ? Relations imbriquées pour plus de lisibilité des données
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
    // * Récupération de tous les objectifs d'un utilisateur
    getAll: async (authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin ? undefined : eq(goals.userId, authorId);

            return await db.query.goals.findMany({
                where: whereClause,
            })
        } catch (err: any) {
            // * Erreur détaillée pour le logger winston afin de faciliter le débogage et de ne rien remonter au client contenant des informations sensibles
            logError('GOAL_MODEL_GETALL_ERROR', err, 'Erreur lors de la récupération des objectifs', {
                id: null,
                authorId,
                isAdmin
            })
            throw new Error('Erreur lors de la récupération des objectifs');
        }
    },

    // * Récupération d'un objectif par son ID avec ses étapes, sous-étapes et tâches
    get: async (goalId: string, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin ? eq(goals.id, goalId) : and(eq(goals.id, goalId), eq(goals.userId, authorId)); // Si l'utilisateur est admin, il peut récupérer n'importe quel objectif, sinon il ne peut récupérer que ses propres objectifs

            return await db.query.goals.findFirst({
                where: whereClause,
                with: { steps: stepWith } // Joindre les étapes avec leurs sous-étapes et tâches, par exemple drizzle-orm va regarder dans le fichier de relations si goals à bien une relations "steps" pour ensuite trouver le nom correcte du schema associé
            });
        } catch (err: any) {
            logError('GOAL_MODEL_GET_ERROR]', err, "Erreur lors de la récupération de l'objectif", {
                goalId,
                authorId,
                isAdmin
            })
            throw new Error('Erreur lors de la récupération de l\'objectif');
        }
    },

    // * Création d'un nouvel objectif
    create: async (goal: NewGoal) => { // goal équivaut à là base -> req.body
        try {
            return await db.insert(goals).values({
                ...goal,
                userId: goal.userId,
            }).returning(); // On retourne l'objectif créé pour afficher les données au client
        } catch (err: any) {
            logError('GOAL_MODEL_CREATE_ERROR', err, "Erreur lors de la création de l'objectif", {
                id: null,
                authorId: goal.userId,
                isAdmin: null
            })
            throw new Error('Erreur lors de la création de l\'objectif');
        }
    },

    // * Mise à jour d'un objectif
    update: async (goalId: string, data: Partial<Goal>, authorId: string, isAdmin: boolean = false) => { // Partial pour permettre la mise à jour partielle en ts, isAdmin pour modifier en tant qu'admin
        try {
            const whereClause = isAdmin ? eq(goals.id, goalId) : and(eq(goals.id, goalId), eq(goals.userId, authorId)); // Si l'utilisateur est admin, il peut modifier n'importe quel objectif, sinon il ne peut modifier que ses propres objectifs

            return await db.update(goals).set(data).where(whereClause);
        } catch (err: any) {
            logError('GOAL_MODEL_UPDATE_ERROR', err, "Erreur lors de la mise à jour de l'objectif", {
                goalId,
                authorId,
                isAdmin,
                data
            })
            throw new Error('Erreur lors de la mise à jour de l\'objectif');
        }
    },

    // * Suppression d'un objectif
    delete: async (goalId: string, authorId: string, isAdmin: boolean = false) => {
        try {
            const whereClause = isAdmin ? eq(goals.id, goalId) : and(eq(goals.id, goalId), eq(goals.userId, authorId)); // Si l'utilisateur est admin, il peut supprimer n'importe quel objectif, sinon il ne peut supprimer que ses propres objectifs

            return await db.delete(goals).where(whereClause);
        } catch (err: any) {
            logError('GOAL_MODEL_DELETE_ERROR', err, 'Erreur lors de la suppression de l\'objectif', {
                goalId,
                authorId,
                isAdmin,
            })
            throw new Error('Erreur lors de la suppression de l\'objectif');
        }
    }
};
