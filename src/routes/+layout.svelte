<script>
	import '../app.css';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	
	let isLoading = true;
	let isInitialLoad = true;
	let minDisplayTime = 300; // Minimum display time in ms
	let startTime = Date.now();
	let navigationTimeout = null;
	let hideTimeout = null;
	
	const hideLoading = () => {
		if (hideTimeout) {
			clearTimeout(hideTimeout);
		}
		const elapsed = Date.now() - startTime;
		const remaining = Math.max(0, minDisplayTime - elapsed);
		
		hideTimeout = setTimeout(() => {
			isLoading = false;
		}, remaining);
	};
	
	// Structured data for SEO and LLM understanding
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Event",
		"name": "StarkHacks",
		"alternateName": "World's Largest Hardware Hackathon",
		"description": "StarkHacks is the world's largest hardware hackathon, organized by Humanoid Robot Club Purdue at Purdue University. This event will set an official Guinness World Record. Participants will build innovative hardware projects, compete for prizes, and be part of history.",
		"startDate": "2026-04-17T00:00:00-04:00",
		"eventStatus": "https://schema.org/EventScheduled",
		"eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
		"location": {
			"@type": "Place",
			"name": "Purdue University",
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "West Lafayette",
				"addressRegion": "IN",
				"addressCountry": "US",
				"postalCode": "47907"
			},
			"geo": {
				"@type": "GeoCoordinates",
				"latitude": 40.4237,
				"longitude": -86.9212
			}
		},
		"organizer": {
			"@type": "Organization",
			"name": "Humanoid Robot Club Purdue",
			"url": "https://starkhacks.com"
		},
		"offers": {
			"@type": "Offer",
			"availability": "https://schema.org/InStock",
			"price": "0",
			"priceCurrency": "USD"
		},
		"audience": {
			"@type": "Audience",
			"audienceType": "Students, Engineers, Hardware Enthusiasts, Makers"
		},
		"keywords": "hardware hackathon, world's largest hackathon, Guinness World Record, Purdue University, robotics, hardware innovation, embedded systems, IoT, hardware competition, maker event",
		"award": "Guinness World Record - World's Largest Hardware Hackathon"
	};
	
	onMount(() => {
		// Handle initial page load
		const handleLoad = () => {
			isInitialLoad = false;
			hideLoading();
		};
		
		// Check if page is already loaded
		if (document.readyState === 'complete') {
			// Small delay to ensure smooth transition
			setTimeout(handleLoad, 100);
		} else {
			window.addEventListener('load', handleLoad);
		}
		
		// Monitor navigation for slow loads
		const unsubscribe = navigating.subscribe((nav) => {
			if (nav) {
				// Navigation started - show loading if it takes too long
				if (navigationTimeout) {
					clearTimeout(navigationTimeout);
				}
				startTime = Date.now();
				navigationTimeout = setTimeout(() => {
					if (!isInitialLoad) {
						isLoading = true;
					}
				}, 200); // Show loading if navigation takes more than 200ms
			} else {
				// Navigation completed
				if (navigationTimeout) {
					clearTimeout(navigationTimeout);
				}
				if (!isInitialLoad) {
					hideLoading();
				}
			}
		});
		
		return () => {
			window.removeEventListener('load', handleLoad);
			unsubscribe();
			if (navigationTimeout) {
				clearTimeout(navigationTimeout);
			}
			if (hideTimeout) {
				clearTimeout(hideTimeout);
			}
		};
	});
</script>

<svelte:head>
	<script type="application/ld+json">
		{JSON.stringify(structuredData)}
	</script>
</svelte:head>

<LoadingScreen visible={isLoading} />

<slot />

<style>
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: 100px;
	}

	@media (max-width: 768px) {
		:global(html) {
			scroll-padding-top: 0;
		}
	}
</style>

