<script>
	import heroStyles from '../styles/hero.module.css';
	import CountdownTimer from './CountdownTimer.svelte';
</script>

<section class={heroStyles.hero}>
	<img 
		src="/hero-background.jpg" 
		alt="StarkHacks - World's Largest Hardware Hackathon at Purdue University in West Lafayette, Indiana" 
		class={heroStyles.backgroundImage}
	/>
	<div class={heroStyles.centerBox}>
		<img src="/center-box.svg" alt="" class={heroStyles.boxSvg} />
		<div class={heroStyles.content}>
			<div class={heroStyles.titleContainer}>
				<h1 class="sr-only">StarkHacks - Purdue Hardware Hackathon | World's Largest Hardware Hackathon</h1>
				<img src="/stark-hacks-text.svg" alt="StarkHacks - Purdue Hardware Hackathon" class={heroStyles.titleSvg} />
			</div>
			
			<p class={heroStyles.date}>
				<span class={heroStyles.dateSlash}>/</span>
				<span> April 17-19, 2026</span>
			</p>
			
			<div class={heroStyles.countdownWrapper}>
				<img src="/countdown-box.svg" alt="" class={heroStyles.countdownBoxSvg} />
				<div class={heroStyles.countdownContent}>
					<CountdownTimer />
				</div>
			</div>
		</div>
	</div>
</section>

