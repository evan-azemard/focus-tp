// ! Controller pour gérer les opérations CRUD sur les étapes

import { Request, Response } from 'express';
import { APIResponse, logError } from '../utils';
import { stepModel } from '../models/steps.model';
import logger from '../utils/logger';

const stepController = {
  // * Récupérer toutes les étapes d'un objectif pour un utilisateur donné
  getAll: async (req: Request, res: Response) => {
    try {
      const goalId = req.query.goalId as string;
      const authorId = res.locals.user.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const steps = await stepModel.getAll(goalId, authorId, isAdmin);
      if (!steps) {
        const msg = "Aucune étape trouvée";
        logError("GETALL_STEPS_NOT_FOUND", new Error(msg), msg);
        return APIResponse(res, null, msg, 404);
      }
      logger.info("[GET_STEPS] Toutes les étapes sont récupérées");
      APIResponse(res, steps, "Toutes les étapes sont récupérées");
    } catch (err: any) {
      logError("GETALL_STEPS_ERROR", err, "Erreur lors de la récupération des étapes");
      APIResponse(res, null, "Erreur lors de la récupération des étapes", 500);
    }
  },

  // * Récupérer une étape par son ID pour l'utilisateur connecté
  get: async (req: Request, res: Response) => {
    try {
      const { stepId } = req.params;
      const authorId = res.locals.user.id;
      const isAdmin = res.locals.user.isAdmin ?? false;

      const step = await stepModel.get(stepId, authorId, isAdmin);
      if (!step) {
        const msg = "Étape non trouvée";
        logError("GET_STEP_NOT_FOUND", new Error(msg), msg, { stepId });
        return APIResponse(res, null, msg, 404);
      }
      logger.info(`[GET_STEP] Étape ${stepId} récupérée`);
      APIResponse(res, step, "Étape récupérée");
    } catch (err: any) {
      logError("GET_STEP_ERROR", err, "Erreur lors de la récupération de l'étape");
      APIResponse(res, null, "Erreur lors de la récupération de l'étape", 500);
    }
  },

  // * Créer une nouvelle étape avec l'utilisateur connecté comme auteur
  create: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const authorId = res.locals.user.id;

      const newStep = await stepModel.create(data, authorId);
      logger.info("[CREATE_STEP] Nouvelle étape créée");
      APIResponse(res, newStep, "Étape créée");
    } catch (err: any) {
      logError("CREATE_STEP_ERROR", err, "Erreur lors de la création de l'étape");
      APIResponse(res, null, "Erreur lors de la création de l'étape", 500);
    }
  },

  // * Mettre à jour une étape
  update: async (req: Request, res: Response) => {
    try {
      const { stepId } = req.params;
      const data = req.body;
      const authorId = res.locals.user.id;
      const isAdmin = res.locals.user.isAdmin ?? false;

      const updated = await stepModel.update(stepId, data, authorId, isAdmin);
      if (!updated) {
        const msg = "La mise à jour de l'étape a échoué";
        logError("UPDATE_STEP_FAIL", new Error(msg), msg, { stepId });
        return APIResponse(res, null, msg, 404);
      }
      logger.info(`[UPDATE_STEP] Étape ${stepId} mise à jour`);
      APIResponse(res, updated, "Étape mise à jour");
    } catch (err: any) {
      logError("UPDATE_STEP_ERROR", err, "Erreur lors de la mise à jour de l'étape");
      APIResponse(res, null, "Erreur lors de la mise à jour de l'étape", 500);
    }
  },

  // * Supprimer une étape (vérification authorId ou admin)
  delete: async (req: Request, res: Response) => {
    try {
      const { stepId } = req.params;
      const authorId = res.locals.user.id;
      const isAdmin = res.locals.user.isAdmin ?? false;

      await stepModel.delete(stepId, authorId, isAdmin);
      logger.info(`[DELETE_STEP] Étape ${stepId} supprimée`);
      APIResponse(res, null, "Étape supprimée");
    } catch (err: any) {
      logError("DELETE_STEP_ERROR", err, "Erreur lors de la suppression de l'étape");
      APIResponse(res, null, "Erreur lors de la suppression de l'étape", 500);
    }
  },
};

export default stepController;
