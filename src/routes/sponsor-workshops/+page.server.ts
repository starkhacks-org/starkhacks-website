import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, 'https://docs.google.com/spreadsheets/d/16HHdzWw6Ae-y3C0nMcHJm2i0V8jFKe71Uvb-gxfsiT4/edit?usp=sharing');
};
