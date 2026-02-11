<script>
	import { onMount } from 'svelte';
	import sponsorsStyles from '../styles/sponsors.module.css';

	/** @type {HTMLDivElement} */
	let scrollContainer;
	/** @type {HTMLElement} */
	let section;
	let trapped = false;

	onMount(() => {
		/** @param {WheelEvent} e */
		function onWheel(e) {
			if (!scrollContainer || !section) return;

			// Only trap when the section is near the top of the viewport
			const rect = section.getBoundingClientRect();
			const sectionNearTop = rect.top <= 300 && rect.bottom > window.innerHeight * 0.5;
			if (!sectionNearTop) return;

			const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
			const atTop = scrollTop <= 0;
			const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

			// Scrolling down and not at bottom — trap it
			if (e.deltaY > 0 && !atBottom) {
				e.preventDefault();
				scrollContainer.scrollTop += e.deltaY;
			}
			// Scrolling up and not at top — trap it
			else if (e.deltaY < 0 && !atTop) {
				e.preventDefault();
				scrollContainer.scrollTop += e.deltaY;
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
			<img
				src="/sponsors-new.svg"
				alt="Sponsors"
				class={sponsorsStyles.titleImage}
			/>
		</div>
		
		<p class={sponsorsStyles.subtitle}>
			Reach out to <a href="mailto:sponsorship@starkhacks.com">sponsorship@starkhacks.com</a> if you're interested in sponsoring.
		</p>
	</div>
</section>

