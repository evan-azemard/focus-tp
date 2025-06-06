// ! Contrôleur assurant la gestion des objectifs utilisateur : création, lecture, mise à jour, suppression.

import { Request, Response } from 'express';
import { goalModel } from '../models/goals.model';
import { APIResponse, logError } from '../utils';
import logger from '../utils/logger';

const goalController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const goals = await goalModel.getAll(authorId, isAdmin);

      if (!goals) {
        const msg = "La récupération des objectifs a échoué";
        logError("GETALL_CONTROLLERS_GOALS_FAIL", new Error(msg), msg, { authorId, isAdmin });
        return APIResponse(res, null, msg, 404);
      }

      logger.log("[GET_CONTROLLERS_GOALS]", "Objectifs récupérés avec succès");
      APIResponse(res, goals, "ok");
    } catch (err: any) {
      logError("GETALL_CONTROLLERS_GOALS_ERROR", err, "Erreur lors de la récupération des objectifs");
      APIResponse(res, null, "Erreur lors de la récupération des objectifs", 500);
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      const { goalId } = req.params;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const goal = await goalModel.get(goalId, authorId, isAdmin);

      if (!goal) {
        const msg = "Objectif non trouvé";
        logError("GET_CONTROLLERS_GOALS_NOT_FOUND", new Error(msg), msg, { goalId, authorId });
        return APIResponse(res, null, msg, 404);
      }

      logger.log("[GET_CONTROLLERS_GOALS]", "Objectif récupéré");
      APIResponse(res, goal, "Objectif récupéré");
    } catch (err: any) {
      logError("GET_CONTROLLERS_GOALS_ERROR", err, "Erreur lors de la récupération de l'objectif");
      APIResponse(res, null, "Erreur lors de la récupération de l'objectif", 500);
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const authorId = res.locals.user?.id;
      const data = req.body;

      const createdGoal = await goalModel.create(data, authorId);

      logger.log("[POST_CONTROLLERS_GOALS]", "Objectif créé");
      APIResponse(res, createdGoal, "Objectif créé");
    } catch (err: any) {
      logError("POST_CONTROLLERS_GOALS_ERROR", err, "Erreur lors de la création de l'objectif");
      APIResponse(res, null, "Erreur lors de la création de l'objectif", 500);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { goalId } = req.params;
      const data = req.body;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const updated = await goalModel.update(goalId, data, authorId, isAdmin);

      if (!updated) {
        const msg = "La mise à jour de l'objectif a échoué";
        logError("PUT_CONTROLLERS_GOALS_FAIL", new Error(msg), msg, { goalId });
        return APIResponse(res, null, msg, 404);
      }

      logger.log("[PUT_CONTROLLERS_GOALS]", "Objectif mis à jour");
      APIResponse(res, updated, "Objectif mis à jour");
    } catch (err: any) {
      logError("PUT_CONTROLLERS_GOALS_ERROR", err, "Erreur lors de la mise à jour de l'objectif");
      APIResponse(res, null, "Erreur lors de la mise à jour de l'objectif", 500);
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { goalId } = req.params;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      await goalModel.delete(goalId, authorId, isAdmin);

      logger.log("[DELETE_CONTROLLERS_GOALS]", "Objectif supprimé");
      APIResponse(res, null, "Objectif supprimé");
    } catch (err: any) {
      logError("DELETE_CONTROLLERS_GOALS_ERROR", err, "Erreur lors de la suppression de l'objectif");
      APIResponse(res, null, "Erreur lors de la suppression de l'objectif", 500);
    }
  }
};

export default goalController;
