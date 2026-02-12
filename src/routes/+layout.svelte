<script>
	import '../app.css';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	
	let isLoading = false;
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
	// Organization with social media links (sameAs)
	const organizationData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": "https://starkhacks.com/#organization",
		"name": "StarkHacks",
		"alternateName": "Humanoid Robot Club Purdue",
		"url": "https://starkhacks.com",
		"logo": "https://starkhacks.com/StarkHacks.svg",
		"sameAs": [
			"https://x.com/HumanoidPurdue",
			"https://www.linkedin.com/company/starkhacks/",
			"https://www.instagram.com/humanoid.purdue/"
		]
	};

	// WebSite with potentialAction for application form
	const websiteData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": "https://starkhacks.com/#website",
		"url": "https://starkhacks.com",
		"name": "StarkHacks",
		"description": "World's largest hardware hackathon at Purdue University",
		"publisher": {
			"@id": "https://starkhacks.com/#organization"
		},
		"potentialAction": {
			"@type": "ApplyAction",
			"target": {
				"@type": "EntryPoint",
				"urlTemplate": "https://starkhacks.com/apply",
				"actionPlatform": [
					"http://schema.org/DesktopWebPlatform",
					"http://schema.org/MobileWebPlatform"
				]
			},
			"name": "Apply to StarkHacks"
		}
	};

	// SiteNavigationElement for navigation structure
	const navigationData = {
		"@context": "https://schema.org",
		"@type": "SiteNavigationElement",
		"@id": "https://starkhacks.com/#navigation",
		"name": "Main Navigation",
		"hasPart": [
			{
				"@type": "WebPageElement",
				"name": "About",
				"url": "https://starkhacks.com/#about"
			},
			{
				"@type": "WebPageElement",
				"name": "Tracks",
				"url": "https://starkhacks.com/#tracks"
			},
			{
				"@type": "WebPageElement",
				"name": "Speakers",
				"url": "https://starkhacks.com/#speakers"
			},
			{
				"@type": "WebPageElement",
				"name": "Sponsors",
				"url": "https://starkhacks.com/#sponsors"
			},
			{
				"@type": "WebPageElement",
				"name": "FAQ",
				"url": "https://starkhacks.com/#faq"
			},
			{
				"@type": "WebPageElement",
				"name": "Apply",
				"url": "https://starkhacks.com/apply"
			}
		]
	};

	// Event structured data (updated to reference Organization)
	const eventData = {
		"@context": "https://schema.org",
		"@type": "Event",
		"name": "StarkHacks - Purdue Hardware Hackathon",
		"alternateName": ["World's Largest Hardware Hackathon", "Purdue Hardware Hackathon", "Indiana Hardware Hackathon"],
		"description": "StarkHacks is the world's largest hardware hackathon and the premier Purdue hardware hackathon, organized by Humanoid Robot Club Purdue at Purdue University in West Lafayette, Indiana. This Indiana hardware hackathon will set an official Guinness World Record. Participants will build innovative hardware projects, compete for $100,000 in prizes, and be part of history at this Purdue hackathon.",
		"startDate": "2026-04-17T00:00:00-04:00",
		"endDate": "2026-04-19T23:59:59-04:00",
		"eventStatus": "https://schema.org/EventScheduled",
		"eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
		"location": {
			"@type": "Place",
			"name": "Purdue University",
			"address": {
				"@type": "PostalAddress",
				"streetAddress": "Purdue University",
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
			"@id": "https://starkhacks.com/#organization"
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
		"keywords": "hardware hackathon, purdue hardware hackathon, purdue hackathon, world's largest hardware hackathon, indiana hardware hackathon, hardware hackathon purdue, purdue university hackathon, hardware hackathon indiana, world's largest hackathon, Guinness World Record, Purdue University, West Lafayette, Indiana, Humanoid Robot Club Purdue, robotics hackathon, hardware innovation, embedded systems, IoT, hardware competition, maker event, purdue robotics hackathon, indiana hackathon",
		"award": "Guinness World Record - World's Largest Hardware Hackathon",
		"about": {
			"@type": "Thing",
			"name": "Hardware Hackathon",
			"description": "A hardware hackathon is an event where participants build physical hardware projects, combining software and electronics to create innovative solutions."
		}
	};
	
	onMount(() => {
		// Lamp intro (inside +page.svelte) handles the initial page reveal.
		// Listen for its completion via window event.
		function onLampComplete() {
			isLoading = false;
			isInitialLoad = false;
		}
		window.addEventListener('lamp-intro-complete', onLampComplete);

		// Handle initial page load (fallback for non-home pages)
		const handleLoad = () => {
			// Only auto-hide if lamp intro hasn't taken over
			setTimeout(() => {
				if (isInitialLoad) {
					isInitialLoad = false;
					hideLoading();
				}
			}, 3500); // Fallback: if lamp intro doesn't fire within 3.5s
		};
		
		// Check if page is already loaded
		if (document.readyState === 'complete') {
			setTimeout(handleLoad, 100);
		} else {
			window.addEventListener('load', handleLoad);
		}
		
		// Monitor navigation for slow loads (after initial load)
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
				}, 200);
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
			window.removeEventListener('lamp-intro-complete', onLampComplete);
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
	{@html `<script type="application/ld+json">${JSON.stringify(organizationData)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(websiteData)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(navigationData)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(eventData)}</script>`}
</svelte:head>

<LoadingScreen visible={isLoading} />

<GoogleAnalytics />

<slot />

<style>
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: 100px;
	}

	@media (max-width: 768px) {
		:global(html) {
			scroll-padding-top: 70px;
		}
	}
</style>

