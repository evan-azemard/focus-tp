// ? Ce fichier sert à configurer un logger pour l'application
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