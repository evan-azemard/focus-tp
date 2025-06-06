// ! Définition des routes pour les étapes

import { Router } from 'express';
import stepController from '../controllers/step.controller';

const router = Router();

// * Récupérer toutes les étapes
router.get('/', stepController.getAll);

// * Récupérer une étape par son ID
router.get('/:stepId', stepController.get);

// * Créer une nouvelle étape
router.post('/', stepController.create);

// * Mettre à jour une étape existante
router.put('/:stepId', stepController.update);

// * Supprimer une étape
router.delete('/:stepId', stepController.delete);

export default router;
