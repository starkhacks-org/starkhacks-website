<script>
	import { onMount, onDestroy } from 'svelte';
	import sponsorsStyles from '../styles/sponsors.module.css';

	/** @type {HTMLDivElement} */
	let scrollContainer;
	/** @type {HTMLElement} */
	let section;

	// Scroll pause states — downward only
	let entryPauseActive = false;
	let entryPauseDone = false;
	let exitPauseActive = false;
	let exitPauseDone = false;
	let wasInTrapZone = false;

	// Audio
	/** @type {HTMLAudioElement | null} */
	let glitchAudio = null;
	let audioStarted = false;
	let isInView = false;
	let globalAudioEnabled = false;

	function startGlitchAudio() {
		if (!glitchAudio || audioStarted || !globalAudioEnabled) return;
		glitchAudio.play().then(() => {
			audioStarted = true;
		}).catch(() => {});
	}

	function stopGlitchAudio() {
		if (glitchAudio) {
			glitchAudio.pause();
			glitchAudio.currentTime = 0;
			audioStarted = false;
		}
	}

	function handleIntersection(entries) {
		entries.forEach(entry => {
			const wasInView = isInView;
			isInView = entry.isIntersecting && entry.intersectionRatio > 0.2;

			if (isInView && !wasInView) {
				// Entering sponsors section - mute main audio, play glitch
				window.dispatchEvent(new CustomEvent('sponsors-section-enter'));
				if (globalAudioEnabled) startGlitchAudio();
			} else if (!isInView && wasInView) {
				// Leaving sponsors section - unmute main audio, stop glitch
				window.dispatchEvent(new CustomEvent('sponsors-section-leave'));
				stopGlitchAudio();
			}
		});
	}

	function handleGlobalAudioEnable() {
		globalAudioEnabled = true;
		if (isInView) startGlitchAudio();
	}

	function handleGlobalAudioDisable() {
		globalAudioEnabled = false;
		stopGlitchAudio();
	}

	onMount(() => {
		// Set up glitch audio
		glitchAudio = new Audio('/virtual_vibes-glitch-sound-effect-hd-379466.mp3');
		glitchAudio.loop = true;
		glitchAudio.volume = 0.4;
		glitchAudio.preload = 'auto';

		// Set up intersection observer
		const observer = new IntersectionObserver(handleIntersection, {
			threshold: [0, 0.2, 0.5, 1],
			rootMargin: '-5% 0px'
		});

		if (section) {
			observer.observe(section);
		}

		// Listen for global audio control
		window.addEventListener('audio-global-enable', handleGlobalAudioEnable);
		window.addEventListener('audio-global-disable', handleGlobalAudioDisable);
		/** @param {WheelEvent} e */
		function onWheel(e) {
			if (!scrollContainer || !section) return;

			// Only trap when the section is near the top of the viewport
			const rect = section.getBoundingClientRect();
			const sectionNearTop = rect.top <= 300 && rect.bottom > window.innerHeight * 0.5;

			// Reset pause states when section leaves the trap zone
			if (!sectionNearTop) {
				if (wasInTrapZone) {
					entryPauseActive = false;
					entryPauseDone = false;
					exitPauseActive = false;
					exitPauseDone = false;
					wasInTrapZone = false;
				}
				return;
			}

			wasInTrapZone = true;

			const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
			const atTop = scrollTop <= 0;
			const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

			// ── Entry pause: 1s freeze when first entering the section ──
			if (!entryPauseDone && e.deltaY > 0) {
				e.preventDefault();
				if (!entryPauseActive) {
					entryPauseActive = true;
					setTimeout(() => {
						entryPauseDone = true;
						entryPauseActive = false;
					}, 1000);
				}
				return;
			}

			// ── Exit pause: 1s freeze after scrolling to the bottom ──
			if (exitPauseActive) {
				e.preventDefault();
				return;
			}

			// Scrolling down
			if (e.deltaY > 0) {
				if (!atBottom) {
					// Still scrolling inside the container
					e.preventDefault();
					scrollContainer.scrollTop += e.deltaY;
				} else if (!exitPauseDone) {
					// Reached the bottom — start 1s exit pause
					e.preventDefault();
					exitPauseActive = true;
					setTimeout(() => {
						exitPauseDone = true;
						exitPauseActive = false;
					}, 1000);
				}
				// If exitPauseDone, let the page scroll naturally (don't preventDefault)
			}
			// Scrolling up — no pauses, just trap inside container
			else if (e.deltaY < 0) {
				if (!atTop) {
					e.preventDefault();
					scrollContainer.scrollTop += e.deltaY;
				}
				// Reset downward pauses if scrolling back up
				if (!atBottom) {
					exitPauseDone = false;
				}
			}
		}

		window.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			window.removeEventListener('wheel', onWheel);
			observer.disconnect();
			window.removeEventListener('audio-global-enable', handleGlobalAudioEnable);
			window.removeEventListener('audio-global-disable', handleGlobalAudioDisable);
		};
	});

	onDestroy(() => {
		stopGlitchAudio();
		if (glitchAudio) {
			glitchAudio.src = '';
		}
	});
</script>

<section id="sponsors" class={sponsorsStyles.sponsors} bind:this={section}>
	<div class={sponsorsStyles.content}>
		<div class={sponsorsStyles.titleContainer} bind:this={scrollContainer}>
			<div class={sponsorsStyles.glitchWrap} style="background-image: url('/sponsors-new.svg'); background-size: 100% auto; background-repeat: no-repeat;">
				<img
					src="/sponsors-new.svg"
					alt="Sponsors"
					class={sponsorsStyles.titleImage}
				/>
			</div>
		</div>
		
		<p class={sponsorsStyles.subtitle}>
			Reach out to <a href="mailto:sponsorship@starkhacks.com">sponsorship@starkhacks.com</a> if you're interested in sponsoring.
		</p>
	</div>
</section>

