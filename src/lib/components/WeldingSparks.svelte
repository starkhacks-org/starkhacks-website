<script>
	import { onMount, onDestroy } from 'svelte';

	let sectionEl;
	let isInView = false;
	let globalAudioEnabled = false;

	// Audio
	let gearsAudio = null;
	let hammerAudio = null;
	let electricAudio = null;
	let audioStarted = false;

	function startAudio() {
		if (audioStarted || !globalAudioEnabled) return;
		if (gearsAudio) {
			gearsAudio.play().catch(() => {});
		}
		if (hammerAudio) {
			hammerAudio.play().catch(() => {});
		}
		if (electricAudio) {
			electricAudio.play().catch(() => {});
		}
		audioStarted = true;
	}

	function stopAudio() {
		if (gearsAudio) {
			gearsAudio.pause();
			gearsAudio.currentTime = 0;
		}
		if (hammerAudio) {
			hammerAudio.pause();
			hammerAudio.currentTime = 0;
		}
		if (electricAudio) {
			electricAudio.pause();
			electricAudio.currentTime = 0;
		}
		audioStarted = false;
	}

	function handleIntersection(entries) {
		entries.forEach(entry => {
			const wasInView = isInView;
			isInView = entry.isIntersecting;

			if (isInView && !wasInView) {
				// Entering section - mute main audio, play our sounds
				window.dispatchEvent(new CustomEvent('apply-section-enter'));
				if (globalAudioEnabled) startAudio();
			} else if (!isInView && wasInView) {
				// Leaving section - unmute main audio, stop our sounds
				window.dispatchEvent(new CustomEvent('apply-section-leave'));
				stopAudio();
			}
		});
	}

	function handleGlobalAudioEnable() {
		globalAudioEnabled = true;
		if (isInView) startAudio();
	}

	function handleGlobalAudioDisable() {
		globalAudioEnabled = false;
		stopAudio();
	}

	onMount(() => {
		// Set up audio
		gearsAudio = new Audio('/freesound_community-rusty-gears-62898.mp3');
		gearsAudio.loop = true;
		gearsAudio.volume = 0.3;
		gearsAudio.preload = 'auto';

		hammerAudio = new Audio('/freesound_community-hitting-metal-hammering-slide-hammer-6692.mp3');
		hammerAudio.loop = true;
		hammerAudio.volume = 0.35;
		hammerAudio.preload = 'auto';

		electricAudio = new Audio('/freesound_community-electric-sparks-6130.mp3');
		electricAudio.loop = true;
		electricAudio.volume = 0.3;
		electricAudio.preload = 'auto';

		// Listen for global audio control
		window.addEventListener('audio-global-enable', handleGlobalAudioEnable);
		window.addEventListener('audio-global-disable', handleGlobalAudioDisable);

		// Set up intersection observer
		const observer = new IntersectionObserver(handleIntersection, {
			threshold: [0, 0.1, 0.3],
			rootMargin: '0px'
		});

		// Get parent section - use a small delay to ensure DOM is ready
		setTimeout(() => {
			sectionEl = document.getElementById('apply');
			if (sectionEl) {
				observer.observe(sectionEl);
			}
		}, 100);

		return () => {
			observer.disconnect();
		};
	});

	onDestroy(() => {
		stopAudio();
		if (gearsAudio) gearsAudio.src = '';
		if (hammerAudio) hammerAudio.src = '';
		if (electricAudio) electricAudio.src = '';
		if (typeof window !== 'undefined') {
			window.removeEventListener('audio-global-enable', handleGlobalAudioEnable);
			window.removeEventListener('audio-global-disable', handleGlobalAudioDisable);
		}
	});
</script>

<!-- No visual canvas, audio only -->
