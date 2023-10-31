import { superValidate } from 'sveltekit-superforms/server';
import { formSchema } from './constants';
import { fail, type Actions } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);
		const { user } = await event.locals.getSession();
		if (!form.valid) {
			return fail(400, {
				form,
				status: 'INVALID_FORM'
			});
		}

		if (user?.name === form.data.username) {
			return fail(400, {
				form,
				status: 'SAME_NAME'
			});
		}

		await db
			.update(users)
			.set({
				name: form.data.username
			})
			.where(eq(users.email, user?.email as string));

		return {
			form,
			status: 'SUCCESS'
		};
	}
};
