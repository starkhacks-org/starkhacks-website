<script>
	import { onMount, onDestroy } from 'svelte';
	import sparkStyles from '../styles/electric-sparks.module.css';

	let canvas;
	let ctx;
	let animationId;
	let sparks = [];
	let particles = [];
	let embers = [];
	let width = 0;
	let height = 0;
	let frameCount = 0;

	// ── Audio — ambient electric sparks + rusty gears loops ──
	let electricAudio = null;
	let gearsAudio = null;
	let audioStarted = false;
	let audioUnlocked = false;
	let audioRetryInterval = null;
	let audioMuted = false; // For speakers section muting
	let globalAudioEnabled = false; // Global audio control

	function startAudio() {
		if (audioStarted || !globalAudioEnabled) return;

		const promises = [];
		if (electricAudio) {
			promises.push(electricAudio.play().catch(() => null));
		}
		if (gearsAudio) {
			promises.push(gearsAudio.play().catch(() => null));
		}

		Promise.all(promises).then((results) => {
			// If at least one resolved (not null from catch), audio is working
			if (results.some(r => r !== null) || results.length === 0) {
				audioStarted = true;
				audioUnlocked = true;
				if (audioRetryInterval) {
					clearInterval(audioRetryInterval);
					audioRetryInterval = null;
				}
			}
		});
	}

	function stopAudioCompletely() {
		if (electricAudio) {
			electricAudio.pause();
			electricAudio.currentTime = 0;
		}
		if (gearsAudio) {
			gearsAudio.pause();
			gearsAudio.currentTime = 0;
		}
		audioStarted = false;
	}

	// Keep retrying audio every 500ms until it works
	function startAudioRetryLoop() {
		if (audioRetryInterval || !globalAudioEnabled) return;
		audioRetryInterval = setInterval(() => {
			if (audioStarted) {
				clearInterval(audioRetryInterval);
				audioRetryInterval = null;
				return;
			}
			startAudio();
		}, 500);
	}

	function handleGlobalAudioEnable() {
		globalAudioEnabled = true;
		startAudio();
		startAudioRetryLoop();
	}

	function handleGlobalAudioDisable() {
		globalAudioEnabled = false;
		stopAudioCompletely();
		if (audioRetryInterval) {
			clearInterval(audioRetryInterval);
			audioRetryInterval = null;
		}
	}

	// Track which sections want audio muted
	let mutedBy = new Set();

	function muteAudio(source) {
		mutedBy.add(source);
		if (electricAudio) electricAudio.volume = 0;
		if (gearsAudio) gearsAudio.volume = 0;
	}

	function unmuteAudio(source) {
		mutedBy.delete(source);
		// Only unmute if no other section wants it muted
		if (mutedBy.size === 0) {
			if (electricAudio) electricAudio.volume = 0.3;
			if (gearsAudio) gearsAudio.volume = 0.25;
		}
	}

	function handleSpeakersEnter() {
		muteAudio('speakers');
	}

	function handleSpeakersLeave() {
		unmuteAudio('speakers');
	}

	function handleFaqEnter() {
		muteAudio('faq');
	}

	function handleFaqLeave() {
		unmuteAudio('faq');
	}

	function handleSponsorsEnter() {
		muteAudio('sponsors');
	}

	function handleSponsorsLeave() {
		unmuteAudio('sponsors');
	}

	function handleApplyEnter() {
		muteAudio('apply');
	}

	function handleApplyLeave() {
		unmuteAudio('apply');
	}

	function handleFooterEnter() {
		muteAudio('footer');
	}

	function handleFooterLeave() {
		unmuteAudio('footer');
	}

	function handleTracksEnter() {
		// In tracks section: gears louder, electricity quieter
		if (electricAudio) electricAudio.volume = 0.15;
		if (gearsAudio) gearsAudio.volume = 0.4;
	}

	function handleTracksLeave() {
		// Restore normal volumes (if not muted by another section)
		if (mutedBy.size === 0) {
			if (electricAudio) electricAudio.volume = 0.3;
			if (gearsAudio) gearsAudio.volume = 0.25;
		}
	}

	// ── Color palettes ────────────────────────────────────
	// Rusty electrical — warm amber, muted, not neon
	const WIRE_COLORS = {
		core: '#ffe4b5',          // moccasin / warm white
		inner: '#d4943a',         // rusty gold
		mid: '#b87333',           // copper
		outer: '#8b5e2b',         // dark rusty brown
		glow: 'rgba(180, 115, 51, 0.4)',
	};

	// Friction/gear sparks — hot metal reddish-orange
	const GEAR_COLORS = {
		core: '#ffdab0',          // warm white-peach
		inner: '#e85a30',         // red-orange
		mid: '#cc3d1a',           // dark red
		outer: '#8b2500',         // burnt red
		glow: 'rgba(204, 61, 26, 0.35)',
	};

	// Particle colors
	const PARTICLE_COLORS_WIRE = ['#d4943a', '#b87333', '#c4853a', '#ffe4b5'];
	const PARTICLE_COLORS_GEAR = ['#e85a30', '#ff7744', '#cc3d1a', '#ffa060'];

	// ── Spark sources ─────────────────────────────────────
	const SPARK_SOURCES = [];

	function initSources() {
		SPARK_SOURCES.length = 0;

		// Top-left — wires dangling from above, a few sparks
		SPARK_SOURCES.push(
			{ x: width * 0.08, y: 0, side: 'top-left', dirX: 0.3, dirY: 1, type: 'wire' },
			{ x: width * 0.18, y: 0, side: 'top-left', dirX: 0.5, dirY: 1, type: 'wire' },
		);

		// Bottom-left — loose wires
		SPARK_SOURCES.push(
			{ x: 0, y: height * 0.85, side: 'left', dirX: 1, dirY: -0.8, type: 'wire' },
			{ x: 0, y: height * 0.92, side: 'left', dirX: 1, dirY: -0.4, type: 'wire' },
		);

		// Right side — gear friction sparks
		SPARK_SOURCES.push(
			{ x: width, y: height * 0.35, side: 'right', dirX: -1, dirY: 0.3, type: 'gear' },
			{ x: width, y: height * 0.55, side: 'right', dirX: -1, dirY: -0.2, type: 'gear' },
		);
	}

	// ── Spark class ───────────────────────────────────────
	class Spark {
		constructor(source) {
			this.source = source;
			this.type = source.type; // 'wire' or 'gear'
			this.colors = this.type === 'gear' ? GEAR_COLORS : WIRE_COLORS;
			this.segments = [];
			this.life = 0;
			this.maxLife = 25 + Math.random() * 30;
			this.opacity = 0;
			this.peakOpacity = 0.8 + Math.random() * 0.2;
			this.branches = [];
			this.generatePath();
		}

		generatePath() {
			const { x, y, dirX, dirY } = this.source;
			// Longer arcs
			const length = 100 + Math.random() * 180;
			// More segments = more crooked
			const segments = 8 + Math.floor(Math.random() * 6);
			
			let cx = x;
			let cy = y;
			this.segments.push({ x: cx, y: cy });

			for (let i = 0; i < segments; i++) {
				const progress = i / segments;
				const stepLen = length / segments;

				// Very crooked: large random lateral jitter relative to direction
				// Zigzag by alternating the perpendicular offset
				const zigzag = (i % 2 === 0 ? 1 : -1) * (8 + Math.random() * 18);
				// Perpendicular to main direction
				const perpX = -dirY;
				const perpY = dirX;

				cx += dirX * stepLen + perpX * zigzag + (Math.random() - 0.5) * 14;
				cy += dirY * stepLen + perpY * zigzag + (Math.random() - 0.5) * 14;
				this.segments.push({ x: cx, y: cy });

				// Branches — more for wire type, fewer for gear
				const branchChance = this.type === 'wire' ? 0.3 : 0.18;
				if (Math.random() < branchChance && progress > 0.15) {
					const branch = [];
					let bx = cx;
					let by = cy;
					const branchLen = 1 + Math.floor(Math.random() * 3);
					for (let j = 0; j < branchLen; j++) {
						const bZig = (j % 2 === 0 ? 1 : -1) * (5 + Math.random() * 12);
						bx += dirX * (stepLen * 0.4) + perpX * bZig + (Math.random() - 0.5) * 10;
						by += dirY * (stepLen * 0.4) + perpY * bZig + (Math.random() - 0.5) * 10;
						branch.push({ x: bx, y: by });
					}
					this.branches.push({ start: { x: cx, y: cy }, points: branch });
				}
			}
		}

		update() {
			this.life++;
			const t = this.life / this.maxLife;
			
			// Smooth fade in / out
			if (t < 0.1) {
				this.opacity = this.peakOpacity * (t / 0.1);
			} else if (t > 0.45) {
				this.opacity = this.peakOpacity * Math.max(0, 1 - (t - 0.45) / 0.55);
			} else {
				this.opacity = this.peakOpacity;
			}

			// Flicker
			if (Math.random() < 0.2) {
				this.opacity *= 0.6 + Math.random() * 0.4;
			}
			return this.life < this.maxLife;
		}

		draw(ctx) {
			if (this.segments.length < 2) return;
			const a = this.opacity;
			if (a < 0.01) return;
			const c = this.colors;

			// Glow
			ctx.save();
			ctx.globalAlpha = a * 0.3;
			ctx.strokeStyle = c.glow;
			ctx.lineWidth = 7;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'bevel'; // bevel = sharper corners = more jagged look
			ctx.shadowColor = c.outer;
			ctx.shadowBlur = 20;
			this.drawPath(ctx, this.segments);
			ctx.restore();

			// Outer
			ctx.save();
			ctx.globalAlpha = a * 0.55;
			ctx.strokeStyle = c.outer;
			ctx.lineWidth = 3.5;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'bevel';
			ctx.shadowColor = c.mid;
			ctx.shadowBlur = 12;
			this.drawPath(ctx, this.segments);
			ctx.restore();

			// Mid
			ctx.save();
			ctx.globalAlpha = a * 0.75;
			ctx.strokeStyle = c.mid;
			ctx.lineWidth = 2;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'bevel';
			this.drawPath(ctx, this.segments);
			ctx.restore();

			// Core
			ctx.save();
			ctx.globalAlpha = a * 0.95;
			ctx.strokeStyle = c.core;
			ctx.lineWidth = 1;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'bevel';
			ctx.shadowColor = c.inner;
			ctx.shadowBlur = 6;
			this.drawPath(ctx, this.segments);
			ctx.restore();

			// Branches
			for (const branch of this.branches) {
				if (branch.points.length === 0) continue;
				const bp = [branch.start, ...branch.points];
				ctx.save();
				ctx.globalAlpha = a * 0.35;
				ctx.strokeStyle = c.mid;
				ctx.lineWidth = 1.2;
				ctx.lineCap = 'round';
				ctx.lineJoin = 'bevel';
				ctx.shadowColor = c.outer;
				ctx.shadowBlur = 8;
				this.drawPath(ctx, bp);
				ctx.restore();

				ctx.save();
				ctx.globalAlpha = a * 0.55;
				ctx.strokeStyle = c.core;
				ctx.lineWidth = 0.5;
				ctx.lineCap = 'round';
				this.drawPath(ctx, bp);
				ctx.restore();
			}
		}

		drawPath(ctx, pts) {
			ctx.beginPath();
			ctx.moveTo(pts[0].x, pts[0].y);
			for (let i = 1; i < pts.length; i++) {
				ctx.lineTo(pts[i].x, pts[i].y);
			}
			ctx.stroke();
		}
	}

	// ── Particle class ────────────────────────────────────
	class Particle {
		constructor(x, y, dirX, dirY, type) {
			this.x = x;
			this.y = y;
			this.vx = dirX * (0.5 + Math.random() * 2) + (Math.random() - 0.5) * 1.5;
			this.vy = dirY * (0.5 + Math.random() * 1.5) + (Math.random() - 0.5) * 1.5;
			this.life = 0;
			this.maxLife = 20 + Math.random() * 30;
			this.size = 0.8 + Math.random() * 1.8;
			const palette = type === 'gear' ? PARTICLE_COLORS_GEAR : PARTICLE_COLORS_WIRE;
			this.color = palette[Math.floor(Math.random() * palette.length)];
			this.glowColor = type === 'gear' ? GEAR_COLORS.outer : WIRE_COLORS.outer;
		}

		update() {
			this.life++;
			this.x += this.vx;
			this.y += this.vy;
			this.vy += 0.06; // gravity
			this.vx *= 0.97;
			this.vy *= 0.99;
			return this.life < this.maxLife;
		}

		draw(ctx) {
			const t = this.life / this.maxLife;
			const alpha = t < 0.08 ? t / 0.08 : Math.max(0, 1 - (t - 0.08) / 0.92);
			if (alpha < 0.01) return;
			ctx.save();
			ctx.globalAlpha = alpha * 0.85;
			ctx.fillStyle = this.color;
			ctx.shadowColor = this.glowColor;
			ctx.shadowBlur = 4;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size * (1 - t * 0.4), 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}

	// ── Ember class — continuous reddish floating sparks from gears ──
	class Ember {
		constructor(x, y, fromSide) {
			this.x = x;
			this.y = y;
			this.fromSide = fromSide; // 'left' or 'right'
			const inwardDir = fromSide === 'right' ? -1 : 1;
			// Float inward with slight spread
			this.vx = inwardDir * (1.0 + Math.random() * 2.5);
			this.vy = (Math.random() - 0.3) * 1.2; // mostly downward bias
			this.life = 0;
			this.maxLife = 60 + Math.random() * 80;
			this.size = 0.6 + Math.random() * 1.5;
			const emberColors = ['#e85a30', '#ff6633', '#cc4422', '#ff8844', '#dd5533', '#ff7744', '#b83a15'];
			this.color = emberColors[Math.floor(Math.random() * emberColors.length)];
			this.glowColor = '#8b2500';
			this.wobbleAmp = 0.1 + Math.random() * 0.3;
			this.wobbleFreq = 0.05 + Math.random() * 0.1;
			this.wobbleOffset = Math.random() * Math.PI * 2;
		}

		update() {
			this.life++;
			this.vy += Math.sin(this.life * this.wobbleFreq + this.wobbleOffset) * this.wobbleAmp * 0.1;
			this.x += this.vx;
			this.y += this.vy;
			this.vy += 0.015; // very gentle gravity — they float
			this.vx *= 0.995; // slow drag
			return this.life < this.maxLife;
		}

		draw(ctx) {
			const t = this.life / this.maxLife;
			// Fade in quickly, stay visible, then dissolve gently
			let alpha;
			if (t < 0.05) {
				alpha = t / 0.05;
			} else if (t > 0.5) {
				alpha = Math.max(0, 1 - (t - 0.5) / 0.5);
			} else {
				alpha = 1;
			}
			if (alpha < 0.01) return;

			const currentSize = this.size * (1 - t * 0.3);
			
			// Warm glow
			ctx.save();
			ctx.globalAlpha = alpha * 0.3;
			ctx.fillStyle = this.glowColor;
			ctx.shadowColor = this.color;
			ctx.shadowBlur = 6;
			ctx.beginPath();
			ctx.arc(this.x, this.y, currentSize * 2, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();

			// Bright core
			ctx.save();
			ctx.globalAlpha = alpha * 0.8;
			ctx.fillStyle = this.color;
			ctx.shadowColor = this.color;
			ctx.shadowBlur = 3;
			ctx.beginPath();
			ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}

	// Ember sources — both sides where gears are
	let EMBER_SOURCES = [];

	function initEmberSources() {
		EMBER_SOURCES = [
			// Right side gear zones
			{ x: width, yMin: height * 0.25, yMax: height * 0.45, side: 'right' },
			{ x: width, yMin: height * 0.50, yMax: height * 0.68, side: 'right' },
			// Left side gear zones
			{ x: 0, yMin: height * 0.20, yMax: height * 0.42, side: 'left' },
			{ x: 0, yMin: height * 0.50, yMax: height * 0.70, side: 'left' },
		];
	}

	// ── Spawning ──────────────────────────────────────────
	function spawnSpark() {
		const source = SPARK_SOURCES[Math.floor(Math.random() * SPARK_SOURCES.length)];
		const spark = new Spark(source);
		sparks.push(spark);

		// Sound is ambient loop — no per-spark sound needed

		// Particles at source
		const numP = 2 + Math.floor(Math.random() * 3);
		for (let i = 0; i < numP; i++) {
			particles.push(new Particle(
				source.x + source.dirX * 4,
				source.y + source.dirY * 4 + (Math.random() - 0.5) * 8,
				source.dirX,
				source.dirY,
				source.type
			));
		}

		if (spark.segments.length > 2 && Math.random() < 0.5) {
			const tip = spark.segments[spark.segments.length - 1];
			particles.push(new Particle(tip.x, tip.y, source.dirX * 0.3, source.dirY * 0.3, source.type));
		}
	}

	function spawnEmber() {
		const src = EMBER_SOURCES[Math.floor(Math.random() * EMBER_SOURCES.length)];
		const y = src.yMin + Math.random() * (src.yMax - src.yMin);
		embers.push(new Ember(src.x, y, src.side));
	}

	// ── Animation loop ────────────────────────────────────
	function animate() {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		frameCount++;

		// Rare lightning strikes — ~1 every 3-5 seconds
		if (Math.random() < 0.005) {
			spawnSpark();
		}

		// Continuous ember stream from both sides
		if (Math.random() < 0.35) {
			spawnEmber();
		}
		// Occasional ember shower
		if (Math.random() < 0.02) {
			const count = 3 + Math.floor(Math.random() * 3);
			for (let i = 0; i < count; i++) {
				spawnEmber();
			}
		}

		sparks = sparks.filter(s => {
			const alive = s.update();
			if (alive) s.draw(ctx);
			return alive;
		});

		particles = particles.filter(p => {
			const alive = p.update();
			if (alive) p.draw(ctx);
			return alive;
		});

		embers = embers.filter(e => {
			const alive = e.update();
			if (alive) e.draw(ctx);
			return alive;
		});

		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (!canvas) return;
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		initSources();
		initEmberSources();
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		handleResize();

		// Set up ambient audio loops
		electricAudio = new Audio('/freesound_community-electric-sparks-6130.mp3');
		electricAudio.loop = true;
		electricAudio.volume = 0.3;
		electricAudio.preload = 'auto';

		gearsAudio = new Audio('/freesound_community-rusty-gears-62898.mp3');
		gearsAudio.loop = true;
		gearsAudio.volume = 0.25;
		gearsAudio.preload = 'auto';

		animate();
		window.addEventListener('resize', handleResize);

		// Listen for global audio control
		window.addEventListener('audio-global-enable', handleGlobalAudioEnable);
		window.addEventListener('audio-global-disable', handleGlobalAudioDisable);

		// Listen for speakers section enter/leave to mute/unmute
		window.addEventListener('speakers-section-enter', handleSpeakersEnter);
		window.addEventListener('speakers-section-leave', handleSpeakersLeave);

		// Listen for FAQ section enter/leave to mute/unmute
		window.addEventListener('faq-section-enter', handleFaqEnter);
		window.addEventListener('faq-section-leave', handleFaqLeave);

		// Listen for sponsors section enter/leave to mute/unmute
		window.addEventListener('sponsors-section-enter', handleSponsorsEnter);
		window.addEventListener('sponsors-section-leave', handleSponsorsLeave);

		// Listen for apply section enter/leave to mute/unmute
		window.addEventListener('apply-section-enter', handleApplyEnter);
		window.addEventListener('apply-section-leave', handleApplyLeave);

		// Listen for footer section enter/leave to mute/unmute
		window.addEventListener('footer-section-enter', handleFooterEnter);
		window.addEventListener('footer-section-leave', handleFooterLeave);

		// Listen for tracks section enter/leave to adjust volumes
		window.addEventListener('tracks-section-enter', handleTracksEnter);
		window.addEventListener('tracks-section-leave', handleTracksLeave);
	});

	onDestroy(() => {
		if (animationId) cancelAnimationFrame(animationId);
		if (audioRetryInterval) clearInterval(audioRetryInterval);
		if (electricAudio) {
			electricAudio.pause();
			electricAudio.src = '';
		}
		if (gearsAudio) {
			gearsAudio.pause();
			gearsAudio.src = '';
		}
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('audio-global-enable', handleGlobalAudioEnable);
			window.removeEventListener('audio-global-disable', handleGlobalAudioDisable);
			window.removeEventListener('speakers-section-enter', handleSpeakersEnter);
			window.removeEventListener('speakers-section-leave', handleSpeakersLeave);
			window.removeEventListener('faq-section-enter', handleFaqEnter);
			window.removeEventListener('faq-section-leave', handleFaqLeave);
			window.removeEventListener('sponsors-section-enter', handleSponsorsEnter);
			window.removeEventListener('sponsors-section-leave', handleSponsorsLeave);
			window.removeEventListener('apply-section-enter', handleApplyEnter);
			window.removeEventListener('apply-section-leave', handleApplyLeave);
			window.removeEventListener('footer-section-enter', handleFooterEnter);
			window.removeEventListener('footer-section-leave', handleFooterLeave);
			window.removeEventListener('tracks-section-enter', handleTracksEnter);
			window.removeEventListener('tracks-section-leave', handleTracksLeave);
		}
	});
</script>

<canvas bind:this={canvas} class={sparkStyles.sparkCanvas}></canvas>
