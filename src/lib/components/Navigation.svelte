<script>
	import navStyles from '../styles/navigation.module.css';
	import { getApplyUrl } from '../utils/applyRedirect';
	import { onMount } from 'svelte';
	
	let mobileMenuOpen = false;
	let menuElement;
	let toggleButton;
	
	function toggleMobileMenu() {
		// Only toggle on mobile/tablet
		if (window.innerWidth > 1024) return;
		
		mobileMenuOpen = !mobileMenuOpen;
		
		if (menuElement) {
			if (mobileMenuOpen) {
				menuElement.classList.add('open');
				menuElement.style.transform = 'translateX(0)';
			} else {
				menuElement.classList.remove('open');
				menuElement.style.transform = 'translateX(100%)';
			}
		}
		
		if (toggleButton) {
			toggleButton.setAttribute('aria-expanded', mobileMenuOpen);
		}
	}
	
	function closeMenu() {
		// Only close on mobile/tablet
		if (window.innerWidth > 1024) return;
		
		mobileMenuOpen = false;
		if (menuElement) {
			menuElement.classList.remove('open');
			menuElement.style.transform = 'translateX(100%)';
		}
		if (toggleButton) {
			toggleButton.setAttribute('aria-expanded', 'false');
		}
	}
	
	onMount(() => {
		// Ensure menu is closed on mount, but only apply transform on mobile
		if (menuElement && window.innerWidth <= 1024) {
			menuElement.classList.remove('open');
			menuElement.style.transform = 'translateX(100%)';
		} else if (menuElement) {
			// On desktop, ensure no transform is applied
			menuElement.style.transform = '';
		}
	});
</script>

<nav class={navStyles.nav}>
	<div class={navStyles.container}>
		<a href="/" class={navStyles.logo}>
			<img src="/StarkHacks.svg" alt="StarkHacks" class={navStyles.logoImg} />
		</a>
		
		<button 
			bind:this={toggleButton}
			class={navStyles.mobileToggle}
			on:click={toggleMobileMenu}
			aria-label="Toggle menu"
			aria-expanded={mobileMenuOpen}
		>
			<span></span>
			<span></span>
			<span></span>
		</button>
		
		<ul bind:this={menuElement} class={navStyles.menu} role="menubar">
			<li role="none"><a href="#about" class={navStyles.link} on:click={closeMenu} role="menuitem">ABOUT</a></li>
			<li role="none"><a href="#tracks" class={navStyles.link} on:click={closeMenu} role="menuitem">TRACKS</a></li>
			<li role="none"><a href="#speakers" class={navStyles.link} on:click={closeMenu} role="menuitem">SPEAKERS</a></li>
			<li role="none"><a href="#sponsors" class={navStyles.link} on:click={closeMenu} role="menuitem">SPONSORS</a></li>
			<li role="none"><a href="#faq" class={navStyles.link} on:click={closeMenu} role="menuitem">FAQ</a></li>
			<li role="none">
				<a href={getApplyUrl()} target="_blank" rel="noopener noreferrer" class={navStyles.joinButton} on:click={closeMenu} role="menuitem">
					<img src="/apply-box.svg" alt="" class={navStyles.applyBoxSvg} />
					<img src="/apply-text.svg" alt="APPLY" class={navStyles.applyTextSvg} />
				</a>
			</li>
		</ul>
	</div>
</nav>
