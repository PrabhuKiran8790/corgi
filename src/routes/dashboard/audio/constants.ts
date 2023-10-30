import { z } from 'zod';

export const AudioSchema = z.object({
	prompt: z.string().min(5, 'Prompt must be at least 5 characters long')
});

export type AudioSchemaType = typeof AudioSchema;
