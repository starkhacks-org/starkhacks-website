<script>
	import footerStyles from '../styles/footer.module.css';
</script>

<footer class={footerStyles.footer}>
	<div class={footerStyles.content}>
		<p class={footerStyles.text}>
			Made with <img src="/heart.svg" alt="heart" class={footerStyles.heart} /> by the
		</p>
		<p class={footerStyles.clubName}>
			<a href="https://humanoidrobot.club/" class={footerStyles.clubLink}>humanoid robot club</a>
		</p>
		<div class={footerStyles.socialMedia}>
			<a href="https://www.instagram.com/humanoid.purdue/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class={footerStyles.socialLink}>
				<img src="/icon-instagram.svg" alt="Instagram" class={footerStyles.socialIcon} />
			</a>
			<a href="https://www.linkedin.com/company/humanoid-purdue/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class={footerStyles.socialLink}>
				<img src="/icon-linkedin.svg" alt="LinkedIn" class={footerStyles.socialIcon} />
			</a>
			<a href="https://x.com/HumanoidPurdue" target="_blank" rel="noopener noreferrer" aria-label="Twitter" class={footerStyles.socialLink}>
				<img src="/icon-twitter.svg" alt="Twitter" class={footerStyles.socialIcon} />
			</a>
		</div>
		<p class={footerStyles.copyright}>
			© 2025 Humanoid Robot Club
		</p>
	</div>
</footer>

