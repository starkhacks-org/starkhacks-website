<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	const GA_ID = import.meta.env.PUBLIC_GA_ID;

	onMount(() => {
		// Only run on client side
		if (!browser || !GA_ID) {
			return;
		}

		// Load Google Analytics script
		const script = document.createElement('script');
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
		document.head.appendChild(script);

		// Initialize gtag
		window.dataLayer = window.dataLayer || [];
		function gtag(...args) {
			window.dataLayer.push(args);
		}
		window.gtag = gtag;
		
		gtag('js', new Date());
		gtag('config', GA_ID, {
			send_page_view: false // We'll handle page views manually for SPA navigation
		});

		// Track initial page view
		gtag('event', 'page_view', {
			page_path: window.location.pathname + window.location.search
		});

		// Track page views on SvelteKit navigation
		const unsubscribe = page.subscribe((pageData) => {
			gtag('event', 'page_view', {
				page_path: pageData.url.pathname + pageData.url.search
			});
		});

		return () => {
			unsubscribe();
		};
	});
</script>

