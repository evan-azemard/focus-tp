// ! Contrôleur gérant les tâches liées aux sous-étapes : CRUD complet

import { Request, Response } from 'express';
import { taskModel } from '../models/tasks.model';
import { APIResponse, logError } from '../utils';
import logger from '../utils/logger';

const taskController = {
  // * Récupère toutes les tâches d'une sous-étape donnée
  getAll: async (req: Request, res: Response) => {
    try {
      const { substepId } = req.query;

      // TODO zod
      if (!substepId || typeof substepId !== 'string') {
        return APIResponse(res, null, "L'ID de la sous-étape est requis", 400);
      }

      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const tasks = await taskModel.getAll(substepId, authorId, isAdmin);

      logger.log("[GET_CONTROLLERS_TASKS]", "Tâches récupérées");
      APIResponse(res, tasks, "Tâches récupérées");
    } catch (err: any) {
      logError("GET_CONTROLLERS_TASKS_ERROR", err, "Erreur lors de la récupération des tâches");
      APIResponse(res, null, "Erreur lors de la récupération des tâches", 500);
    }
  },

  // * Récupère une tâche précise par son ID
  get: async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const task = await taskModel.get(taskId, authorId, isAdmin);

      if (!task) {
        const msg = "Tâche non trouvée";
        logError("GET_CONTROLLERS_TASKS_NOT_FOUND", new Error(msg), msg, { taskId });
        return APIResponse(res, null, msg, 404);
      }

      logger.log("[GET_CONTROLLERS_TASKS]", "Tâche récupérée");
      APIResponse(res, task, "Tâche récupérée");
    } catch (err: any) {
      logError("GET_CONTROLLERS_TASKS_ERROR", err, "Erreur lors de la récupération de la tâche");
      APIResponse(res, null, "Erreur lors de la récupération de la tâche", 500);
    }
  },

  // * Crée une nouvelle tâche
  create: async (req: Request, res: Response) => {
    try {
      const authorId = res.locals.user?.id;
      const data = req.body;

      const createdTask = await taskModel.create(data, authorId);

      logger.log("[POST_CONTROLLERS_TASKS]", "Tâche créée");
      APIResponse(res, createdTask, "Tâche créée");
    } catch (err: any) {
      logError("POST_CONTROLLERS_TASKS_ERROR", err, "Erreur lors de la création de la tâche");
      APIResponse(res, null, "Erreur lors de la création de la tâche", 500);
    }
  },

  // * Met à jour une tâche existante
  update: async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const data = req.body;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const updated = await taskModel.update(taskId, data, authorId, isAdmin);

      if (!updated) {
        const msg = "La mise à jour de la tâche a échoué";
        logError("PUT_CONTROLLERS_TASKS_FAIL", new Error(msg), msg, { taskId });
        return APIResponse(res, null, msg, 404);
      }

      logger.log("[PUT_CONTROLLERS_TASKS]", "Tâche mise à jour");
      APIResponse(res, updated, "Tâche mise à jour");
    } catch (err: any) {
      logError("PUT_CONTROLLERS_TASKS_ERROR", err, "Erreur lors de la mise à jour de la tâche");
      APIResponse(res, null, "Erreur lors de la mise à jour de la tâche", 500);
    }
  },

  // * Supprime une tâche par son ID
  delete: async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      await taskModel.delete(taskId, authorId, isAdmin);

      logger.log("[DELETE_CONTROLLERS_TASKS]", "Tâche supprimée");
      APIResponse(res, null, "Tâche supprimée");
    } catch (err: any) {
      logError("DELETE_CONTROLLERS_TASKS_ERROR", err, "Erreur lors de la suppression de la tâche");
      APIResponse(res, null, "Erreur lors de la suppression de la tâche", 500);
    }
  }
};

export default taskController;
