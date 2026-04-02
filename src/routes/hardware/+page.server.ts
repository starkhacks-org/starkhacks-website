import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT50fSbm5cpezmfr8nNH_YQSlisHT0wY-nmjXjgNPAoHIPrVmvf_cw6mWBkaxwDpONW72W2Q-b_J6u6/pubhtml');
};
