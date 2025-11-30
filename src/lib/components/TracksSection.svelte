<script>
	import tracksStyles from '../styles/tracks.module.css';

	const tracks = [
		{ name: 'Space Exploration', lines: ['Space', 'Exploration'] },
		{ name: 'Gaming/Entertainment', lines: ['Gaming/', 'Entertainment'] },
		{ name: 'Wearable Technology', lines: ['Wearable', 'Technology'] },
		{ name: 'AI & Automation', lines: ['AI & Automation'] }
	];
</script>

<section id="tracks" class={tracksStyles.tracks}>
	<div class={tracksStyles.content}>
		<div class={tracksStyles.titleContainer}>
			<img src="/triangle.svg" alt="" class={tracksStyles.accentTriangle} />
			<h2 class={tracksStyles.title}>Tracks</h2>
		</div>
		
		<p class={tracksStyles.subtitle}>
			Choose your field. <span class={tracksStyles.highlight}>Build your breakthrough.</span>
		</p>
		
		<div class={tracksStyles.tracksContainer}>
			{#each tracks as track, index}
				<div class={tracksStyles.trackItem}>
					<div class={tracksStyles.headingBox}>
						<img src="/outer-box.svg" alt="" class={tracksStyles.outerBoxSvg} />
						<div class={tracksStyles.trackName}>
							{#each track.lines as line}
								<p>{line}</p>
							{/each}
						</div>
					</div>
					<div class={tracksStyles.imageBox} data-track-index={index} role="img" aria-label={track.name}>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

