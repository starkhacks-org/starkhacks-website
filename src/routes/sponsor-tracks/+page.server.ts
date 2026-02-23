import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, 'https://docs.google.com/spreadsheets/d/1fBXfhu0Il3EihXlI9VxltAdS5901SV3l-GhNwcpFVZE/edit?usp=sharing');
};
