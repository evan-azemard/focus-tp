import { z } from "zod";

export const goalCreatedValidation = z.object({
  title: z.string()
    .max(255, { message: "Le titre ne doit pas dépasser 255 caractères." }),
  description: z.string()
    .max(255, { message: "La description ne doit pas dépasser 255 caractères." })
    .optional(),
  difficulty: z.number()
    .int({ message: "La difficulté doit être un nombre entier." }),
  status: z.string()
    .max(255, { message: "Le statut ne doit pas dépasser 255 caractères." }),
  startDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: "La date de début doit être une date valide." }),
  dueDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), { message: "La date d'échéance doit être une date valide." }),
});
