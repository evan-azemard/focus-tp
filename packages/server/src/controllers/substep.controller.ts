// ! Contrôleur assurant la gestion des sous-étapes : création, lecture, mise à jour, suppression.

import { Request, Response } from 'express';
import { substepModel } from '../models/substeps.model';
import { APIResponse, logError } from '../utils';
import logger from '../utils/logger';

const substepController = {
  // * Récupère toutes les sous-étapes liées à une étape étape
  getAll: async (req: Request, res: Response) => {
    try {
      const { stepId } = req.params;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const substeps = await substepModel.getAll(stepId, authorId, isAdmin);

      if (!substeps) {
        const msg = "La récupération des sous-étapes a échoué";
        logError("GETALL_CONTROLLERS_SUBSTEPS_FAIL", new Error(msg), msg, { stepId, authorId, isAdmin });
        return APIResponse(res, null, msg, 404);
      }

      logger.log("[GET_CONTROLLERS_SUBSTEPS]", "Sous-étapes récupérées avec succès");
      APIResponse(res, substeps, "Sous-étapes récupérées avec succès");
    } catch (err: any) {
      logError("GETALL_CONTROLLERS_SUBSTEPS_ERROR", err, "Erreur lors de la récupération des sous-étapes");
      APIResponse(res, null, "Erreur lors de la récupération des sous-étapes", 500);
    }
  },

  // * Récupère une sous-étape précise par son ID
  get: async (req: Request, res: Response) => {
    try {
      const { substepId } = req.params;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const substep = await substepModel.get(substepId, authorId, isAdmin);

      if (!substep) {
        const msg = "Sous-étape non trouvée";
        logError("GET_CONTROLLERS_SUBSTEPS_NOT_FOUND", new Error(msg), msg, { substepId, authorId });
        return APIResponse(res, null, msg, 404);
      }

      logger.log("[GET_CONTROLLERS_SUBSTEPS]", "Sous-étape récupérée");
      APIResponse(res, substep, "Sous-étape récupérée");
    } catch (err: any) {
      logError("GET_CONTROLLERS_SUBSTEPS_ERROR", err, "Erreur lors de la récupération de la sous-étape");
      APIResponse(res, null, "Erreur lors de la récupération de la sous-étape", 500);
    }
  },

  // * Crée une nouvelle sous-étape
  create: async (req: Request, res: Response) => {
    try {
      const authorId = res.locals.user?.id;
      const data = req.body;

      const createdSubstep = await substepModel.create(data, authorId);

      logger.log("[POST_CONTROLLERS_SUBSTEPS]", "Sous-étape créée");
      APIResponse(res, createdSubstep, "Sous-étape créée");
    } catch (err: any) {
      logError("POST_CONTROLLERS_SUBSTEPS_ERROR", err, "Erreur lors de la création de la sous-étape");
      APIResponse(res, null, "Erreur lors de la création de la sous-étape", 500);
    }
  },

  // * Met à jour une sous-étape existante
  update: async (req: Request, res: Response) => {
    try {
      const { substepId } = req.params;
      const data = req.body;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      const updated = await substepModel.update(substepId, data, authorId, isAdmin);

      if (!updated) {
        const msg = "La mise à jour de la sous-étape a échoué";
        logError("PUT_CONTROLLERS_SUBSTEPS_FAIL", new Error(msg), msg, { substepId });
        return APIResponse(res, null, msg, 404);
      }

      logger.log("[PUT_CONTROLLERS_SUBSTEPS]", "Sous-étape mise à jour");
      APIResponse(res, updated, "Sous-étape mise à jour");
    } catch (err: any) {
      logError("PUT_CONTROLLERS_SUBSTEPS_ERROR", err, "Erreur lors de la mise à jour de la sous-étape");
      APIResponse(res, null, "Erreur lors de la mise à jour de la sous-étape", 500);
    }
  },

  // * Supprime une sous-étape par son ID
  delete: async (req: Request, res: Response) => {
    try {
      const { substepId } = req.params;
      const authorId = res.locals.user?.id;
      const isAdmin = res.locals.isAdmin ?? false;

      await substepModel.delete(substepId, authorId, isAdmin);

      logger.log("[DELETE_CONTROLLERS_SUBSTEPS]", "Sous-étape supprimée");
      APIResponse(res, null, "Sous-étape supprimée");
    } catch (err: any) {
      logError("DELETE_CONTROLLERS_SUBSTEPS_ERROR", err, "Erreur lors de la suppression de la sous-étape");
      APIResponse(res, null, "Erreur lors de la suppression de la sous-étape", 500);
    }
  }
};

export default substepController;
