<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import TracksSection from '$lib/components/TracksSection.svelte';
	import SpeakersSection from '$lib/components/SpeakersSection.svelte';
	import SponsorsSection from '$lib/components/SponsorsSection.svelte';
	import FAQSection from '$lib/components/FAQSection.svelte';
	import ApplySection from '$lib/components/ApplySection.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import pageStyles from '$lib/styles/page.module.css';
</script>

<svelte:head>
	<title>StarkHacks 2026</title>
	<meta name="description" content="Join StarkHacks 2026 on April 17, 2026 at Purdue University in West Lafayette, Indiana. The world's largest hardware hackathon organized by Humanoid Robot Club Purdue, setting an official Guinness World Record. Build innovative hardware projects, compete for prizes, and be part of history." />
	<meta property="og:title" content="StarkHacks 2026 - World's Largest Hardware Hackathon | Guinness World Record" />
	<meta property="og:description" content="Join the world's largest hardware hackathon on April 17, 2026 at Purdue University. Organized by Humanoid Robot Club Purdue. Setting an official Guinness World Record. Build innovative hardware projects and be part of history." />
	<meta name="twitter:title" content="StarkHacks 2026 - World's Largest Hardware Hackathon | Guinness World Record" />
	<meta name="twitter:description" content="Join the world's largest hardware hackathon on April 17, 2026 at Purdue University. Organized by Humanoid Robot Club Purdue. Setting an official Guinness World Record." />
</svelte:head>

<Navigation />
<div class={pageStyles.pageWrapper}>
	<HeroSection />
	<AboutSection />
	<TracksSection />
	<SpeakersSection />
	<SponsorsSection />
	<FAQSection />
	<ApplySection />
	<Footer />
</div>
