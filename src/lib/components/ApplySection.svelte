<script>
	import { onMount } from 'svelte';
	import applyStyles from '../styles/apply.module.css';
	import WeldingSparks from './WeldingSparks.svelte';
	
	let clickSound = null;
	
	onMount(() => {
		clickSound = new Audio('/edr-switch-click-and-beep-001a-11602.mp3');
		clickSound.volume = 0.5;
		clickSound.preload = 'auto';
	});
	
	function handleApplyClick() {
		// Play click sound
		if (clickSound) {
			clickSound.currentTime = 0;
			clickSound.play().catch(() => {});
		}
		// Open apply page in new tab
		window.open('/apply', '_blank');
	}
</script>

<section id="apply" class={applyStyles.apply}>
	<WeldingSparks />
	<div class={applyStyles.content}>
		<div class={applyStyles.textContainer}>
			<h2 class={applyStyles.stopWatching}>Stop Watching</h2>
			<h2 class={applyStyles.startBuilding}>Start Building</h2>
		</div>

		<button class={applyStyles.applyButton} on:click={handleApplyClick}>
			<img src="/apply-box.svg" alt="" class={applyStyles.applyBoxSvg} />
			<span class={applyStyles.applyText}>Apply Now</span>
		</button>
	</div>
</section>

