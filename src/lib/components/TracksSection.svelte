<script>
	import { onMount, onDestroy } from 'svelte';
	import tracksStyles from '../styles/tracks.module.css';

	const tracks = [
		{ name: 'Best Use of AMD', lines: ['Best Use of', 'AMD'], boxImage: '/general.svg' },
		{ name: 'Ford Industrial Robotics Grippers', lines: ['Ford Industrial', 'Robotics Grippers'], boxImage: '/misc.svg' },
		{ name: 'Espressif Smart Home/City', lines: ['Espressif', 'Smart Home/City'], boxImage: '/smart home.svg' },
		{ name: 'Qualcomm Robotics', lines: ['Qualcomm', 'Robotics'], boxImage: '/wearable technology.svg' },
		{ name: 'QTexAI Creative Tech', lines: ['QTexAI', 'Creative Tech'], boxImage: '/gaming and entertainment.svg' },
		{ name: 'Analog Devices Sensor Fusion', lines: ['Analog Devices', 'Sensor Fusion'], boxImage: '/space exploration.svg' },
		{ name: 'Best Use of Viam', lines: ['Best Use of', 'Viam'], boxImage: '/AI & Automation.svg' },
		{ name: 'Microsoft AI and Automation', lines: ['Microsoft', 'AI & Automation'], boxImage: '/AI & Automation.svg' }
	];

	// Duplicate tracks for seamless looping
	const duplicatedTracks = [...tracks, ...tracks];

	let sectionEl;
	let isInView = false;

	function handleIntersection(entries) {
		entries.forEach(entry => {
			const wasInView = isInView;
			isInView = entry.isIntersecting && entry.intersectionRatio > 0.2;

			if (isInView && !wasInView) {
				// Entering tracks section - adjust audio volumes
				window.dispatchEvent(new CustomEvent('tracks-section-enter'));
			} else if (!isInView && wasInView) {
				// Leaving tracks section - restore audio volumes
				window.dispatchEvent(new CustomEvent('tracks-section-leave'));
			}
		});
	}

	onMount(() => {
		const observer = new IntersectionObserver(handleIntersection, {
			threshold: [0, 0.2, 0.5, 1],
			rootMargin: '-5% 0px'
		});

		if (sectionEl) {
			observer.observe(sectionEl);
		}

		return () => {
			observer.disconnect();
		};
	});
</script>

<section id="tracks" class={tracksStyles.tracks} bind:this={sectionEl}>
	<div class={tracksStyles.content}>
		<div class={tracksStyles.titleContainer}>
			<img src="/triangle.svg" alt="" class={tracksStyles.accentTriangle} />
			<h2 class={tracksStyles.title}>Tracks</h2>
		</div>
		
		<p class={tracksStyles.subtitle}>
			Choose your field. <span class={tracksStyles.highlight}>Build your breakthrough.</span>
		</p>
		
		<div class={tracksStyles.tracksWrapper}>
			<!-- Conveyor belt container with overflow hidden -->
			<div class={tracksStyles.conveyorContainer}>
				<div class={tracksStyles.conveyorBelt}>
					<!-- First set -->
					<div class={tracksStyles.conveyorSet}>
						<div class={tracksStyles.trackItems}>
							{#each tracks as track, index}
								<div class={tracksStyles.trackItem} data-track-index={index}>
									<div class={tracksStyles.headingBox}>
										<img src="/outer-box.svg" alt="" class={tracksStyles.outerBoxSvg} />
										<div class={tracksStyles.trackName}>
											{#each track.lines as line}
												<p>{line}</p>
											{/each}
										</div>
									</div>
									<div class={tracksStyles.trackBoxImage}>
										<img src={track.boxImage} alt={track.name} class={tracksStyles.boxImg} />
									</div>
								</div>
							{/each}
						</div>
					</div>
					<!-- Duplicate set for seamless looping -->
					<div class={tracksStyles.conveyorSet}>
						<div class={tracksStyles.trackItems}>
							{#each tracks as track, index}
								<div class={tracksStyles.trackItem} data-track-index={index}>
									<div class={tracksStyles.headingBox}>
										<img src="/outer-box.svg" alt="" class={tracksStyles.outerBoxSvg} />
										<div class={tracksStyles.trackName}>
											{#each track.lines as line}
												<p>{line}</p>
											{/each}
										</div>
									</div>
									<div class={tracksStyles.trackBoxImage}>
										<img src={track.boxImage} alt={track.name} class={tracksStyles.boxImg} />
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

