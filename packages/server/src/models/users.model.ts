// ? Ce fichier contient le modèle pour les utilisateurs, il est utilisé pour interagir avec la base de données.
import { User, NewUser } from '../entities/User.entity';
import { db } from "../config/pool";
import { users } from "../schemas";
import { logError } from '../utils/logger';
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
    // * Pour récupérer tous les utilisateurs, il faut être admin
    getAll: async (isAdmin: boolean = false) => {
        if (!isAdmin) {
            const msg = 'Accès non autorisé à getAll des utilisateurs';
            logError('USER_MODEL_GETALL_UNAUTHORIZED', new Error(msg), msg, { isAdmin });
            throw new Error(msg);
        }
        try {
            return await db.select({ id: users.id, username: users.username }).from(users);
        } catch (err: any) {
            logError('USER_MODEL_GETALL_ERROR', err, 'Erreur lors de la récupération des utilisateurs', { isAdmin });
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }
    },

    // * Pour récupérer un utilisateur par son ID, il faut être admin ou l'utilisateur lui-même
    get: async (userId: string) => {
        try {
            return await db.query.users.findFirst({
                where: eq(users.id, userId),
                columns: { id: true, username: true },
                with: { goals: goalWith }
            });
        } catch (err: any) {
            logError('USER_MODEL_GET_ERROR', err, 'Erreur lors de la récupération de l\'utilisateur', { userId });
            throw new Error('Erreur lors de la récupération de l\'utilisateur');
        }
    },

    // * Pour récupérer un utilisateur par son email et mot de passe, il faut que l'email soit unique
    findByCredentials: async (email: string) => {
        try {
            return await db.select({
                id: users.id,
                username: users.username,
                email: users.email,
                password: users.password,
                registeredAt: users.registeredAt,
                isAdmin: users.isAdmin
            }).from(users).where(eq(users.email, email));
        } catch (err: any) {
            logError('USER_MODEL_FIND_BY_CREDENTIALS_ERROR', err, 'Erreur lors de la récupération de l\'utilisateur par email', { email });
            throw new Error('Erreur lors de la récupération de l\'utilisateur');
        }
    },

    // * Pour créer un nouvel utilisateur, il faut que l'email soit unique
    create: async (user: NewUser) => {
        try {
            return await db.insert(users).values(user).returning({ userId: users.id });
        } catch (err: any) {
            logError('USER_MODEL_CREATE_ERROR', err, 'Erreur lors de la création de l\'utilisateur', { email: user.email });
            throw new Error('Erreur lors de la création des utilisateurs');
        }
    },

    // * Permet de mettre à jour un utilisateur, il faut être admin ou l'utilisateur lui-même
    update: async (userId: string, data: Partial<User>, requesterId: string, isAdmin: boolean = false) => {
        if (!isAdmin && userId !== requesterId) {
            const msg = 'Permission refusée : vous ne pouvez modifier que votre propre profil';
            logError('USER_MODEL_UPDATE_UNAUTHORIZED', new Error(msg), msg, { userId, requesterId, isAdmin });
            throw new Error(msg);
        }
        try {
            return await db.update(users).set(data).where(eq(users.id, userId)).returning({ id: users.id });
        } catch (err: any) {
            logError('USER_MODEL_UPDATE_ERROR', err, 'Erreur lors de la mise à jour de l\'utilisateur', { userId, data });
            throw new Error('Erreur lors de la mise à jour des utilisateurs');
        }
    },


    // * Pour supprimer un utilisateur, il faut être admin ou l'utilisateur lui-même
    delete: async (userId: string, requesterId: string, isAdmin: boolean = false) => {
        if (!isAdmin && requesterId !== userId) {
            const msg = 'Suppression non autorisée';
            logError('USER_MODEL_DELETE_UNAUTHORIZED', new Error(msg), msg, { userId, requesterId, isAdmin });
            throw new Error(msg);
        }
        try {
            return await db.delete(users).where(eq(users.id, userId));
        } catch (err: any) {
            logError('USER_MODEL_DELETE_ERROR', err, 'Erreur lors de la suppression de l\'utilisateur', { userId });
            throw new Error('Erreur lors de la suppression des utilisateurs');
        }
    }
};
