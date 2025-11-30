<script>
	import navStyles from '../styles/navigation.module.css';
	import { getApplyUrl } from '../utils/applyRedirect';
	
	let mobileMenuOpen = false;
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
	
	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<nav class={navStyles.nav}>
	<div class={navStyles.container}>
		<a href="/" class={navStyles.logo}>
			<img src="/StarkHacks.svg" alt="StarkHacks" class={navStyles.logoImg} />
		</a>
		
		<button 
			class={navStyles.mobileToggle}
			onclick={toggleMobileMenu}
			aria-label="Toggle menu"
			aria-expanded={mobileMenuOpen}
		>
			<span></span>
			<span></span>
			<span></span>
		</button>
		
		<ul class={navStyles.menu} class:open={mobileMenuOpen} role="menubar">
			<li role="none"><a href="#about" class={navStyles.link} onclick={closeMenu} role="menuitem">ABOUT</a></li>
			<li role="none"><a href="#tracks" class={navStyles.link} onclick={closeMenu} role="menuitem">TRACKS</a></li>
			<li role="none"><a href="#speakers" class={navStyles.link} onclick={closeMenu} role="menuitem">SPEAKERS</a></li>
			<li role="none"><a href="#sponsors" class={navStyles.link} onclick={closeMenu} role="menuitem">SPONSORS</a></li>
			<li role="none"><a href="#faq" class={navStyles.link} onclick={closeMenu} role="menuitem">FAQ</a></li>
			<li role="none">
				<a href={getApplyUrl()} class={navStyles.joinButton} onclick={closeMenu} role="menuitem">
					<img src="/apply-box.svg" alt="" class={navStyles.applyBoxSvg} />
					<img src="/apply-text.svg" alt="APPLY" class={navStyles.applyTextSvg} />
				</a>
			</li>
		</ul>
	</div>
</nav>
