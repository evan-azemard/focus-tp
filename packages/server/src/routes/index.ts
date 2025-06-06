// Définition des routes de l'application
import { Router } from "express";
import goalRouter from './goals.routes';
import stepRouter from './steps.routes';
import substepRouter from './substeps.routes';
import taskRouter from './tasks.routes';
import userRouter from './users.routes';
import authRouter from './auth.routes';
import { isAuthentificated } from "../middlewares";
const router = Router();

router.use('/goals', isAuthentificated, goalRouter);
router.use('/steps', isAuthentificated, stepRouter);
router.use('/substeps', isAuthentificated, substepRouter);
router.use('/tasks', isAuthentificated, taskRouter);
router.use('/users', isAuthentificated, userRouter);
router.use('/auth', authRouter);

export default router;