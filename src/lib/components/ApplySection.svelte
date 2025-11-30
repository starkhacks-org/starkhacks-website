<script>
	import applyStyles from '../styles/apply.module.css';
	import { getApplyUrl } from '../utils/applyRedirect';
	import { goto } from '$app/navigation';
	
	function handleApplyClick() {
		goto(getApplyUrl());
	}
</script>

<section class={applyStyles.apply}>
	<div class={applyStyles.content}>
		<div class={applyStyles.textContainer}>
			<p class={applyStyles.stopWatching}>STOP WATCHING.</p>
			<p class={applyStyles.startBuilding}>START BUILDING.</p>
		</div>
		<button class={applyStyles.applyButton} on:click={handleApplyClick}>
			<img src="/apply-box.svg" alt="" class={applyStyles.applyBoxSvg} />
			<span class={applyStyles.applyText}>Apply Now</span>
		</button>
	</div>
</section>

