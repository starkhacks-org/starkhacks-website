<script>
	import navStyles from '../styles/navigation.module.css';
	import { getApplyUrl } from '../utils/applyRedirect';
	import { onMount } from 'svelte';
	
	let mobileMenuOpen = false;
	let menuElement;
	let toggleButton;
	let clickSound = null;
	
	function playClickSound() {
		if (clickSound) {
			clickSound.currentTime = 0;
			clickSound.play().catch(() => {});
		}
	}
	
	function handleNavClick() {
		playClickSound();
		closeMenu();
	}
	
	function toggleMobileMenu() {
		// Only toggle on mobile/tablet
		if (window.innerWidth > 1024) return;
		
		playClickSound();
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
		// Set up click sound
		clickSound = new Audio('/edr-switch-click-and-beep-001a-11602.mp3');
		clickSound.volume = 0.5;
		clickSound.preload = 'auto';
		
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
			<li role="none"><a href="#about" class={navStyles.link} on:click={handleNavClick} role="menuitem">ABOUT</a></li>
			<li role="none"><a href="#tracks" class={navStyles.link} on:click={handleNavClick} role="menuitem">TRACKS</a></li>
			<li role="none"><a href="#speakers" class={navStyles.link} on:click={handleNavClick} role="menuitem">SPEAKERS</a></li>
			<li role="none"><a href="#sponsors" class={navStyles.link} on:click={handleNavClick} role="menuitem">SPONSORS</a></li>
			<li role="none"><a href="#faq" class={navStyles.link} on:click={handleNavClick} role="menuitem">FAQ</a></li>
			<li role="none" class={navStyles.socialMediaContainer}>
				<a href="https://www.instagram.com/humanoid.purdue/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class={navStyles.socialLink} on:click={playClickSound}>
					<img src="/icon-instagram.svg" alt="Instagram" class={navStyles.socialIcon} />
				</a>
				<a href="https://www.linkedin.com/company/starkhacks/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class={navStyles.socialLink} on:click={playClickSound}>
					<img src="/icon-linkedin.svg" alt="LinkedIn" class={navStyles.socialIcon} />
				</a>
				<a href="https://x.com/HumanoidPurdue" target="_blank" rel="noopener noreferrer" aria-label="Twitter" class={navStyles.socialLink} on:click={playClickSound}>
					<img src="/icon-twitter.svg" alt="Twitter" class={navStyles.socialIcon} />
				</a>
			</li>
			<li role="none">
				<a href={getApplyUrl()} target="_blank" rel="noopener noreferrer" class={navStyles.joinButton} on:click={handleNavClick} role="menuitem">
					<img src="/apply-box.svg" alt="" class={navStyles.applyBoxSvg} />
					<img src="/apply-text.svg" alt="APPLY" class={navStyles.applyTextSvg} />
				</a>
			</li>
		</ul>
	</div>
</nav>
