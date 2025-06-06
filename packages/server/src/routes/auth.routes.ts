// ! Définition des routes pour l'authentification, l'enregistrement et la déconnexion d'un utilisateur
import { Router } from 'express';
import { authController } from '../controllers';

const router = Router();

// Enregistrement
router.post('/', authController.register );

// Connexion
router.post('/', authController.login );

// Déconnexion
router.post('/', authController.logout );


export default router;