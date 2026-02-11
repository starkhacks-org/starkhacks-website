<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import lampStyles from '../styles/lamp-intro.module.css';

	const dispatch = createEventDispatcher();

	let introCanvas;  // fixed canvas for intro animation
	let steadyCanvas;  // absolute canvas for persistent lamp in hero
	let ctx;           // current drawing context
	let animationId;
	let width = 0;
	let height = 0;

	// Animation state
	let startTime = 0;
	let phase = 'drop'; // 'drop' | 'bounce' | 'waiting' | 'flicker' | 'reveal' | 'steady'
	let introComplete = false;
	let showDarkOverlay = true;
	let revealOpacity = 1; // separate opacity for the dark overlay fade
	let waitingForLever = false;
	let leverSpotlightIntensity = 0;

	// Lamp geometry
	const PIVOT_X_RATIO = 0.30;
	let pivotX = 0;
	let pivotY = 0;
	let restLength = 0;
	const LAMP_WIDTH = 50;
	const LAMP_HEIGHT = 70;

	// Vertical bounce physics
	let yStretch = 0;
	let yVelocity = 0;
	const SPRING_K = 0.12;
	const SPRING_DAMP = 0.88;

	// Drop animation
	let dropProgress = 0;

	// Wire wiggle
	let wiggleAmplitude = 8;
	let wiggleTime = 0;

	// Light state
	let bulbBrightness = 0;
	let revealRadius = 0;
	let flickerPhase = 0;
	let overlayOpacity = 1;

	function initGeometry() {
		pivotX = width * PIVOT_X_RATIO;
		pivotY = -10;
		restLength = height * 0.42;
	}

	function getLampPosition() {
		const currentLength = restLength * dropProgress + yStretch;
		return { x: pivotX, y: pivotY + currentLength };
	}

	// ── Draw functions ────────────────────────────────────

	function drawWire(lampPos) {
		ctx.save();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 3.5;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';

		const segments = 30;
		const totalLen = lampPos.y - pivotY;

		ctx.beginPath();
		ctx.moveTo(pivotX, pivotY);
		for (let i = 1; i <= segments; i++) {
			const t = i / segments;
			const y = pivotY + totalLen * t;
			const envelope = Math.sin(t * Math.PI);
			const freq1 = Math.sin(t * 12 + wiggleTime * 8) * 0.6;
			const freq2 = Math.sin(t * 7 - wiggleTime * 5) * 0.4;
			const dx = (freq1 + freq2) * envelope * wiggleAmplitude;
			ctx.lineTo(pivotX + dx, y);
		}
		ctx.stroke();

		// Subtle highlight edge
		ctx.strokeStyle = 'rgba(60, 60, 60, 0.4)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(pivotX + 1.5, pivotY);
		for (let i = 1; i <= segments; i++) {
			const t = i / segments;
			const y = pivotY + totalLen * t;
			const envelope = Math.sin(t * Math.PI);
			const freq1 = Math.sin(t * 12 + wiggleTime * 8) * 0.6;
			const freq2 = Math.sin(t * 7 - wiggleTime * 5) * 0.4;
			const dx = (freq1 + freq2) * envelope * wiggleAmplitude;
			ctx.lineTo(pivotX + dx + 1.5, y);
		}
		ctx.stroke();
		ctx.restore();
	}

	function drawCage(lampPos) {
		const cx = lampPos.x;
		const cy = lampPos.y;
		const w = LAMP_WIDTH;
		const h = LAMP_HEIGHT;

		ctx.save();
		ctx.translate(cx, cy);

		// Socket at top
		ctx.fillStyle = '#2a2a2a';
		ctx.strokeStyle = '#444';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		// Socket body
		ctx.fillStyle = '#1e1e1e';
		ctx.fillRect(-7, 0, 14, 10);
		ctx.strokeStyle = '#444';
		ctx.strokeRect(-7, 0, 14, 10);

		// Cage struts — industrial wireframe
		const strutColor = bulbBrightness > 0.1
			? `rgba(${80 + bulbBrightness * 80}, ${60 + bulbBrightness * 40}, ${30 + bulbBrightness * 20}, 0.9)`
			: '#333';
		ctx.strokeStyle = strutColor;
		ctx.lineWidth = 1.6;

		// Top ring
		const topY = 12;
		const topW = 12;
		ctx.beginPath();
		ctx.ellipse(0, topY, topW, 3.5, 0, 0, Math.PI * 2);
		ctx.stroke();

		// Bottom ring (wider)
		const botY = h - 8;
		const botW = w / 2 - 4;
		ctx.beginPath();
		ctx.ellipse(0, botY, botW, 4.5, 0, 0, Math.PI * 2);
		ctx.stroke();

		// Vertical struts
		const numStruts = 6;
		for (let i = 0; i < numStruts; i++) {
			const a = (i / numStruts) * Math.PI * 2;
			const tx = Math.cos(a) * topW;
			const ty = topY + Math.sin(a) * 3.5;
			const bx = Math.cos(a) * botW;
			const by = botY + Math.sin(a) * 4.5;

			ctx.beginPath();
			ctx.moveTo(tx, ty);
			const mx = Math.cos(a) * (botW + 3);
			const my = (ty + by) / 2;
			ctx.quadraticCurveTo(mx, my, bx, by);
			ctx.stroke();
		}

		// Middle ring
		const midY = (topY + botY) / 2;
		const midW = botW + 1.5;
		ctx.beginPath();
		ctx.ellipse(0, midY, midW, 4, 0, 0, Math.PI * 2);
		ctx.stroke();

		// Bottom cap
		ctx.beginPath();
		ctx.moveTo(-7, botY + 3);
		ctx.lineTo(0, botY + 12);
		ctx.lineTo(7, botY + 3);
		ctx.strokeStyle = strutColor;
		ctx.lineWidth = 1.4;
		ctx.stroke();

		ctx.restore();
	}

	function drawBulb(lampPos) {
		if (bulbBrightness < 0.01) {
			ctx.save();
			ctx.translate(lampPos.x, lampPos.y + LAMP_HEIGHT * 0.38);
			ctx.fillStyle = '#1a1a1a';
			ctx.strokeStyle = '#333';
			ctx.lineWidth = 0.8;
			ctx.beginPath();
			ctx.ellipse(0, 0, 7, 12, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
			return;
		}

		const b = bulbBrightness;
		ctx.save();
		ctx.translate(lampPos.x, lampPos.y + LAMP_HEIGHT * 0.38);

		// Outer glow — large radial
		const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 140 * b);
		outerGlow.addColorStop(0, `rgba(255, 180, 60, ${0.18 * b})`);
		outerGlow.addColorStop(0.35, `rgba(255, 140, 40, ${0.07 * b})`);
		outerGlow.addColorStop(1, 'rgba(255, 140, 40, 0)');
		ctx.fillStyle = outerGlow;
		ctx.fillRect(-180, -180, 360, 360);

		// Inner glow
		const innerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 45 * b);
		innerGlow.addColorStop(0, `rgba(255, 220, 130, ${0.55 * b})`);
		innerGlow.addColorStop(0.5, `rgba(255, 170, 60, ${0.22 * b})`);
		innerGlow.addColorStop(1, 'rgba(255, 140, 40, 0)');
		ctx.fillStyle = innerGlow;
		ctx.fillRect(-70, -70, 140, 140);

		// Bulb shape
		const bulbGrad = ctx.createRadialGradient(0, -2, 2, 0, 0, 11);
		bulbGrad.addColorStop(0, `rgba(255, 240, 200, ${b})`);
		bulbGrad.addColorStop(0.6, `rgba(255, 190, 80, ${b * 0.8})`);
		bulbGrad.addColorStop(1, `rgba(255, 140, 40, ${b * 0.4})`);
		ctx.fillStyle = bulbGrad;
		ctx.beginPath();
		ctx.ellipse(0, 0, 7, 12, 0, 0, Math.PI * 2);
		ctx.fill();

		// Filament
		ctx.strokeStyle = `rgba(255, 255, 200, ${b * 0.9})`;
		ctx.lineWidth = 0.7;
		ctx.beginPath();
		ctx.moveTo(-2.5, -7);
		ctx.lineTo(-1, -2);
		ctx.lineTo(1, -5);
		ctx.lineTo(2.5, -1);
		ctx.stroke();

		ctx.restore();
	}

	function drawRevealMask(lampPos) {
		const bulbX = lampPos.x;
		const bulbY = lampPos.y + LAMP_HEIGHT * 0.38;

		// Draw the black overlay first
		ctx.save();
		ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
		ctx.fillRect(0, 0, width, height);

		// Cut out the spotlight areas using destination-out
		ctx.globalCompositeOperation = 'destination-out';

		// Draw lever spotlight (bottom-right corner) - cuts a hole in the darkness
		if (leverSpotlightIntensity > 0) {
			const leverX = width - 70; // Approximate lever center
			const leverY = height - 70;
			const spotlightRadius = 200;
			
			const leverGrad = ctx.createRadialGradient(leverX, leverY, 0, leverX, leverY, spotlightRadius);
			leverGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
			leverGrad.addColorStop(0.3, 'rgba(0, 0, 0, 1)');
			leverGrad.addColorStop(0.6, `rgba(0, 0, 0, ${leverSpotlightIntensity * 0.7})`);
			leverGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = leverGrad;
			ctx.beginPath();
			ctx.arc(leverX, leverY, spotlightRadius, 0, Math.PI * 2);
			ctx.fill();
		}

		// Draw lamp reveal (if active)
		if (revealRadius > 0) {
			const grad = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, revealRadius);
			grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
			grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.8)');
			grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, width, height);
		}

		ctx.globalCompositeOperation = 'source-over';
		ctx.restore();

		// Draw a warm glow effect on top of the lever area (additive)
		if (leverSpotlightIntensity > 0) {
			ctx.save();
			const leverX = width - 70;
			const leverY = height - 70;
			const glowRadius = 180;
			
			const glowGrad = ctx.createRadialGradient(leverX, leverY, 0, leverX, leverY, glowRadius);
			const glowAlpha = leverSpotlightIntensity * 0.5;
			glowGrad.addColorStop(0, `rgba(212, 160, 74, ${glowAlpha})`);
			glowGrad.addColorStop(0.4, `rgba(212, 160, 74, ${glowAlpha * 0.6})`);
			glowGrad.addColorStop(0.7, `rgba(212, 160, 74, ${glowAlpha * 0.3})`);
			glowGrad.addColorStop(1, 'rgba(212, 160, 74, 0)');
			ctx.fillStyle = glowGrad;
			ctx.beginPath();
			ctx.arc(leverX, leverY, glowRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}

	// ── Draw lamp on the hero-positioned steady canvas ────

	function drawSteadyLamp() {
		if (!steadyCanvas) return;
		const sCtx = steadyCanvas.getContext('2d');
		if (!sCtx) return;
		const w = steadyCanvas.width;
		const h = steadyCanvas.height;
		sCtx.clearRect(0, 0, w, h);

		// Use same geometry
		const lampPos = { x: pivotX, y: pivotY + restLength };
		const prevCtx = ctx;
		ctx = sCtx;
		bulbBrightness = 1;
		wiggleAmplitude = 0;
		drawWire(lampPos);
		drawCage(lampPos);
		drawBulb(lampPos);
		ctx = prevCtx;
	}

	// ── Animation loop ── total < 3s ──────────────────────

	function animate(timestamp) {
		if (!ctx) return;

		if (!startTime) startTime = timestamp;
		const elapsed = (timestamp - startTime) / 1000;

		ctx.clearRect(0, 0, width, height);

		// ── Phase: DROP (0–0.3s) ──
		if (phase === 'drop') {
			dropProgress = Math.min(1, elapsed / 0.3);
			dropProgress = 1 - Math.pow(1 - dropProgress, 3);
			wiggleTime = elapsed;
			wiggleAmplitude = 8 * dropProgress;
			yStretch = 0;
			yVelocity = 0;

			if (elapsed >= 0.3) {
				phase = 'bounce';
				dropProgress = 1;
				yVelocity = 4;
			}
		}

		// ── Phase: BOUNCE (0.3–1.0s) ──
		if (phase === 'bounce') {
			const springForce = -SPRING_K * yStretch;
			yVelocity += springForce;
			yVelocity *= SPRING_DAMP;
			yStretch += yVelocity;

			wiggleTime = elapsed;
			const bounceElapsed = elapsed - 0.3;
			wiggleAmplitude = 8 * Math.exp(-bounceElapsed * 4);

			if ((Math.abs(yStretch) < 0.4 && Math.abs(yVelocity) < 0.1) || elapsed >= 1.0) {
				phase = 'waiting';
				yStretch = 0;
				yVelocity = 0;
				waitingForLever = true;
			}
		}

		// ── Phase: WAITING — lamp is down but dark, spotlight on lever ──
		if (phase === 'waiting') {
			yStretch = 0;
			wiggleAmplitude = 0;
			bulbBrightness = 0;
			
			// Fade in the lever spotlight with pulsing effect
			const pulseSpeed = 0.03;
			leverSpotlightIntensity = 0.7 + 0.3 * Math.sin(Date.now() * 0.003);
			
			// Stay in this phase until lever is pulled
		}

		// ── Phase: FLICKER (after lever pull) ──
		if (phase === 'flicker') {
			yStretch = 0;
			wiggleTime = elapsed;
			wiggleAmplitude = Math.max(0, wiggleAmplitude - 0.2);

			flickerPhase += 0.022;
			if (flickerPhase < 0.2) {
				bulbBrightness = Math.random() < 0.5 ? 0.15 + Math.random() * 0.3 : 0;
			} else if (flickerPhase < 0.4) {
				bulbBrightness = 0.35 + Math.random() * 0.3;
				if (Math.random() < 0.15) bulbBrightness = 0.05;
			} else if (flickerPhase < 0.6) {
				bulbBrightness = 0.65 + Math.random() * 0.2;
				if (Math.random() < 0.06) bulbBrightness = 0.3;
			} else {
				bulbBrightness = Math.min(1, bulbBrightness + 0.04);
				if (bulbBrightness >= 0.99) {
					bulbBrightness = 1;
					phase = 'reveal';
				}
			}
		}

		// ── Phase: REVEAL (1.8–2.8s) — radial light reveal ──
		if (phase === 'reveal') {
			bulbBrightness = 1;
			wiggleAmplitude = 0;
			yStretch = 0;

			const maxRadius = Math.sqrt(width * width + height * height);
			revealRadius += maxRadius * 0.04; // slower, more visible reveal

			// Start fading dark overlay once reveal is well visible
			if (revealRadius > maxRadius * 0.5) {
				overlayOpacity = Math.max(0, overlayOpacity - 0.05);
				revealOpacity = Math.max(0, revealOpacity - 0.06);
			}

			// Transition to steady once overlay is gone
			if (overlayOpacity <= 0 && revealOpacity <= 0) {
				phase = 'steady';
				introComplete = true;
				showDarkOverlay = false;

				// Draw the lamp on the steady (hero-positioned) canvas
				drawSteadyLamp();

				dispatch('complete');
				window.dispatchEvent(new CustomEvent('lamp-intro-complete'));
				return;
			}
		}

		// ── Phase: STEADY — stop intro animation ──
		if (phase === 'steady') {
			return;
		}

		const lampPos = getLampPosition();

		// Draw dark overlay with radial reveal hole
		drawRevealMask(lampPos);

		// Draw lamp on top
		drawWire(lampPos);
		drawCage(lampPos);
		drawBulb(lampPos);

		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		width = window.innerWidth;
		height = window.innerHeight;

		if (introCanvas) {
			introCanvas.width = width;
			introCanvas.height = height;
		}
		if (steadyCanvas) {
			steadyCanvas.width = width;
			steadyCanvas.height = height;
		}

		initGeometry();

		if (phase === 'steady') {
			drawSteadyLamp();
		}
	}

	function handleLeverPulled() {
		if (phase === 'waiting') {
			phase = 'flicker';
			flickerPhase = 0;
			leverSpotlightIntensity = 0;
			waitingForLever = false;
		}
	}

	onMount(() => {
		if (window.innerWidth <= 768) {
			phase = 'steady';
			introComplete = true;
			showDarkOverlay = false;
			dispatch('complete');
			window.dispatchEvent(new CustomEvent('lamp-intro-complete'));
			return;
		}

		// Listen for lever pull event
		window.addEventListener('lever-pulled', handleLeverPulled);

		if (introCanvas) {
			ctx = introCanvas.getContext('2d');
			handleResize();
			animationId = requestAnimationFrame(animate);
			window.addEventListener('resize', handleResize);
		} else {
			// Safety fallback — skip intro if canvas not available
			phase = 'steady';
			introComplete = true;
			showDarkOverlay = false;
			dispatch('complete');
			window.dispatchEvent(new CustomEvent('lamp-intro-complete'));
		}
	});

	onDestroy(() => {
		if (animationId) cancelAnimationFrame(animationId);
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('lever-pulled', handleLeverPulled);
		}
	});
</script>

<!-- Dark overlay: only during intro, removed entirely after -->
{#if showDarkOverlay}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class={lampStyles.darkOverlay}
		style="opacity: {revealOpacity}; cursor: default;"
	></div>
{/if}

<!-- Intro canvas: fixed, full-screen, above the dark overlay -->
{#if !introComplete}
	<canvas bind:this={introCanvas} class={lampStyles.introCanvas}></canvas>
{/if}

<!-- Steady canvas: absolute within hero, always present for the persistent lamp -->
<div class={lampStyles.overlay}>
	<canvas bind:this={steadyCanvas} class={lampStyles.canvas}></canvas>
</div>
