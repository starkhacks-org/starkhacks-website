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
	<meta name="description" content="Stark Hacks is the world's largest hardware hackathon and the premier Purdue hardware hackathon, a 36-hour engineering marathon where ideas come off the screen and into real circuits. This Indiana hardware hackathon brings together hundreds of students from Purdue University and beyond to build innovative hardware projects. Organized by the Humanoid Robot Club at Purdue University, we're setting an official World Record for World's Largest Hardware Hackathon." />
	<meta property="og:title" content="StarkHacks" />
	<meta property="og:description" content="Stark Hacks is the world's largest hardware hackathon and the premier Purdue hardware hackathon, a 36-hour engineering marathon where ideas come off the screen and into real circuits. This Indiana hardware hackathon brings together hundreds of students from Purdue University and beyond to build innovative hardware projects. Organized by the Humanoid Robot Club at Purdue University, we're setting an official World Record for World's Largest Hardware Hackathon." />
	<meta name="twitter:title" content="StarkHacks" />
	<meta name="twitter:description" content="Stark Hacks is the world's largest hardware hackathon and the premier Purdue hardware hackathon, a 36-hour engineering marathon where ideas come off the screen and into real circuits. This Indiana hardware hackathon brings together hundreds of students from Purdue University and beyond to build innovative hardware projects." />
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
