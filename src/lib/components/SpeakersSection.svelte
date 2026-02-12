<script>
	import speakersStyles from '../styles/speakers.module.css';
</script>

<section id="speakers" class={speakersStyles.speakers}>
	<div class={speakersStyles.content}>
		<!-- Title row with lights 1 and 2 -->
		<div class={speakersStyles.titleRow}>
			<!-- Light 1 - diagonal beam towards right -->
			<div class={speakersStyles.lightFixture}>
				<div class={speakersStyles.lightHousing}></div>
				<div 
					class={speakersStyles.lightBulb}
					style="opacity: 1; filter: brightness(1);"
				></div>
				<div 
					class="{speakersStyles.lightBeam} {speakersStyles.lightBeamDiagonal}"
					style="opacity: 0.8;"
				></div>
				<div 
					class="{speakersStyles.lightPool} {speakersStyles.lightPoolDiagonal}"
					style="opacity: 0.6;"
				></div>
			</div>

			<h2 class={speakersStyles.title}>
				<img src="/triangle.svg" alt="" class={speakersStyles.triangleIcon} />
				SPEAKERS
			</h2>

			<!-- Light 2 - positioned more to the right -->
			<div class="{speakersStyles.lightFixture} {speakersStyles.lightFixture2}">
				<div class={speakersStyles.lightHousing}></div>
				<div 
					class={speakersStyles.lightBulb}
					style="opacity: 1; filter: brightness(1);"
				></div>
				<div 
					class={speakersStyles.lightBeam}
					style="opacity: 0.8;"
				></div>
				<div 
					class={speakersStyles.lightPool}
					style="opacity: 0.6;"
				></div>
			</div>
		</div>
	</div>

	<!-- Light 3 - positioned separately above third speaker box -->
	<div class={speakersStyles.lightFixtureRight}>
		<div class={speakersStyles.lightHousing}></div>
		<div 
			class={speakersStyles.lightBulb}
			style="opacity: 1; filter: brightness(1);"
		></div>
		<div 
			class={speakersStyles.lightBeam}
			style="opacity: 0.8;"
		></div>
		<div 
			class={speakersStyles.lightPool}
			style="opacity: 0.6;"
		></div>
	</div>
</section>
