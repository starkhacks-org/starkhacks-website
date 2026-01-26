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
	<meta name="description" content="StarkHacks is the world's largest hardware hackathon at Purdue University. A 36-hour engineering marathon setting an official Guinness World Record. April 17-19, 2026." />
	<meta property="og:title" content="StarkHacks" />
	<meta property="og:description" content="StarkHacks is the world's largest hardware hackathon at Purdue University. A 36-hour engineering marathon setting an official Guinness World Record. April 17-19, 2026." />
	<meta name="twitter:title" content="StarkHacks" />
	<meta name="twitter:description" content="StarkHacks is the world's largest hardware hackathon at Purdue University. A 36-hour engineering marathon setting an official Guinness World Record. April 17-19, 2026." />
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
