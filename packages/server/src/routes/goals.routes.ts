// ! Définition des routes API liées aux objectifs, point d’entrée des requêtes vers le goal.controller.
import { Router } from 'express';
import goalController from '../controllers/goal.controller';

const router = Router();

// * Récupère tous les objectifs de l'utilisateur
router.get('/', goalController.getAll);

// * Récupère un objectif précis par son ID (contrôle d'accès)
router.get('/:goalId', goalController.get);

// * Crée un nouvel objectif pour l'utilisateur connecté
router.post('/', goalController.create);

// * Met à jour un objectif existant
router.put('/:goalId', goalController.update);

// * Supprime un objectif 
router.delete('/:goalId', goalController.delete);

export default router;
