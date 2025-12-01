<script>
	import applyStyles from '../styles/apply.module.css';
	
	function handleApplyClick() {
		// Open apply page in new tab
		window.open('https://starkhacks.com/apply', '_blank');
	}
</script>

<section id="apply" class={applyStyles.apply}>
	<div class={applyStyles.content}>
		<button class={applyStyles.applyButton} on:click={handleApplyClick}>
			<img src="/apply-box.svg" alt="" class={applyStyles.applyBoxSvg} />
			<span class={applyStyles.applyText}>Apply Now</span>
		</button>
	</div>
</section>

