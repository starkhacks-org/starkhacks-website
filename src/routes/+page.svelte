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
	<meta name="description" content="Join 1000+ students and set an Official Guinness Record at the World's Largest hardware Hackathon. Free 3D Printers, machining tools, sensors, motors, & tons of workshops. April 17-19, 2026 at Purdue University." />
	<meta property="og:title" content="StarkHacks" />
	<meta property="og:description" content="Join 1000+ students and set an Official Guinness Record at the World's Largest hardware Hackathon. Free 3D Printers, machining tools, sensors, motors, & tons of workshops. April 17-19, 2026 at Purdue University." />
	<meta name="twitter:title" content="StarkHacks" />
	<meta name="twitter:description" content="Join 1000+ students and set an Official Guinness Record at the World's Largest hardware Hackathon. Free 3D Printers, machining tools, sensors, motors, & tons of workshops. April 17-19, 2026 at Purdue University." />
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
