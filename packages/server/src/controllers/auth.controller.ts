// ! Ce fichier permet l'authentification, l'enregistrement et la déconnexion d'un utilisateur
import { Request, response, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { hashPassword, logError, verifyPassword } from '../utils';
import { userModel } from '../models/users.model';
import { APIResponse } from '../utils';
import logger from '../utils/logger';
import { z } from 'zod';
import { userRegisterValidation } from '../validations';
const { JWT_SECRET, NODE_ENV } = env;

const authController = {

    login: async (request: Request, response: Response) => {
        try {
            // * Vérification si l'email est enregistré
            const { email, password } = request.body;
            const [user] = await userModel.findByCredentials(email);

            if (!user) {
                const msg = "L'email est incorrecte";
                logError("AUTHCONTROLLER_LOGIN_ERROR", new Error(msg), msg);
                return APIResponse(response, null, "Les identifiants sont incorrectes", 400);
            }

            // * Vérification si le password est correcte
            const validPassword = await verifyPassword(user.password, password);

            if (!validPassword) {
                const msg = "Le mot de passe est incorrecte";
                logError("CONTROLLER_AUTH_LOGIN", new Error(msg), msg);
                return APIResponse(response, null, "Les identifiants sont incorrectes", 400);
            }

            // * Génération du jwt avec les informations de l'utilisateur pour les utilisé si besoins
            const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            // * Génération du cookie dans l'en-tête de la response
            response.cookie('accesToken', accessToken, {
                httpOnly: true, // ? true empêche l'accès au cookie via JavaScript
                sameSite: 'strict', // ? 'strict' protège contre les attaques CSRF
                secure: NODE_ENV === "production" // ? true signifie que le cookie ne sera envoyé que sur HTTPS
            });

            logger.info("[CONTROLLERS_AUTH_LOGIN]", {
                message: "Connexion de l'utilisateur réusie",
                statusCode: 200,
            });
            APIResponse(response, null, 'Vous êtes bien connecté', 200);

        } catch (err: any) {
            logError('CONTROLLERS_AUTH_LOGIN', err, "Erreur lors de la connexion de l'utilisateur");
            APIResponse(response, null, "Erreur serveur", 500);
        }
    },

    register: async (request: Request, response: Response) => {
        try {
            const { username, email, password } = userRegisterValidation.parse(request.body);

            // * Vérification de l'email et du password
            const [emailAlreadyExists] = await userModel.findByCredentials(email);
            if (emailAlreadyExists) {
                const msg = "L'email utilisé est dejà utilisé";
                logError('CONTROLLERS_AUTH_REGISTER', new Error(msg), msg)
                return APIResponse(response, null, "Cette adresse email est déjà utilisée", 400);
            }

            const hash = await hashPassword(password);
            if (!hash) {
                const msg = "Un problème est survenu lors du hash";
                logError("CONTROLLERS_AUTH_REGISTER", new Error(msg), msg);
                return APIResponse(response, null, msg, 500);
            }
            // * Création de l'utilisateur
            const [newUser] = await userModel.create({ email, username, password: hash })
            if (!newUser) {
                const msg = "Un problème est survenu lors de la création de l'utilisateur";
                logError("CONTROLLERS_AUTH_REGISTER", new Error(msg), msg);
                return APIResponse(response, null, msg, 500);
            }

            logger.info("[CONTROLLERS_AUTH_REGISTER]", {
                message: "Utilisateur créer avec succès : " + newUser.userId,
                statusCode: 200,
            });
            APIResponse(response, newUser.userId, "Vous êtes inscrit", 200);

        } catch (err: any) {
            if (err instanceof z.ZodError) {
                logError('CONTROLLERS_AUTH_REGISTER_ZOD', err, "Erreur lors de l'inscription de l'utilisateur");
                return APIResponse(response, err.errors, "Le formulaire est invalide", 400);
            }
            logError('CONTROLLERS_AUTH_REGISTER', err, "Erreur lors de l'inscription de l'utilisateur");
            APIResponse(response, null, "Erreur serveur", 500);
        }
    },

    logout: async (request: Request, response: Response) => {
        response.clearCookie("accesToken");
        logger.info("[CONTROLLERS_AUTH_LOGOUT]", {
            message: "Déconnexion réussie",
            statusCode: 200,
        });
        APIResponse(response, null, "Déconnexion réussie", 200)
    }



}

export default authController;