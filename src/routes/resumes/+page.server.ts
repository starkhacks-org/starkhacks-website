import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, 'https://purdue0-my.sharepoint.com/:f:/g/personal/humanoid_purdue_edu/IgBk4x8Ne5dqTZig2x4ajTslAeMXdhvG5RkqpWiuKdXGM88?e=9Ga0qv');
};
