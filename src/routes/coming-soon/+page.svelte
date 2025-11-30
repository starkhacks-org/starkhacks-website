<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import comingSoonStyles from '$lib/styles/coming-soon.module.css';
</script>

<Navigation />
<section class={comingSoonStyles.comingSoon}>
	<img 
		src="/hero-background.jpg" 
		alt="" 
		class={comingSoonStyles.backgroundImage}
	/>
	<div class={comingSoonStyles.content}>
		<h1 class={comingSoonStyles.title}>COMING SOON</h1>
	</div>
</section>
<Footer />

