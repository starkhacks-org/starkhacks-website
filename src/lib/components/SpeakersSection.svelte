<script>
	import speakersStyles from '../styles/speakers.module.css';

	const speakers = [
		{
			src: '/speakers/speaker-3.png',
			firstName: 'JONATHAN',
			lastName: 'HURST',
			role: 'CO FOUNDER & CHIEF ROBOT OFFICER, AGILITY ROBOTICS'
		},
		{
			src: '/speakers/speaker-2.png',
			firstName: 'RUTH',
			lastName: 'COTTER',
			role: 'SENIOR VICE PRESIDENT & CHIEF ADMINISTRATIVE OFFICER, AMD'
		},
		{
			src: '/speakers/speaker-1.png',
			firstName: 'NICOLAUS',
			lastName: 'RADFORD',
			role: 'CO FOUNDER & CEO, PERSONA AI'
		}
	];
</script>

<section id="speakers" class={speakersStyles.speakers}>
	{#each speakers as s}
		<article class={speakersStyles.slot}>
			<img class={speakersStyles.photo} src={s.src} alt={`${s.firstName} ${s.lastName}`} />
			<h3 class={speakersStyles.name}>
				<span class={speakersStyles.firstName}>{s.firstName}</span>
				<span class={speakersStyles.lastName}>{s.lastName}</span>
			</h3>
			<p class={speakersStyles.role}>{s.role}</p>
		</article>
	{/each}
</section>
