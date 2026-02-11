<script>
	import aboutStyles from '../styles/about.module.css';
	import AboutSparks from './AboutSparks.svelte';
</script>

<section id="about" class={aboutStyles.about}>
	<AboutSparks />
	<div class={aboutStyles.content}>
		<!-- Title with Accent -->
		<div class={aboutStyles.titleContainer}>
			<img src="/triangle.svg" alt="" class={aboutStyles.accentTriangle} />
			<h2 class={aboutStyles.title}>ABOUT THE HACK</h2>
		</div>
		
		<!-- Description Paragraphs -->
		<div class={aboutStyles.description}>
			<p class={aboutStyles.paragraph}>
				Stark Hacks is the world's largest hardware hackathon, a 36 hour project sprint where you can build any physical project with other smart people. You get access to free food, free equipment like 3D printers, soldering stations, microcontrollers, sensors, and more, and a community ready to build.
			</p>
			<p class={aboutStyles.paragraph}>
				Hosted by the Humanoid Robot Club Purdue, a student club building world's first humanoid robot for space, StarkHacks is meant to give students of all experience levels a chance to prototype, solder, and ship physical projects without any limitations. This is your chance to join 1000+ of the best hardware students from all over the world and set a World Record!
			</p>
		</div>
		
		<!-- Call to Action -->
		<p class={aboutStyles.callToAction}>
			Don't just watch innovation happen. <span class={aboutStyles.buildIt}>Build it.</span>
		</p>
		
		<!-- Stats Container -->
		<div class={aboutStyles.statsContainer}>
			<img src="/stats-container.svg" alt="" class={aboutStyles.statsContainerImg} />
			<div class={aboutStyles.statsContent}>
				<!-- Prize Pool Card -->
				<div class={aboutStyles.statCard}>
					<img src="/stat-dollar.svg" alt="" class={aboutStyles.statBoxIcon} />
					<div class={aboutStyles.statText}>
						<div class={aboutStyles.statValue}>
							<span class={aboutStyles.desktopOnly}>$100,000</span>
							<span class={aboutStyles.mobileOnly}>$100K</span>
						</div>
						<div class={aboutStyles.statLabel}>PRIZE POOL</div>
					</div>
				</div>
				
				<!-- Eligibility Card -->
				<div class={aboutStyles.statCard}>
					<img src="/stat-globe.svg" alt="" class={aboutStyles.statBoxIcon} />
					<div class={aboutStyles.statText}>
						<div class={aboutStyles.statLabel}>
							<span class={aboutStyles.desktopOnly}>OPEN TO<br />STUDENTS</span>
							<span class={aboutStyles.mobileOnly}>OPEN TO ALL<br />COLLEGE STUDENTS</span>
						</div>
					</div>
				</div>
				
				<!-- Duration Card -->
				<div class={aboutStyles.statCard}>
					<img src="/stat-time.svg" alt="" class={aboutStyles.statBoxIcon} />
					<div class={aboutStyles.statText}>
						<div class={aboutStyles.statValue}>36</div>
						<div class={aboutStyles.statLabel}>HOURS</div>
					</div>
				</div>
				
				<!-- Participants Card -->
				<div class={aboutStyles.statCard}>
					<img src="/stat-person.svg" alt="" class={aboutStyles.statBoxIcon} />
					<div class={aboutStyles.statText}>
						<div class={aboutStyles.statValue}>
							<span class={aboutStyles.desktopOnly}>1000+</span>
							<span class={aboutStyles.mobileOnly}>1000+</span>
						</div>
						<div class={aboutStyles.statLabel}>PARTICIPANTS</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

