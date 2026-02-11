<script>
	let audioEnabled = false;

	function toggleAudio() {
		audioEnabled = !audioEnabled;
		
		if (audioEnabled) {
			// Dispatch event to enable/unmute all audio
			window.dispatchEvent(new CustomEvent('audio-global-enable'));
		} else {
			// Dispatch event to disable/mute all audio
			window.dispatchEvent(new CustomEvent('audio-global-disable'));
		}
	}
</script>

<button 
	class="audio-control" 
	on:click={toggleAudio}
	aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
	title={audioEnabled ? 'Click to mute' : 'Click to unmute'}
>
	<img 
		src={audioEnabled ? '/lever down.png' : '/lever up.png'} 
		alt={audioEnabled ? 'Audio on' : 'Audio off'}
		class="lever-img"
	/>
</button>

<style>
	.audio-control {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 9999;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: transform 0.1s ease;
	}

	.audio-control:hover {
		transform: scale(1.1);
	}

	.audio-control:active {
		transform: scale(0.95);
	}

	.lever-img {
		width: 100px;
		height: auto;
		display: block;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	@media (max-width: 768px) {
		.audio-control {
			bottom: 15px;
			right: 15px;
		}

		.lever-img {
			width: 70px;
		}
	}
</style>
