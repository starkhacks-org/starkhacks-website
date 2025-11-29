<script>
	import aboutStyles from '../styles/about.module.css';
</script>

<section class={aboutStyles.about}>
	<div class={aboutStyles.content}>
		<!-- Title with Accent -->
		<div class={aboutStyles.titleContainer}>
			<img src="/triangle.svg" alt="" class={aboutStyles.accentTriangle} />
			<h2 class={aboutStyles.title}>ABOUT THE HACK</h2>
		</div>
		
		<!-- Description Paragraphs -->
		<div class={aboutStyles.description}>
			<p class={aboutStyles.paragraph}>
				Stark Hacks is the world's largest hardware hackathon, a 36-hour engineering marathon where ideas come off the screen and into real circuits.
			</p>
			<p class={aboutStyles.paragraph}>
				Organized by the Humanoid Robot Club, hundreds of students prototype, solder, test, and create side by side. This spring, we're setting an official Guinness World Record for World's Largest Hardware Hackathon.
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
						<div class={aboutStyles.statValue}>$100 K</div>
						<div class={aboutStyles.statLabel}>PRIZE POOL</div>
					</div>
				</div>
				
				<!-- Eligibility Card -->
				<div class={aboutStyles.statCard}>
					<img src="/stat-globe.svg" alt="" class={aboutStyles.statBoxIcon} />
					<div class={aboutStyles.statText}>
						<div class={aboutStyles.statLabel}>OPEN TO ALL<br />COLLEGE STUDENTS</div>
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
						<div class={aboutStyles.statValue}>500+</div>
						<div class={aboutStyles.statLabel}>PARTICIPANTS</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

