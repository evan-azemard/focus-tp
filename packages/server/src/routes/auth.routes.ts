// ! Définition des routes pour l'authentification, l'enregistrement et la déconnexion d'un utilisateur
import { Router } from 'express';
import { authController } from '../controllers';

const router = Router();

// Enregistrement
router.post('/register', authController.register );

// Connexion
router.post('/login', authController.login );

// Déconnexion
router.post('/logout', authController.logout );


export default router;