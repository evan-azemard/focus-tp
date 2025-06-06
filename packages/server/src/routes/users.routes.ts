// ! Définition des routes API pour la gestion des utilisateurs, point d’entrée des requêtes vers le user.controller.
import { Router } from 'express';
import { isAuthentificated, isAdmin} from '../middlewares';
import { userController } from '../controllers';
const router = Router();

// * Récupère la liste de tous les utilisateurs (réservé aux admins)
router.get('/', isAuthentificated, isAdmin, userController.getAll );

// * Récupère un utilisateur précis par son ID
router.get('/:userId', isAuthentificated,  userController.get);

// * Met à jour un utilisateur existant
router.put('/:userId', isAuthentificated,  userController.update);

// * Supprime un utilisateur
router.delete('/:userId', isAuthentificated, userController.delete);

export default router;
