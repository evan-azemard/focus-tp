// ! Ce fichier contient le modèle pour gérer les tâches du'une sous-étapes

import { Task, NewTask } from '../entities/Task.entity';
import { db } from '../config/pool';
import { tasks } from '../schemas';
import { and, eq } from 'drizzle-orm';
import { logError } from '../utils/logger';

export const taskModel = {
  // * Récupération de toutes les tâches d'une sous-étape
  getAll: async (substepId: string, authorId: string, isAdmin: boolean = false) => {
    try {
      const whereClause = isAdmin ? eq(tasks.substepId, substepId) : and(eq(tasks.substepId, substepId), eq(tasks.userId, authorId));

      return await db.query.tasks.findMany({
        where: whereClause,
      });
    } catch (err: any) {
      logError('TASK_MODEL_GETALL_ERROR', err, 'Erreur lors de la récupération des tâches', {
        substepId,
        authorId,
        isAdmin,
      });
      throw new Error('Erreur lors de la récupération des tâches');
    }
  },

  // * Récupération d'une tâche spécifique
  get: async (taskId: string, authorId: string, isAdmin: boolean = false) => {
    try {
      const whereClause = isAdmin ? eq(tasks.id, taskId) : and(eq(tasks.id, taskId), eq(tasks.userId, authorId));

      return await db.query.tasks.findFirst({
        where: whereClause,
      });
    } catch (err: any) {
      logError('TASK_MODEL_GET_ERROR', err, 'Erreur lors de la récupération de la tâche', {
        taskId,
        authorId,
        isAdmin,
      });
      throw new Error('Erreur lors de la récupération de la tâche');
    }
  },

  // * Création d’une nouvelle tâche
  create: async (task: NewTask, authorId: string) => {
    try {
      return await db.insert(tasks).values({
        ...task,
        userId: authorId,
      }).returning();
    } catch (err: any) {
      logError('TASK_MODEL_CREATE_ERROR', err, 'Erreur lors de la création de la tâche', {
        task,
        authorId,
      });
      throw new Error('Erreur lors de la création de la tâche');
    }
  },

  // * Mise à jour d'une tâche
  update: async (taskId: string, data: Partial<Task>, authorId: string, isAdmin: boolean = false) => {
    try {
      const whereClause = isAdmin ? eq(tasks.id, taskId) : and(eq(tasks.id, taskId), eq(tasks.userId, authorId));

      return await db.update(tasks).set(data).where(whereClause);
    } catch (err: any) {
      logError('TASK_MODEL_UPDATE_ERROR', err, 'Erreur lors de la mise à jour de la tâche', {
        taskId,
        authorId,
        isAdmin,
        data,
      });
      throw new Error('Erreur lors de la mise à jour de la tâche');
    }
  },

  // * Suppression d'une tâche
  delete: async (taskId: string, authorId: string, isAdmin: boolean = false) => {
    try {
      const whereClause = isAdmin ? eq(tasks.id, taskId) : and(eq(tasks.id, taskId), eq(tasks.userId, authorId));

      return await db.delete(tasks).where(whereClause);
    } catch (err: any) {
      logError('TASK_MODEL_DELETE_ERROR', err, 'Erreur lors de la suppression de la tâche', {
        taskId,
        authorId,
        isAdmin,
      });
      throw new Error('Erreur lors de la suppression de la tâche');
    }
  }
};
