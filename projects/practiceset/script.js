(() => {
	const canvas = document.getElementById('starfield');
	const ctx = canvas.getContext('2d');
	const stars = [];
	const STAR_COUNT = 120;
	const GLOW_COLORS = [
		'194,218,176',
		'169,201,157',
		'217,228,204'
	];
	let viewportWidth = window.innerWidth;
	let viewportHeight = window.innerHeight;

	function resize() {
		viewportWidth = window.innerWidth;
		viewportHeight = window.innerHeight;
		const dpr = Math.max(1, window.devicePixelRatio || 1);
		const w = Math.ceil((viewportWidth + 2) * dpr);
		const h = Math.ceil((viewportHeight + 2) * dpr);
		canvas.width = w;
		canvas.height = h;
		canvas.style.width = `${viewportWidth + 2}px`;
		canvas.style.height = `${viewportHeight + 2}px`;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(dpr, dpr);
	}

	function createStars() {
		stars.length = 0;
		for (let i = 0; i < STAR_COUNT; i++) {
			const speed = Math.random() * 0.12 + 0.02;
			stars.push({
				x: Math.random() * viewportWidth,
				y: Math.random() * viewportHeight,
				r: Math.random() * 1.5 + 0.45,
				a: Math.random() * 0.65 + 0.25,
				twinkle: Math.random() * 0.02 + 0.004,
				vy: speed,
				vx: (Math.random() - 0.5) * 0.08,
				color: GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)]
			});
		}
	}

	function draw() {
		ctx.clearRect(0, 0, viewportWidth + 2, viewportHeight + 2);
		for (const s of stars) {
			s.x += s.vx;
			s.y += s.vy;
			if (s.y > viewportHeight + 6) s.y = -6;
			if (s.x > viewportWidth + 6) s.x = -6;
			if (s.x < -6) s.x = viewportWidth + 6;

			s.a += (Math.random() - 0.5) * s.twinkle;
			if (s.a < 0.15) s.a = 0.15;
			if (s.a > 1) s.a = 1;

			ctx.beginPath();
			ctx.fillStyle = `rgba(${s.color},${s.a})`;
			ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
			ctx.fill();
		}
		requestAnimationFrame(draw);
	}

	window.addEventListener('resize', () => {
		resize();
		createStars();
	});

	resize();
	createStars();
	draw();

	const sections = document.querySelectorAll('.scroll-section');
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
			}
		});
	}, { threshold: 0.15 });

	sections.forEach(section => observer.observe(section));

	const cards = document.querySelectorAll('.exam-card');
	cards.forEach((card, idx) => {
		card.style.setProperty('--card-delay', `${idx * 90}ms`);
	});
})();
