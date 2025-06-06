// ! Définition des routes pour les tâches
import { Router } from 'express';
import taskController from '../controllers/task.controller';

const router = Router();
// * Récupérer toutes les tâches (requiert query ?substepId=)
router.get('/', taskController.getAll);       

// * Récupérer une tâche par ID
router.get('/:taskId', taskController.get);     

// * Créer une nouvelle tâche
router.post('/', taskController.create);

// * Mettre à jour une tâche par ID
router.put('/:taskId', taskController.update);   

// * Supprimer une tâche par ID
router.delete('/:taskId', taskController.delete);

export default router;
