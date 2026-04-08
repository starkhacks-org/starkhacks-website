import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, 'https://forms.gle/9o2uuV2WLLLuGxwV7');
};
