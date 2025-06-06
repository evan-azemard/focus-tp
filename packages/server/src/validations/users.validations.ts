// ! Ce fichier permet de valider des champs de saisie lors de la création d'un utilisateur
import { z } from "zod";

export const userRegisterValidation = z.object({
    username: z.string()
        .trim()
        .min(3, { message: "Le nom d'utilisateur doit contenir au moins 6 caractères " })
        .max(13, { message: "Le nom d'utilisateur doit contenir maximum 13 caractères" }),
    email: z.string()
        .trim()
        .email({ message: "Adresse email invalide" }),
    password: z.string()
        .trim()
        .min(8, { message: "Votre mot de passe doit contenir au moins 6 caractères" })
        .regex(/[0-9]/, { message: "Votre mot de passe doit contenir au moins un chiffre" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Votre mot de passe doit contenir au moins un caractère spécial" })
});