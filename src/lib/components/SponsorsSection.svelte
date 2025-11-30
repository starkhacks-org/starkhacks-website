<script>
	import sponsorsStyles from '../styles/sponsors.module.css';
</script>

<section id="sponsors" class={sponsorsStyles.sponsors}>
	<div class={sponsorsStyles.content}>
		<div class={sponsorsStyles.titleContainer}>
			<h2 class={sponsorsStyles.title}>SPONSORS</h2>
		</div>
		
		<!-- Logo Collage -->
		<div class={sponsorsStyles.logoCollage}>
			<div class={sponsorsStyles.logoWrapper}>
				<img src="/Ford_logo_flat.svg" alt="Ford" class={sponsorsStyles.logo} />
			</div>
			<div class={sponsorsStyles.logoWrapper}>
				<img src="/Espressif_Logo.svg" alt="Espressif" class={sponsorsStyles.logo} />
			</div>
		</div>
		
		<p class={sponsorsStyles.comingSoon}>
			and many more coming soon
		</p>
		
		<p class={sponsorsStyles.subtitle}>
			Reach out to <a href="mailto:sponsorship@starkhacks.com">sponsorship@starkhacks.com</a> if you're interested in sponsoring.
		</p>
	</div>
</section>

