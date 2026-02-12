<script>
	import { onMount, onDestroy } from 'svelte';
	import speakersStyles from '../styles/speakers.module.css';

	let sectionEl;
	let isInView = false;
	let fluorescentAudio = null;
	let audioStarted = false;
	let audioContext = null;
	let analyser = null;
	let dataArray = null;
	let animationId = null;

	// Light states - intensity from 0 to 1
	let light1Intensity = 1;
	let light2Intensity = 1;
	let light3Intensity = 1;

	// Base flicker pattern (random timing)
	let flickerTimeout1 = null;
	let flickerTimeout2 = null;
	let flickerTimeout3 = null;

	function scheduleFlicker(lightNum) {
		const baseDelay = lightNum === 2 ? 800 : lightNum === 1 ? 1500 : 2500;
		const delay = baseDelay + Math.random() * baseDelay;
		
		const timeout = setTimeout(() => {
			if (!isInView) return;
			
			// Quick flicker sequence
			const flickerCount = lightNum === 2 ? 3 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 2);
			let i = 0;
			
			function doFlicker() {
				if (i >= flickerCount) {
					if (lightNum === 1) light1Intensity = 1;
					else if (lightNum === 2) light2Intensity = 1;
					else light3Intensity = 1;
					scheduleFlicker(lightNum);
					return;
				}
				
				// Off
				if (lightNum === 1) light1Intensity = 0.1 + Math.random() * 0.2;
				else if (lightNum === 2) light2Intensity = 0.1 + Math.random() * 0.2;
				else light3Intensity = 0.1 + Math.random() * 0.2;
				
				setTimeout(() => {
					// Back on (partially or fully)
					const intensity = 0.7 + Math.random() * 0.3;
					if (lightNum === 1) light1Intensity = intensity;
					else if (lightNum === 2) light2Intensity = intensity;
					else light3Intensity = intensity;
					i++;
					setTimeout(doFlicker, 30 + Math.random() * 50);
				}, 40 + Math.random() * 60);
			}
			
			doFlicker();
		}, delay);
		
		if (lightNum === 1) flickerTimeout1 = timeout;
		else if (lightNum === 2) flickerTimeout2 = timeout;
		else flickerTimeout3 = timeout;
	}

	function startFlickering() {
		scheduleFlicker(1);
		scheduleFlicker(2);
		scheduleFlicker(3);
	}

	function stopFlickering() {
		if (flickerTimeout1) clearTimeout(flickerTimeout1);
		if (flickerTimeout2) clearTimeout(flickerTimeout2);
		if (flickerTimeout3) clearTimeout(flickerTimeout3);
		if (animationId) cancelAnimationFrame(animationId);
		light1Intensity = 1;
		light2Intensity = 1;
		light3Intensity = 1;
	}

	function setupAudioAnalyser() {
		if (!fluorescentAudio || audioContext) return;
		
		try {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
			analyser = audioContext.createAnalyser();
			analyser.fftSize = 256;
			
			const source = audioContext.createMediaElementSource(fluorescentAudio);
			source.connect(analyser);
			analyser.connect(audioContext.destination);
			
			dataArray = new Uint8Array(analyser.frequencyBinCount);
			
			// Start audio-reactive loop
			function updateFromAudio() {
				if (!isInView || !analyser) {
					animationId = requestAnimationFrame(updateFromAudio);
					return;
				}
				
				analyser.getByteFrequencyData(dataArray);
				
				// Get average amplitude
				let sum = 0;
				for (let i = 0; i < dataArray.length; i++) {
					sum += dataArray[i];
				}
				const avg = sum / dataArray.length / 255;
				
				// Modulate light intensities based on audio
				// Higher audio = more flicker tendency
				if (avg > 0.3 && Math.random() < avg * 0.3) {
					const lightToFlicker = Math.floor(Math.random() * 3) + 1;
					if (lightToFlicker === 1) light1Intensity = 0.3 + Math.random() * 0.4;
					else if (lightToFlicker === 2) light2Intensity = 0.2 + Math.random() * 0.3;
					else light3Intensity = 0.4 + Math.random() * 0.4;
					
					setTimeout(() => {
						if (lightToFlicker === 1) light1Intensity = 0.9 + Math.random() * 0.1;
						else if (lightToFlicker === 2) light2Intensity = 0.9 + Math.random() * 0.1;
						else light3Intensity = 0.9 + Math.random() * 0.1;
					}, 50 + Math.random() * 50);
				}
				
				animationId = requestAnimationFrame(updateFromAudio);
			}
			
			updateFromAudio();
		} catch (e) {
			console.log('Audio analyser not supported');
		}
	}

	let globalAudioEnabled = false;

	function startFluorescentAudio() {
		if (!fluorescentAudio || audioStarted || !globalAudioEnabled) return;
		fluorescentAudio.play().then(() => {
			audioStarted = true;
			setupAudioAnalyser();
		}).catch(() => {
			// Will retry on user interaction
		});
	}

	function stopFluorescentAudio() {
		if (fluorescentAudio) {
			fluorescentAudio.pause();
			fluorescentAudio.currentTime = 0;
			audioStarted = false;
		}
	}

	function handleIntersection(entries) {
		entries.forEach(entry => {
			const wasInView = isInView;
			isInView = entry.isIntersecting && entry.intersectionRatio > 0.2;

			if (isInView && !wasInView) {
				// Entering speakers section
				startFlickering();
				if (globalAudioEnabled) startFluorescentAudio();
				// Dispatch event to mute main audio
				window.dispatchEvent(new CustomEvent('speakers-section-enter'));
			} else if (!isInView && wasInView) {
				// Leaving speakers section
				stopFlickering();
				stopFluorescentAudio();
				// Dispatch event to unmute main audio
				window.dispatchEvent(new CustomEvent('speakers-section-leave'));
			}
		});
	}

	function handleGlobalAudioEnable() {
		globalAudioEnabled = true;
		if (isInView) startFluorescentAudio();
	}

	function handleGlobalAudioDisable() {
		globalAudioEnabled = false;
		stopFluorescentAudio();
	}

	onMount(() => {
		// Set up fluorescent audio
		fluorescentAudio = new Audio('/freesound_community-flourescent-light-29596.mp3');
		fluorescentAudio.loop = true;
		fluorescentAudio.volume = 0.5;
		fluorescentAudio.preload = 'auto';
		fluorescentAudio.crossOrigin = 'anonymous';

		// Set up intersection observer
		const observer = new IntersectionObserver(handleIntersection, {
			threshold: [0, 0.2, 0.5, 1],
			rootMargin: '-5% 0px'
		});

		if (sectionEl) {
			observer.observe(sectionEl);
		}

		// Listen for global audio control
		window.addEventListener('audio-global-enable', handleGlobalAudioEnable);
		window.addEventListener('audio-global-disable', handleGlobalAudioDisable);

		return () => {
			observer.disconnect();
			stopFlickering();
			stopFluorescentAudio();
			window.removeEventListener('audio-global-enable', handleGlobalAudioEnable);
			window.removeEventListener('audio-global-disable', handleGlobalAudioDisable);
		};
	});

	onDestroy(() => {
		stopFlickering();
		if (animationId) cancelAnimationFrame(animationId);
		if (audioContext) {
			audioContext.close();
		}
		if (fluorescentAudio) {
			fluorescentAudio.pause();
			fluorescentAudio.src = '';
		}
	});
</script>

<section id="speakers" class={speakersStyles.speakers} bind:this={sectionEl}>
	<div class={speakersStyles.content}>
		<!-- Title row with lights 1 and 2 -->
		<div class={speakersStyles.titleRow}>
			<!-- Light 1 - diagonal beam towards right -->
			<div class={speakersStyles.lightFixture}>
				<div class={speakersStyles.lightHousing}></div>
				<div 
					class={speakersStyles.lightBulb}
					style="opacity: {light1Intensity}; filter: brightness({0.5 + light1Intensity * 0.5});"
				></div>
				<div 
					class="{speakersStyles.lightBeam} {speakersStyles.lightBeamDiagonal}"
					style="opacity: {light1Intensity * 0.8};"
				></div>
				<div 
					class="{speakersStyles.lightPool} {speakersStyles.lightPoolDiagonal}"
					style="opacity: {light1Intensity * 0.6};"
				></div>
			</div>

			<h2 class={speakersStyles.title}>
				<img src="/triangle.svg" alt="" class={speakersStyles.triangleIcon} />
				SPEAKERS
			</h2>

			<!-- Light 2 (most flickery) - positioned more to the right -->
			<div class="{speakersStyles.lightFixture} {speakersStyles.lightFixture2}">
				<div class={speakersStyles.lightHousing}></div>
				<div 
					class={speakersStyles.lightBulb}
					style="opacity: {light2Intensity}; filter: brightness({0.5 + light2Intensity * 0.5});"
				></div>
				<div 
					class={speakersStyles.lightBeam}
					style="opacity: {light2Intensity * 0.8};"
				></div>
				<div 
					class={speakersStyles.lightPool}
					style="opacity: {light2Intensity * 0.6};"
				></div>
			</div>
		</div>
	</div>

	<!-- Light 3 - positioned separately above third speaker box -->
	<div class={speakersStyles.lightFixtureRight}>
		<div class={speakersStyles.lightHousing}></div>
		<div 
			class={speakersStyles.lightBulb}
			style="opacity: {light3Intensity}; filter: brightness({0.5 + light3Intensity * 0.5});"
		></div>
		<div 
			class={speakersStyles.lightBeam}
			style="opacity: {light3Intensity * 0.8};"
		></div>
		<div 
			class={speakersStyles.lightPool}
			style="opacity: {light3Intensity * 0.6};"
		></div>
	</div>
</section>
