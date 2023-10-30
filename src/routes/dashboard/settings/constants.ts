import { z } from 'zod';
export const formSchema = z.object({
	username: z
		.string()
		.min(4, 'Username should be atlest 4 characters long')
		.max(32, 'username should be less than 32')
});
export type FormSchema = typeof formSchema;
