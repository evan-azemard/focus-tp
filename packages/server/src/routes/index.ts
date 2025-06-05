// Définition des routes de l'application
import {Router } from "express";
import goalRouter from './goals.routes';
import stepRouter from './steps.routes';
import substepRouter from './substeps.routes';
import taskRouter from './tasks.routes';
import userRouter from './users.routes';
const router = Router();

router.use('/goals', goalRouter);
router.use('/steps', stepRouter);
router.use('/substeps', substepRouter);
router.use('/tasks', taskRouter);
router.use('/users', userRouter);

export default router;