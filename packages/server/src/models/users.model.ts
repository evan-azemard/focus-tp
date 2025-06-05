// ? Ce fichier contient le modèle pour les utilisateurs, il est utilisé pour interagir avec la base de données.
import { User, NewUser } from '../entities/User.entity';
import { db } from "../config/pool";
import { users } from "../schemas";
import logger from '../utils/logger';
import { eq } from 'drizzle-orm';


// Création de l'objet qui contient les relations pour les relations imbriquées
const taskWith = {
  columns: { id: true, title: true, description: true, substepId: true, dueDate: true, status: true, createdAt: true, updatedAt: true }
};

const substepWith = {
  columns: { id: true, title: true, description: true, stepId: true, dueDate: true, status: true, createdAt: true, updatedAt: true },
  with: { tasks: taskWith }
};

const stepWith = {
  columns: { id: true, title: true, description: true, goalId: true, dueDate: true, status: true, createdAt: true, updatedAt: true },
  with: { substeps: substepWith }
};

const goalWith = {
  columns: { id: true, title: true, description: true, userId: true, dueDate: true, status: true, createdAt: true, updatedAt: true, startDate: true, difficulty: true },
  with: { steps: stepWith }
};

export const userModel = {
    getAll: () => {
        try {
            return db.select({
                id: users.id,
                username: users.username
            }).from(users);
        } catch (err: any) {
            logger.error(`Erreur lors de la récupération des utilisateurs : ${err.message}`);
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }
    },
    get: (id: string) => {
        try {
            return db.query.users.findFirst({
                where: eq(users.id, id),
                columns: {
                    id: true,
                    username: true,
                },
                with: { goals: goalWith}

            })
        } catch (err: any) {
            logger.error(`Erreur lors de la récupération de l'utilisateur : ${err.message}`);
            throw new Error('Erreur lors de la récupération de l\'utilisateur');
        }
    },
    findByCredentials: (email: string) => {
        try {
            return db.select({
                id: users.id,
                username: users.username,
                email: users.email,
                password: users.password,
                registeredAt: users.registeredAt,
            }).from(users).where(eq(users.email, email))
        } catch (err: any) {
            logger.error(`Erreur lors de la récupération de l'utilisateur : ${err.message}`);
            throw new Error('Erreur lors de la récupération de l\'utilisateur');
        }
    },
    create: (user: NewUser) => {
        try {
            return db.insert(users).values(user).returning({ id: users.id });
        } catch (err: any) {
            logger.error(`Erreur lors de la création des utilisateurs : ${err.message}`);
            throw new Error('Erreur lors de la création des utilisateurs');
        }
    },
    delete: (id: string) => {
        try {
            return db.delete(users).where(eq(users.id, id))
        } catch (err: any) {
            logger.error(`Erreur lors de la suppression des utilisateurs : ${err.message}`);
            throw new Error('Erreur lors de la suppression des utilisateurs');
        }
    }
}