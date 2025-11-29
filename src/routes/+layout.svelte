<script>
	import '../app.css';
</script>

<slot />

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
	
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

