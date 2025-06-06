// ! Contrôleur gérant les opérations CRUD sur les utilisateurs (récupération, modification, suppression).
import { Request, Response } from 'express';
import { APIResponse, logError } from '../utils';
import { userModel } from '../models/users.model';
import logger from '../utils/logger';

const userController = {
    // * Récupérer un utilisateur
    get: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            logger.info("[USER][GET] Récupération de l'utilisateur ID:", id);

            const user = await userModel.get(id);

            if (!user) {
                const msg = "Aucun utilisateur trouvé avec cet ID";
                logError("USER_GET_NOT_FOUND", new Error(msg), msg, { id });
                return APIResponse(res, null, msg, 404);
            }

            logger.info("[USER][GET] Utilisateur récupéré avec succès");
            return APIResponse(res, user, "OK");
        } catch (err: any) {
            logError("USER_GET_ERROR", err, "Erreur lors de la récupération de l'utilisateur");
            return APIResponse(res, null, "Erreur lors de la récupération de l'utilisateur", 500);
        }
    },
    // * Récupération de la liste des utilisateurs
    getAll: async (_req: Request, res: Response) => {
        try {
            const isAdmin = res.locals.user?.isAdmin;

            if (!isAdmin) {
                const msg = "Accès non autorisé à la liste des utilisateurs";
                logError("USER_GETALL_UNAUTHORIZED", new Error(msg), msg);
                return APIResponse(res, null, msg, 403);
            }

            const users = await userModel.getAll(isAdmin);

            if (!users || users.length === 0) {
                const msg = "Aucun utilisateur trouvé";
                logError("USER_GETALL_NOT_FOUND", new Error(msg), msg);
                return APIResponse(res, null, msg, 404);
            }

            logger.info("[USER][GET_ALL] Utilisateurs récupérés avec succès");
            return APIResponse(res, users, "Utilisateurs récupérés avec succès");
        } catch (err: any) {
            logError("USER_GETALL_ERROR", err, "Erreur lors de la récupération des utilisateurs");
            return APIResponse(res, null, "Erreur lors de la récupération des utilisateurs", 500);
        }
    },
    // * Mis à jour d'un utilisateur
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const requesterId = res.locals.user?.id;
            const isAdmin = res.locals.user?.isAdmin;

            const updated = await userModel.update(id, data, requesterId, isAdmin);

            if (!updated) {
                const msg = "Mise à jour de l'utilisateur échouée";
                logError("USER_UPDATE_FAILED", new Error(msg), msg, { id });
                return APIResponse(res, null, msg, 404);
            }

            logger.info("[USER][UPDATE] Utilisateur mis à jour avec succès");
            return APIResponse(res, updated, "Utilisateur mis à jour");
        } catch (err: any) {
            logError("USER_UPDATE_ERROR", err, "Erreur lors de la modification de l'utilisateur");
            return APIResponse(res, null, "Erreur lors de la modification de l'utilisateur", 500);
        }
    },
    // * Suppréssion d'un utilisateur
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const requesterId = res.locals.user?.id;
            const isAdmin = res.locals.user?.isAdmin;

            await userModel.delete(id, requesterId, isAdmin);

            logger.info("[USER][DELETE] Utilisateur supprimé avec succès");
            return APIResponse(res, null, "Utilisateur supprimé");
        } catch (err: any) {
            logError("USER_DELETE_ERROR", err, "Erreur lors de la suppression de l'utilisateur");
            return APIResponse(res, null, "Erreur lors de la suppression de l'utilisateur", 500);
        }
    },
};

export default userController;
