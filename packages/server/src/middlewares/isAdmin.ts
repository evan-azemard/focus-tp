import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../utils";

export const isAdmin = (_req: Request, res: Response, next: NextFunction) => {

    const user = res.locals.user.isAdmin;

    if (user === false) {
        return APIResponse(res, 403, "Accès refusé : admin uniquement.");
    }

    next();
}
