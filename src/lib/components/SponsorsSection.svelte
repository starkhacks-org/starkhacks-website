<script>
	import { onMount } from 'svelte';
	import sponsorsStyles from '../styles/sponsors.module.css';

	/** @type {HTMLDivElement} */
	let scrollContainer;
	/** @type {HTMLElement} */
	let section;

	// Scroll pause states — downward
	let entryPauseActive = false;   // true while the entry pause is running (scrolling down into section)
	let entryPauseDone = false;     // true after entry pause has completed
	let exitPauseActive = false;    // true while the exit pause is running (scrolling down out of section)
	let exitPauseDone = false;      // true after exit pause has completed
	// Scroll pause states — upward
	let upEntryPauseActive = false;  // true while entry pause is running (scrolling up into section)
	let upEntryPauseDone = false;    // true after upward entry pause has completed
	let upExitPauseActive = false;   // true while exit pause is running (scrolling up out of section)
	let upExitPauseDone = false;     // true after upward exit pause has completed
	let wasInTrapZone = false;       // track when section leaves viewport to reset

	onMount(() => {
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
					upEntryPauseActive = false;
					upEntryPauseDone = false;
					upExitPauseActive = false;
					upExitPauseDone = false;
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
					}, 2000);
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
			// Scrolling up
			else if (e.deltaY < 0) {
				// Reset downward exit pause if scrolling back up from bottom
				if (!atBottom) {
					exitPauseDone = false;
				}

				// ── Up-entry pause: freeze when first scrolling up into the section ──
				if (!upEntryPauseDone) {
					e.preventDefault();
					if (!upEntryPauseActive) {
						upEntryPauseActive = true;
						setTimeout(() => {
							upEntryPauseDone = true;
							upEntryPauseActive = false;
						}, 1000);
					}
					return;
				}

				// ── Up-exit pause: freeze after scrolling to the top ──
				if (upExitPauseActive) {
					e.preventDefault();
					return;
				}

				if (!atTop) {
					e.preventDefault();
					scrollContainer.scrollTop += e.deltaY;
				} else if (!upExitPauseDone) {
					// Reached the top — start exit pause before page scrolls up
					e.preventDefault();
					upExitPauseActive = true;
					setTimeout(() => {
						upExitPauseDone = true;
						upExitPauseActive = false;
					}, 1000);
				}
				// If upExitPauseDone, let the page scroll naturally upward

				// Reset downward entry pause if scrolling back up from top area
				if (!atBottom) {
					entryPauseDone = false;
				}
			}
		}

		window.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			window.removeEventListener('wheel', onWheel);
		};
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

