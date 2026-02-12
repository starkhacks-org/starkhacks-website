<script>
	import { onMount, onDestroy } from 'svelte';

	let canvas;
	let ctx;
	let animationId;
	let sparks = [];
	let embers = [];
	let width = 0;
	let height = 0;

	// ── Color palettes - same as landing page ──
	const WIRE_COLORS = {
		core: '#ffe4b5',
		inner: '#d4943a',
		mid: '#b87333',
		outer: '#8b5e2b',
		glow: 'rgba(180, 115, 51, 0.4)',
	};

	// Ember colors - same as landing page
	const EMBER_COLORS = ['#e85a30', '#ff6633', '#cc4422', '#ff8844', '#dd5533', '#ff7744', '#b83a15'];

	// Spark sources - left side
	let SPARK_SOURCES = [];

	function initSources() {
		SPARK_SOURCES = [
			{ x: 0, y: height * 0.2, dirX: 1, dirY: 0.3 },
			{ x: 0, y: height * 0.4, dirX: 1, dirY: -0.2 },
			{ x: 0, y: height * 0.6, dirX: 1, dirY: 0.1 },
			{ x: 0, y: height * 0.8, dirX: 1, dirY: -0.1 },
		];
	}

	// ── Spark class ───────────────────────────────────────
	class Spark {
		constructor(source) {
			this.source = source;
			this.colors = WIRE_COLORS;
			this.segments = [];
			this.life = 0;
			this.maxLife = 20 + Math.random() * 25;
			this.opacity = 0;
			this.peakOpacity = 0.7 + Math.random() * 0.3;
			this.branches = [];
			this.generatePath();
		}

		generatePath() {
			const { x, y, dirX, dirY } = this.source;
			const length = 80 + Math.random() * 120;
			const segments = 6 + Math.floor(Math.random() * 5);
			
			let cx = x;
			let cy = y;
			this.segments.push({ x: cx, y: cy });

			for (let i = 0; i < segments; i++) {
				const progress = i / segments;
				const stepLen = length / segments;
				const zigzag = (i % 2 === 0 ? 1 : -1) * (6 + Math.random() * 14);
				const perpX = -dirY;
				const perpY = dirX;

				cx += dirX * stepLen + perpX * zigzag + (Math.random() - 0.5) * 10;
				cy += dirY * stepLen + perpY * zigzag + (Math.random() - 0.5) * 10;
				this.segments.push({ x: cx, y: cy });

				if (Math.random() < 0.25 && progress > 0.2) {
					const branch = [];
					let bx = cx;
					let by = cy;
					const branchLen = 1 + Math.floor(Math.random() * 2);
					for (let j = 0; j < branchLen; j++) {
						const bZig = (j % 2 === 0 ? 1 : -1) * (4 + Math.random() * 8);
						bx += dirX * (stepLen * 0.3) + perpX * bZig;
						by += dirY * (stepLen * 0.3) + perpY * bZig;
						branch.push({ x: bx, y: by });
					}
					this.branches.push({ start: { x: cx, y: cy }, points: branch });
				}
			}
		}

		update() {
			this.life++;
			const t = this.life / this.maxLife;
			
			if (t < 0.1) {
				this.opacity = this.peakOpacity * (t / 0.1);
			} else if (t > 0.4) {
				this.opacity = this.peakOpacity * Math.max(0, 1 - (t - 0.4) / 0.6);
			} else {
				this.opacity = this.peakOpacity;
			}

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
			ctx.lineWidth = 6;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'bevel';
			ctx.shadowColor = c.outer;
			ctx.shadowBlur = 15;
			this.drawPath(ctx, this.segments);
			ctx.restore();

			// Outer
			ctx.save();
			ctx.globalAlpha = a * 0.5;
			ctx.strokeStyle = c.outer;
			ctx.lineWidth = 3;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'bevel';
			this.drawPath(ctx, this.segments);
			ctx.restore();

			// Core
			ctx.save();
			ctx.globalAlpha = a * 0.9;
			ctx.strokeStyle = c.core;
			ctx.lineWidth = 1;
			ctx.lineCap = 'round';
			ctx.shadowColor = c.inner;
			ctx.shadowBlur = 4;
			this.drawPath(ctx, this.segments);
			ctx.restore();

			// Branches
			for (const branch of this.branches) {
				if (branch.points.length === 0) continue;
				const bp = [branch.start, ...branch.points];
				ctx.save();
				ctx.globalAlpha = a * 0.4;
				ctx.strokeStyle = c.mid;
				ctx.lineWidth = 0.8;
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

	// ── Ember class - same as landing page ──
	class Ember {
		constructor(x, y, fromSide) {
			this.x = x;
			this.y = y;
			this.fromSide = fromSide;
			const inwardDir = fromSide === 'right' ? -1 : 1;
			this.vx = inwardDir * (1.0 + Math.random() * 2.5);
			this.vy = (Math.random() - 0.3) * 1.2;
			this.life = 0;
			this.maxLife = 60 + Math.random() * 80;
			this.size = 0.6 + Math.random() * 1.5;
			this.color = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
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
			this.vy += 0.015;
			this.vx *= 0.995;
			return this.life < this.maxLife;
		}

		draw(ctx) {
			const t = this.life / this.maxLife;
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

	// Ember sources - left side
	let EMBER_SOURCES = [];

	function initEmberSources() {
		EMBER_SOURCES = [
			{ x: 0, yMin: height * 0.20, yMax: height * 0.45, side: 'left' },
			{ x: 0, yMin: height * 0.50, yMax: height * 0.75, side: 'left' },
		];
	}

	function spawnSpark() {
		const source = SPARK_SOURCES[Math.floor(Math.random() * SPARK_SOURCES.length)];
		sparks.push(new Spark(source));
	}

	function spawnEmber() {
		const src = EMBER_SOURCES[Math.floor(Math.random() * EMBER_SOURCES.length)];
		const y = src.yMin + Math.random() * (src.yMax - src.yMin);
		embers.push(new Ember(src.x, y, src.side));
	}

	function animate() {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);

		// Spawn sparks occasionally
		if (Math.random() < 0.008) {
			spawnSpark();
		}

		// Continuous ember stream from left side
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

		embers = embers.filter(e => {
			const alive = e.update();
			if (alive) e.draw(ctx);
			return alive;
		});

		animationId = requestAnimationFrame(animate);
	}

	function handleResize() {
		if (!canvas) return;
		const rect = canvas.parentElement?.getBoundingClientRect();
		if (rect) {
			width = rect.width;
			height = rect.height;
			canvas.width = width;
			canvas.height = height;
			initSources();
			initEmberSources();
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		handleResize();
		animate();
		window.addEventListener('resize', handleResize);
	});

	onDestroy(() => {
		if (animationId) cancelAnimationFrame(animationId);
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		}
	});
</script>

<canvas bind:this={canvas} class="aboutSparkCanvas"></canvas>

<style>
	.aboutSparkCanvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
	}
</style>
