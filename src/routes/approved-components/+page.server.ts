import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, 'https://docs.google.com/spreadsheets/d/1o6GkKyBDuNFcdB9WtbHpwT2VIqe9x9YqHY1S5tVnr6Y/edit?usp=sharing');
};
