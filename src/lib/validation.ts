import { z } from "zod";

export const taskSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: "La tâche ne peut pas être vide" })
    .max(500, { message: "La tâche doit faire moins de 500 caractères" }),
});

export type TaskInput = z.infer<typeof taskSchema>;
