<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import styles from '$lib/styles/schedule.module.css';
	import scheduleData from '$lib/data/schedule.json';

	const tagLabels: Record<string, string> = {
		workshop: 'Workshop',
		ceremony: 'Ceremony',
		hacking: 'Hacking',
		mentorship: 'Mentors',
		food: '',
		logistics: ''
	};
</script>

<svelte:head>
	<title>Schedule — StarkHacks 2026</title>
	<meta name="description" content="Full schedule for StarkHacks 2026 — the world's largest hardware hackathon at Purdue University, April 17–19, 2026." />
</svelte:head>

<Navigation />

<main class={styles.page}>
	<div class={styles.container}>
		<header class={styles.header}>
			<p class={styles.eyebrow}>April 17–19, 2026 · Purdue University</p>
			<h1 class={styles.title}>Schedule</h1>
			<p class={styles.subtitle}>All times are Eastern Time (ET). Subject to change.</p>
		</header>

		<div class={styles.days}>
			{#each scheduleData.days as day}
				<section class={styles.day}>
					<h2 class={styles.dayHeader}>{day.date}</h2>
					<div class={styles.events}>
						{#each day.events as event}
							<div class="{styles.event} {styles[`event--${event.type}`]}">
								<span class={styles.time}>{event.time}</span>
								<div class={styles.timelineCol}>
									<div class={styles.dot}></div>
									<div class={styles.line}></div>
								</div>
								<div class={styles.eventContent}>
									<p class={styles.eventTitle}>{event.title}</p>
									{#if tagLabels[event.type]}
										<span class="{styles.tag} {styles[`tag--${event.type}`]}">{tagLabels[event.type]}</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		</div>

		<div class={styles.notice}>
			<p class={styles.noticeText}>
				Schedule details will be updated closer to the event. More workshops, sponsor events, and activities will be announced soon.
			</p>
		</div>
	</div>
</main>

<Footer />
