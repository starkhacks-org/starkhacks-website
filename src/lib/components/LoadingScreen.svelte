<script>
	import loadingStyles from '../styles/loading.module.css';
	import { onMount } from 'svelte';

	export let visible = true;
	
	let isHiding = false;
	let shouldRender = visible;
	
	$: if (!visible && shouldRender) {
		isHiding = true;
		// Wait for fade-out animation to complete before removing from DOM
		setTimeout(() => {
			shouldRender = false;
		}, 400); // Match transition duration
	}
	
	$: if (visible && !shouldRender) {
		shouldRender = true;
		isHiding = false;
	}
</script>

{#if shouldRender}
	<div class={loadingStyles.loadingScreen} class:hiding={isHiding}>
		<div class={loadingStyles.content}>
			<img 
				src="/StarkHacks.svg" 
				alt="StarkHacks" 
				class={loadingStyles.logo}
			/>
			<div class={loadingStyles.spinner}></div>
		</div>
	</div>
{/if}

