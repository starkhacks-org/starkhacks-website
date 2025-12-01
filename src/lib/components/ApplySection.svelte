<script>
	import applyStyles from '../styles/apply.module.css';
	
	function handleApplyClick() {
		// Open apply page in new tab
		window.open('/apply', '_blank');
	}
</script>

<section id="apply" class={applyStyles.apply}>
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

