<script>
	import speakersStyles from '../styles/speakers.module.css';

	const speakers = [
		{
			label: 'DESIGN WEEK',
			image: '/speakers/speaker-3.jpg',
			firstName: 'JONATHAN',
			lastName: 'HURST',
			role: 'CO FOUNDER & CHIEF ROBOT OFFICER, AGILITY ROBOTICS'
		},
		{
			label: 'OPENING CEREMONY',
			image: '/speakers/speaker-2.jpg',
			firstName: 'RUTH',
			lastName: 'COTTER',
			role: 'SENIOR VICE PRESIDENT & CHIEF ADMINISTRATIVE OFFICER, AMD'
		},
		{
			label: 'CLOSING CEREMONY',
			image: '/speakers/speaker-1.png',
			firstName: 'NICOLAUS',
			lastName: 'RADFORD',
			role: 'CO FOUNDER & CEO, PERSONA AI'
		}
	];
</script>

<section id="speakers" class={speakersStyles.speakers}>
	<div class={speakersStyles.content}>
		<div class={speakersStyles.titleRow}>
			<h2 class={speakersStyles.title}>
				<img src="/triangle.svg" alt="" class={speakersStyles.triangleIcon} />
				SPEAKERS
			</h2>
		</div>

		<div class={speakersStyles.grid}>
			{#each speakers as s}
				<article class={speakersStyles.card}>
					<div class={speakersStyles.label}>
						<span>{s.label}</span>
					</div>
					<div class={speakersStyles.frame}>
						<div class={speakersStyles.photoWrap}>
							<img src={s.image} alt={`${s.firstName} ${s.lastName}`} class={speakersStyles.photo} />
						</div>
						<h3 class={speakersStyles.name}>
							<span class={speakersStyles.firstName}>{s.firstName}</span>
							<span class={speakersStyles.lastName}>{s.lastName}</span>
						</h3>
						<p class={speakersStyles.role}>{s.role}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
