<script>
	import heroStyles from '../styles/hero.module.css';
	import CountdownTimer from './CountdownTimer.svelte';
	import ElectricSparks from './ElectricSparks.svelte';
</script>

<section class={heroStyles.hero}>
	<img 
		src="/hero-background.jpg" 
		alt="StarkHacks - World's Largest Hardware Hackathon at Purdue University in West Lafayette, Indiana" 
		class={heroStyles.backgroundImage}
	/>
	<ElectricSparks />
	<div class={heroStyles.centerBox}>
		<img src="/center-box.svg" alt="" class={heroStyles.boxSvg} />
		<div class={heroStyles.content}>
			<div class={heroStyles.titleContainer}>
				<h1 class="sr-only">StarkHacks - World's Largest Hardware Hackathon</h1>
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

	<div class={heroStyles.heroCredits}>
		<p class={heroStyles.organizedBy}>
			organized by
			<a href="https://humanoidrobot.club/" target="_blank" rel="noopener noreferrer" class={heroStyles.creditLink}>
				<img src="/hrc-logo.png" alt="Humanoid Robot Club" class={heroStyles.creditLogo} />
			</a>
		</p>
		<p class={heroStyles.cohostedBy}>
			cohosted by
			<span class={heroStyles.cohostedLogos}>
				<img src="/amd-logo.png" alt="AMD" class={heroStyles.cohostedLogo} />
				<span class={heroStyles.ampersand}>&</span>
				<img src="/ford-logo.png" alt="Ford" class={heroStyles.cohostedLogo} />
			</span>
		</p>
	</div>
</section>

