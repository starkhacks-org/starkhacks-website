import type { RequestHandler } from './$types';

const site = 'https://starkhacks.com';
const pages = [
	{
		url: '',
		changefreq: 'weekly',
		priority: 1.0
	},
	{
		url: '/apply',
		changefreq: 'monthly',
		priority: 0.9
	}
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `	<url>
		<loc>${site}${page.url}</loc>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

export const GET: RequestHandler = async () => {
	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
