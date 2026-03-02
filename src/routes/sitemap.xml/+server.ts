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
	},
	{
		url: '/volunteer',
		changefreq: 'monthly',
		priority: 0.9
	},
	{
		url: '/volunteers',
		changefreq: 'monthly',
		priority: 0.9
	},
	{
		url: '/mentors-judges',
		changefreq: 'monthly',
		priority: 0.9
	},
	{
		url: '/mentor-judges',
		changefreq: 'monthly',
		priority: 0.9
	},
	{
		url: '/judges-mentors',
		changefreq: 'monthly',
		priority: 0.9
	},
	{
		url: '/sponsorship-guide',
		changefreq: 'monthly',
		priority: 0.8
	},
	{
		url: '/policies',
		changefreq: 'monthly',
		priority: 0.6
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
