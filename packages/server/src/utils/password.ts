// ! Ce fichier est utilisé pour hashé ou vérifier un mot de passe
import argon2 from 'argon2';
import logger, { logError } from './logger';

// * Hash du password
export const hashPassword = async (password: string) => {
    try {
        const hash = await argon2.hash(password, {
            type: argon2.argon2i,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        })
        logger.info("[UTILS_HASH]", {
            message: "Mot de passe hasché avec succès",
            statusCode: 200,
        });
        return hash;
    } catch (err: any) {
        const msg = "Erreur lors du hashage de mot de passe";
        logError("UTILS_PASSWORD_HASHPASSWORD", new Error(msg), msg);
    }
}

// * Vérification du mot de passe
export const verifyPassword = async (hashedPassword: string, password: string) => {
    try {
        const verify = await argon2.verify(hashedPassword, password);
        logger.info("[UTILS_HASH]", {
            message: "Mot de passe vérifié avec succés",
            statusCode: 200,
        });

        return verify;
    } catch (err: any) {
        const msg = "Erreur lors de la vérification du mot de passe";
        logError("UTILS_PASSWORD_VERIFY-PASSWORD", new Error(msg), msg);
    }
}