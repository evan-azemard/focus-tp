import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import logger from '../utils/logger';

const { JWT_SECRET, NODE_ENV } = env;

const authController = {

    login: async = (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const [user] = await userModel.findByCredentials(email);
            if (!user) {
                return APIResponse(res, null, "Les identifiants sont incorrectes");
            }

            const validPassword = await verifyPassword(user.password, password);

            if (!validPassword) {
                return APIResponse(res, null, "Les identifiants sont incorrects")
            }
        } catch (error: any) {
            logger.error('Erreur lors de la connexion', error);
            return res.status(500).send('Erreur interne du serveur');

        }


        // TODO création du token JWT

        res.cookie('token', token, { secure: NODE_ENV === "production", httpOnly: true, sameSite: 'Strict' });
        res.status(200).send('Connexion réussie');
    }
}

export default authController;