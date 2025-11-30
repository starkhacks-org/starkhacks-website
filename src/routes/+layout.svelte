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

<LoadingScreen visible={isLoading} />

<slot />

<style>
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: 100px;
	}
</style>

