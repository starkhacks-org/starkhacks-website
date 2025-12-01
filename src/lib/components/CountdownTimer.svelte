<script>
	import { onMount, onDestroy } from 'svelte';
	import countdownStyles from '../styles/countdown.module.css';
	
	// April 17, 2026, 8:00 PM EST (UTC-5)
	// Create date in EST timezone: 8 PM EST = 20:00 EST
	// EST is UTC-5, so 8 PM EST = 1 AM UTC on April 18
	// Using Date constructor with UTC time
	const targetDate = new Date('2026-04-18T01:00:00Z').getTime();
	
	let days = 150;
	let hours = 16;
	let minutes = 40;
	let seconds = 0;
	
	let daysProgress = 0.6;
	let hoursProgress = 0.67;
	let minutesProgress = 0.67;
	
	let intervalId;
	
	function updateCountdown() {
		const now = Date.now();
		const distance = targetDate - now;
		
		if (distance > 0) {
			days = Math.floor(distance / (1000 * 60 * 60 * 24));
			hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			seconds = Math.floor((distance % (1000 * 60)) / 1000);
			
			// Calculate progress bars (normalized to 0-1)
			// Assuming max values for visual representation
			const maxDays = 200;
			daysProgress = Math.min(1, Math.max(0, days / maxDays));
			hoursProgress = hours / 24;
			minutesProgress = minutes / 60;
		} else {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
			daysProgress = 0;
			hoursProgress = 0;
			minutesProgress = 0;
		}
	}
	
	onMount(() => {
		updateCountdown();
		intervalId = setInterval(updateCountdown, 1000);
	});
	
	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div class={countdownStyles.countdown} role="timer" aria-live="polite" aria-label="Countdown to StarkHacks">
	<div class={countdownStyles.container}>
		<div class={countdownStyles.timeBlock}>
			<div class={countdownStyles.value} aria-label="{days} days">{days}</div>
			<div class={countdownStyles.label}>DAYS</div>
		</div>
		
		<div class={countdownStyles.timeBlock}>
			<div class={countdownStyles.value} aria-label="{hours} hours">{hours}</div>
			<div class={countdownStyles.label}>HOURS</div>
		</div>
		
		<div class={countdownStyles.timeBlock}>
			<div class={countdownStyles.value} aria-label="{minutes} minutes">{minutes}</div>
			<div class={countdownStyles.label}>MIN</div>
		</div>
	</div>
</div>

