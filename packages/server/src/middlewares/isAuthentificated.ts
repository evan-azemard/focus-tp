// ! Permet la vérification de l'authentification d'un utilisateur
import  jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import logger from "../utils/logger";
import { APIResponse } from "../utils";

const { JWT_SECRET } = env;

export const isAuthentificated = (request: Request, response: Response, next: NextFunction) => {
    
    const { accessToken } = request.cookies;

    if (!accessToken) {
        logger.error("[MIDDLEWARES_IS-AUTHENTIFICATED] \n Authentification du jwt impossible");
        return APIResponse(response, null, "Vous devez être connecté", 401);
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET);
        response.locals.user = decoded;
        next();
    } catch (err: any) {
        logger.error("[MIDDLEWARES_IS-AUTHENTIFICATED] \n Token invalide");
        return APIResponse(response, null, "Token invalide", 401);
    }
}