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
	<title>StarkHacks</title>
	<meta name="description" content="World's largest hardware hackathon at Purdue University. Join StarkHacks on April 17-19, 2026 in West Lafayette, Indiana. This Purdue hardware hackathon will set an official Guinness World Record. Build innovative hardware projects, compete for $100K in prizes, and be part of history." />
	<meta property="og:title" content="StarkHacks" />
	<meta property="og:description" content="World's largest hardware hackathon at Purdue University. Join StarkHacks on April 17-19, 2026 in West Lafayette, Indiana. This Purdue hardware hackathon will set an official Guinness World Record. Build innovative hardware projects, compete for $100K in prizes, and be part of history." />
	<meta name="twitter:title" content="StarkHacks" />
	<meta name="twitter:description" content="World's largest hardware hackathon at Purdue University. Join StarkHacks on April 17-19, 2026 in West Lafayette, Indiana. This Purdue hardware hackathon will set an official Guinness World Record. Build innovative hardware projects and compete for $100K in prizes." />
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
