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
