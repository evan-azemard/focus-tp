// ! Routes pour gérer les sous-étapes : récupération, création, mise à jour et suppression

import { Router } from 'express';
import { substepController } from '../controllers/';

const router = Router();

// * Récupère toutes les sous-étapes d'une étape (paramètre stepId en query)
router.get('/', substepController.getAll);

// * Récupère une sous-étape par son ID
router.get('/:substepId', substepController.getOne);

// * Crée une nouvelle sous-étape
router.post('/', substepController.create);

// * Met à jour une sous-étape existante par son ID
router.put('/:substepId', substepController.update);

// * Supprime une sous-étape par son ID
router.delete('/:substepId', substepController.delete);

export default router;
