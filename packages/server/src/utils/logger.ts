// ! Ce fichier sert à configurer un logger pour l'application afin d'avoir un suivi des erreurs comprenant les erreurs sensibles de drizzle qui ne doivent pas être exposées à l'utilisateur final, mais qui doivent être enregistrées pour le développeur. 
// ! J'utilise la bibliothèque winston pour gérer les logs et les enregistrer dans des fichiers et la console.

import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info", // Niveau de log par défaut
    format: format.combine( // Combinaison de formats
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => { // Format personnalisé pour les logs
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [ // C'est ici que l'on définit où les logs seront envoyés
        new transports.Console(), // Affichage des logs dans la console
        new transports.File({ // Fichier pour les logs d'information
            filename: "logs/error.log", level: 'error'
        }),
        new transports.File({ // Fichier pour les logs combinés
            filename: "logs/combined.log"
        })
    ]
});

export default logger;

// * Helper pour les erreurs liées aux objectifs (Goal)
export function logError(
    title: string,
    err: unknown, // Unknown a la place de any pour forcer une vérification de type
    summary: string,
    details: Record<string, unknown> = {}
) {

    const error = err instanceof Error ? err : new Error(String(err)); // S'assurer que l'erreur est bien une instance d'Error sinon on la transforme en une "véritable" erreur

    logger.error(`[${title}]`, {
        summary,
        errorMessage: error.message,
        stack: error.stack,
        details,
    });
}
