<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import errorStyles from '$lib/styles/error.module.css';
	import { goto } from '$app/navigation';
	
	// Error object is automatically provided by SvelteKit
	export let error;
	export let status;
	
	// For 404, status might be 404 or error.status might be 404
	const is404 = status === 404 || error?.status === 404;
	
	function goHome() {
		goto('/');
	}
</script>

<svelte:head>
	<title>{is404 ? '404 - Page Not Found' : 'Error'} | StarkHacks 2026</title>
	<meta name="description" content="Page not found. Return to StarkHacks 2026 homepage." />
</svelte:head>

<Navigation />
<div class={errorStyles.errorWrapper}>
	<div class={errorStyles.content}>
		<div class={errorStyles.centerBox}>
			<img src="/center-box.svg" alt="" class={errorStyles.boxSvg} />
			<div class={errorStyles.innerContent}>
				<h1 class={errorStyles.errorCode}>
					{is404 ? '404' : status || error?.status || 'Error'}
				</h1>
				<p class={errorStyles.errorMessage}>
					{is404 ? 'Page Not Found' : error?.message || 'Something went wrong'}
				</p>
				<p class={errorStyles.description}>
					{is404 
						? 'The page you\'re looking for doesn\'t exist or has been moved.' 
						: 'An unexpected error occurred. Please try again.'}
				</p>
				<button class={errorStyles.homeButton} on:click={goHome}>
					<img src="/apply-box.svg" alt="" class={errorStyles.buttonBoxSvg} />
					<span class={errorStyles.buttonText}>Go Home</span>
				</button>
			</div>
		</div>
	</div>
	<Footer />
</div>

