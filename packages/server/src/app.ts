// ? Ce fichier est le point d'entrée de l'application Express
import express, { Request, Response, NextFunction} from "express";
import cors from "cors";
import { env } from "./config/env";
import router from "./routes/index"; // Importation du routeur principal
import cookieParser from "cookie-parser";

const app = express();
const { PORT, ORIGIN } = env;

app.use(cors({
    origin: ORIGIN, // Permet de définir l'origine autorisée pour les requêtes CORS
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    credentials: true, // Autorise les cookies et les en-têtes d'authentification
}))
app.use(cookieParser()); // Pour parser les cookies dans les requêtes entrantes
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Pour parser les données URL-encodées

app.use('/', router);

app.listen(PORT, () => {
    console.log('Le serveur est en écoute sur le port', PORT);
});

