document.addEventListener('DOMContentLoaded', () => {
  // Canvas starfield
  const canvas = document.getElementById('starfield');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  let stars = [];
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.round((window.innerWidth + window.innerHeight) / 40);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.4,
        alpha: 0.6 + Math.random() * 0.4,
        twinkle: 0.02 + Math.random() * 0.04
      });
    }
  }

  let lastTime = 0;
  function drawStars(t) {
    if (!ctx) return;
    const dt = (t - lastTime) / 16.67 || 1;
    lastTime = t;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += (Math.random() - 0.5) * s.twinkle * dt;
      s.alpha = Math.max(0.2, Math.min(1, s.alpha));
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,' + s.alpha + ')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // bursts (temporary particle explosions on user click)
    for (let i = bursts.length - 1; i >= 0; i--) {
      const p = bursts[i];
      p.x += p.vx * dt * 1.8;
      p.y += p.vy * dt * 1.8;
      p.vy += 0.012 * dt; // gravity-ish
      p.life -= 0.035 * dt;
      if (p.life <= 0) {
        bursts.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0, Math.min(1, p.life)) + ')';
      ctx.arc(p.x, p.y, p.r * (p.life), 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawStars);
  }

  if (canvas && ctx) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    requestAnimationFrame(drawStars);
  }

  // Section reveal
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.18 });
  sections.forEach(sec => observer.observe(sec));

  // Hero diagonal scroll + sticky
  const hero = document.getElementById('heroContent');
  const maxScroll = 220;
  let ticking = false;

  function updateHero(progress) {
    if (!hero) return;
    const maxTx = Math.min(window.innerWidth * 0.36, 360);
    const maxTy = Math.min(window.innerHeight * 0.30, 260);
    const tx = -Math.round(progress * maxTx);
    const ty = -Math.round(progress * maxTy);
    const scale = 1 - 0.16 * progress;

    if (progress < 1) {
      hero.classList.remove('stuck');
      hero.style.position = '';
      hero.style.top = '';
      hero.style.left = '';
      hero.style.zIndex = '';
      hero.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    } else {
      hero.classList.add('stuck');
      const rootStyles = getComputedStyle(document.documentElement);
      const topVar = rootStyles.getPropertyValue('--hero-stuck-top') || '20px';
      const leftVar = rootStyles.getPropertyValue('--hero-stuck-left') || '20px';
      hero.style.transform = '';
      hero.style.position = 'fixed';
      hero.style.top = topVar.trim();
      hero.style.left = leftVar.trim();
      hero.style.zIndex = '3';
    }

    const last = sections[sections.length - 1];
    const hide = (window.scrollY + window.innerHeight > last.offsetTop + last.offsetHeight + 50);
    hero.style.opacity = hide ? '0' : '1';
  }

  function onScroll() {
    const scrollY = Math.max(window.scrollY, 0);
    const progress = Math.min(scrollY / maxScroll, 1);
    updateHero(progress);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', () => { requestAnimationFrame(onScroll); });

  requestAnimationFrame(onScroll);

  // Contact form handling
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      setTimeout(() => { alert('Message sent!'); form.reset(); if (btn) { btn.disabled = false; btn.textContent = 'Send'; } }, 700);
    });

    // wire up copy-to-clipboard buttons next to contact items
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const text = btn.dataset.copy;
        if (!text) return;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
          }
          const orig = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = '<svg class="icon" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.5 7.5 19.1 6.1z"/></svg>';
          // feedback
          if (typeof showThemeToast === 'function') showThemeToast('Copied: ' + text);
          setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 1500);
        } catch (err) {
          if (typeof showThemeToast === 'function') showThemeToast('Copy failed — select and copy manually');
        }
      });
    });
  }

  // Make project buttons accessible: simple focus outlines
  document.querySelectorAll('.project-card').forEach(b => {
    b.addEventListener('click', () => { b.blur(); alert(b.textContent + ' — project placeholder'); });
  });

  // Interactive decorative elements: tooltips, click actions, keyboard
  const decoEls = document.querySelectorAll('.decor');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // initialize persisted theme and helper toast for easter-egg
  (function initThemes(){
    const THEME_COUNT = 6;
    let idx = parseInt(localStorage.getItem('themeIndex') || '0', 10) || 0;
    idx = Math.max(0, Math.min(THEME_COUNT - 1, idx));
    document.body.dataset.theme = String(idx);
  })();

  function showThemeToast(text){
    let t = document.querySelector('.theme-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'theme-toast';
      t.setAttribute('role','status');
      t.setAttribute('aria-live','polite');
      t.innerHTML = '<p>' + text + '</p>';
      document.body.appendChild(t);
    } else {
      const p = t.querySelector('p') || (function(){ const np = document.createElement('p'); t.appendChild(np); return np; })();
      p.textContent = text;
      t.classList.remove('show');
      if (t._hideTimeout) { clearTimeout(t._hideTimeout); t._hideTimeout = null; }
    }
    requestAnimationFrame(()=> t.classList.add('show'));
    if (t._hideTimeout) clearTimeout(t._hideTimeout);
    t._hideTimeout = setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=> { try { t.remove(); } catch(e){}; t._hideTimeout = null; }, 300); }, 3800);
  }

  decoEls.forEach(el => {
    el.addEventListener('click', (e) => {
      const target = el.dataset.target;
      const action = el.dataset.action;
      if (target) {
        const dest = document.querySelector(target);
        if (dest) dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (action === 'toggle-theme') {
        const THEME_COUNT = 6;
        let idx = parseInt(document.body.dataset.theme || localStorage.getItem('themeIndex') || '0', 10) || 0;
        idx = (idx + 1) % THEME_COUNT;
        document.body.dataset.theme = String(idx);
        localStorage.setItem('themeIndex', String(idx));
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 700);
        if (idx === THEME_COUNT - 1) {
          showThemeToast('I know its fun but please Go through other things as well');
        }
      } else {
        if (!prefersReduced) el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
      }
    });

    el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); } });

    el.addEventListener('mouseenter', () => showTooltip(el));
    el.addEventListener('focus', () => showTooltip(el));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('blur', hideTooltip);
  });

  // Draggable decorative shapes (pointer-based) with physics reaction to cursor
  (function() {
    const draggables = document.querySelectorAll('.draggable');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const states = new Map();

    // global pointer tracking
    const pointer = { x: 0, y: 0, dx: 0, dy: 0 };
    window.addEventListener('pointermove', (e) => {
      pointer.dx = e.clientX - (pointer.x || e.clientX);
      pointer.dy = e.clientY - (pointer.y || e.clientY);
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }, { passive: true });

    // initialize elements
    draggables.forEach(el => {
      const left = el.dataset.initialLeft;
      const top = el.dataset.initialTop;
      if (left) el.style.left = left;
      if (top) el.style.top = top;
      el.style.position = 'fixed';
      el.style.touchAction = 'none';
      el.style.willChange = 'transform,left,top';
      el.style.zIndex = '2';

      const rect = el.getBoundingClientRect();
      const state = {
        el,
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
        vx: 0,
        vy: 0,
        mass: 0.9 + Math.random() * 1.2,
        dragging: false
      };
      states.set(el, state);

      // remove manual dragging; shapes are physics-driven only
      el.style.pointerEvents = 'none';
      // keyboard reset remains supported
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'r') {
          if (el.dataset.initialLeft) el.style.left = el.dataset.initialLeft;
          if (el.dataset.initialTop) el.style.top = el.dataset.initialTop;
        }
      });
    });

    if (prefersReduced) return; // don't run physics for reduced-motion users

    // precompute static collidable rects to avoid shapes overlapping important content
    function getCollidables() {
      const selectors = ['#heroContent', '.decor-blob', '.decor-ring', '.project-container', 'footer', '#contact-form'];
      const out = [];
      selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => { const r = el.getBoundingClientRect(); out.push({ x: r.left, y: r.top, w: r.width, h: r.height }); }));
      return out;
    }
    let collidables = getCollidables();
    window.addEventListener('resize', () => { collidables = getCollidables(); }, { passive: true });

    // animation loop
    let last = performance.now();
    function animate(time) {
      const dt = Math.min(50, time - last) / 16.67; // approx frames
      last = time;
      const threshold = 90; // smaller px influence radius
      const pushFactor = 0.25; // weaker impulse
      states.forEach(state => {
        const el = state.el;
        if (state.dragging) return; // skip physics while user drags

        // compute center
        const cx = state.x + state.w / 2;
        const cy = state.y + state.h / 2;
        const pdx = pointer.x - cx;
        const pdy = pointer.y - cy;
        const dist = Math.hypot(pdx, pdy) || 0.0001;

        if (dist < threshold) {
          const influence = (threshold - dist) / threshold; // 0..1
          const speed = Math.hypot(pointer.dx, pointer.dy);
          let ix = 0, iy = 0;
          if (speed > 0.8) {
            // push in cursor movement direction
            ix = pointer.dx * pushFactor * influence;
            iy = pointer.dy * pushFactor * influence;
          } else {
            // push away from cursor
            ix = - (pdx / dist) * (2.2 * influence);
            iy = - (pdy / dist) * (2.2 * influence);
          }
          state.vx += ix / state.mass;
          state.vy += iy / state.mass;
        }

        // apply friction
        const friction = 0.88;
        state.vx *= Math.pow(friction, dt);
        state.vy *= Math.pow(friction, dt);

        // update position (slower flow)
        state.x += state.vx * dt * 3;
        state.y += state.vy * dt * 3;

        // bounds + bounce
        if (state.x < 0) { state.x = 0; state.vx *= -0.45; }
        if (state.y < 0) { state.y = 0; state.vy *= -0.45; }
        if (state.x + state.w > window.innerWidth) { state.x = window.innerWidth - state.w; state.vx *= -0.45; }
        if (state.y + state.h > window.innerHeight) { state.y = window.innerHeight - state.h; state.vy *= -0.45; }

        // apply to DOM
        el.style.left = Math.round(state.x) + 'px';
        el.style.top = Math.round(state.y) + 'px';
      });

      // shape-shape collisions (AABB) - keep shapes from overlapping
      const arr = Array.from(states.values());
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const a = arr[i], b = arr[j];
          const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
              const shift = (overlapX / 2) + 0.5;
              if (a.x < b.x) { a.x -= shift; b.x += shift; } else { a.x += shift; b.x -= shift; }
              const vxAvg = (a.vx + b.vx) / 2;
              a.vx = (a.vx - vxAvg) * 0.35; b.vx = (b.vx - vxAvg) * 0.35;
            } else {
              const shift = (overlapY / 2) + 0.5;
              if (a.y < b.y) { a.y -= shift; b.y += shift; } else { a.y += shift; b.y -= shift; }
              const vyAvg = (a.vy + b.vy) / 2;
              a.vy = (a.vy - vyAvg) * 0.35; b.vy = (b.vy - vyAvg) * 0.35;
            }
          }
        }
      }

      // collisions with static collidables
      arr.forEach(s => {
        collidables.forEach(c => {
          const overlapX = Math.min(s.x + s.w, c.x + c.w) - Math.max(s.x, c.x);
          const overlapY = Math.min(s.y + s.h, c.y + c.h) - Math.max(s.y, c.y);
          if (overlapX > 0 && overlapY > 0) {
            if (overlapX < overlapY) {
              if (s.x < c.x) s.x -= overlapX + 1; else s.x += overlapX + 1;
              s.vx *= -0.35;
            } else {
              if (s.y < c.y) s.y -= overlapY + 1; else s.y += overlapY + 1;
              s.vy *= -0.35;
            }
            s.x = Math.max(0, Math.min(window.innerWidth - s.w, s.x));
            s.y = Math.max(0, Math.min(window.innerHeight - s.h, s.y));
          }
        })
      });

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // update sizes on resize
    window.addEventListener('resize', () => {
      states.forEach(state => {
        const rect = state.el.getBoundingClientRect();
        state.w = rect.width; state.h = rect.height;
        // clamp inside viewport
        state.x = Math.max(0, Math.min(window.innerWidth - state.w, state.x));
        state.y = Math.max(0, Math.min(window.innerHeight - state.h, state.y));
        state.el.style.left = state.x + 'px';
        state.el.style.top = state.y + 'px';
      });
    }, { passive: true });

  })();

  let tooltipEl = null;
  function showTooltip(el) {
    if (!el || prefersReduced) return;
    hideTooltip();
    const label = el.getAttribute('aria-label') || el.dataset.title;
    if (!label) return;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'decor-tooltip';
    tooltipEl.textContent = label;
    document.body.appendChild(tooltipEl);
    const rect = el.getBoundingClientRect();
    const left = rect.left + rect.width / 2;
    const top = rect.top - 8;
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
    tooltipEl.style.opacity = '1';
  }
  function hideTooltip() { if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; } }

  // starburst particles
  const bursts = [];
  function createBurst(cx, cy) {
    if (prefersReduced) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      bursts.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: Math.random() * 2 + 0.7, life: 1 + Math.random() * 0.6 });
    }
  }

  if (canvas && ctx) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = (e.clientX - rect.left);
      const cy = (e.clientY - rect.top);
      createBurst(cx, cy);
    }, { passive: true });

    // Sand & ripple canvases
    const sandCanvas = document.getElementById('sand');
    const sandCtx = sandCanvas && sandCanvas.getContext ? sandCanvas.getContext('2d') : null;
    const rippleCanvas = document.getElementById('ripples');
    const rippleCtx = rippleCanvas && rippleCanvas.getContext ? rippleCanvas.getContext('2d') : null;
    let sandDpr = window.devicePixelRatio || 1;

    function resizeSand() {
      if (!sandCanvas || !sandCtx || !rippleCanvas || !rippleCtx) return;
      sandDpr = window.devicePixelRatio || 1;
      sandCanvas.width = Math.floor(window.innerWidth * sandDpr);
      sandCanvas.height = Math.floor(window.innerHeight * sandDpr);
      sandCanvas.style.width = window.innerWidth + 'px';
      sandCanvas.style.height = window.innerHeight + 'px';
      sandCtx.setTransform(sandDpr,0,0,sandDpr,0,0);

      rippleCanvas.width = Math.floor(window.innerWidth * sandDpr);
      rippleCanvas.height = Math.floor(window.innerHeight * sandDpr);
      rippleCanvas.style.width = window.innerWidth + 'px';
      rippleCanvas.style.height = window.innerHeight + 'px';
      rippleCtx.setTransform(sandDpr,0,0,sandDpr,0,0);

      // regenerate sand texture on resize
      generateSandTexture();
    }

    let baseSandImg = null;
    function generateSandTexture() {
      if (!sandCtx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const off = document.createElement('canvas');
      off.width = Math.floor(w * sandDpr);
      off.height = Math.floor(h * sandDpr);
      const o = off.getContext('2d');
      o.scale(sandDpr, sandDpr);
      // background color (slight sand tone)
      o.fillStyle = 'rgba(6,6,10,0.32)';
      o.fillRect(0,0,w,h);
      // sprinkled dots
      const density = Math.min(35000, Math.round((w*h)/700));
      for (let i=0;i<density;i++){
        const x = Math.random()*w;
        const y = Math.random()*h;
        const r = Math.random()*1.6 + 0.2;
        const a = 0.06 + Math.random()*0.12;
        o.beginPath(); o.fillStyle = 'rgba(240,240,240,'+a+')'; o.arc(x,y,r,0,Math.PI*2); o.fill();
      }
      // slight grain overlay
      o.globalCompositeOperation = 'overlay';
      o.fillStyle = 'rgba(255,255,255,0.01)';
      o.fillRect(0,0,w,h);
      baseSandImg = new Image();
      baseSandImg.src = off.toDataURL();
      // draw initial into device-pixel buffer correctly
      sandCtx.save();
      sandCtx.setTransform(1,0,0,1,0,0);
      sandCtx.clearRect(0,0, off.width, off.height);
      sandCtx.drawImage(off,0,0);
      sandCtx.restore();
      sandCtx.setTransform(sandDpr,0,0,sandDpr,0,0);
    }

    // erasing + ripples
    const ripples = [];
    const pointerState = {x:-9999,y:-9999,active:false,lastTime:0};
    let pendingErase = false;

    function eraseAt(x,y,r){
      if (!sandCtx) return;
      sandCtx.save();
      sandCtx.globalCompositeOperation = 'destination-out';
      const g = sandCtx.createRadialGradient(x,y, r*0.1, x,y, r);
      g.addColorStop(0, 'rgba(0,0,0,0.95)');
      g.addColorStop(0.6, 'rgba(0,0,0,0.5)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      sandCtx.fillStyle = g;
      sandCtx.beginPath(); sandCtx.arc(x,y,r,0,Math.PI*2); sandCtx.fill();
      sandCtx.restore();
    }

    function addRipple(x,y) {
      ripples.push({x,y,age:0,duration:900, startR:18, endR:110});
    }

    function onPointer(e){
      pointerState.x = e.clientX;
      pointerState.y = e.clientY;
      pointerState.active = true;
      pointerState.lastTime = performance.now();
      pendingErase = true;
      // add ripple when fast movement
      if (Math.hypot(pointer.dx||0,pointer.dy||0) > 1.4) addRipple(pointerState.x, pointerState.y);
    }

    window.addEventListener('pointermove', onPointer, { passive:true });
    window.addEventListener('pointerdown', (e)=>{ onPointer(e); addRipple(e.clientX,e.clientY); }, { passive:true });

    function drawRipples(now, dt){
      if (!rippleCtx) return;
      rippleCtx.clearRect(0,0,window.innerWidth,window.innerHeight);
      for (let i=ripples.length-1;i>=0;i--){
        const r = ripples[i];
        r.age += dt;
        const t = Math.min(1, r.age / r.duration);
        const rad = r.startR + (r.endR - r.startR) * t;
        const alpha = Math.max(0, 1 - t);
        rippleCtx.beginPath();
        rippleCtx.lineWidth = 2 + (1.5 * (1 - t));
        rippleCtx.strokeStyle = 'rgba(0,229,255,' + (alpha*0.22) + ')';
        rippleCtx.shadowColor = 'rgba(0,229,255,' + (alpha*0.08) + ')';
        rippleCtx.shadowBlur = 8 * (1 - t);
        rippleCtx.arc(r.x, r.y, rad, 0, Math.PI*2);
        rippleCtx.stroke();
        if (t >= 1) ripples.splice(i,1);
      }
    }

    // animation loop for sand erasing and ripples
    let lastSand = performance.now();
    function sandLoop(now){
      const dt = now - lastSand; lastSand = now;
      if (pendingErase && sandCtx) {
        // smooth erase along pointer, radius varies with speed
        const speed = Math.min(8, Math.hypot(pointer.dx||0, pointer.dy||0));
        const baseR = 48;
        const r = Math.max(28, baseR + speed*6);
        eraseAt(pointerState.x, pointerState.y, r);
        pendingErase = false; // throttle per frame
      }
      drawRipples(now, dt);
      requestAnimationFrame(sandLoop);
    }

    // initial setup
    resizeSand();
    requestAnimationFrame(sandLoop);

    // respect reduced motion by disabling ripples and heavy erases
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.removeEventListener('pointermove', onPointer);
    }

    window.addEventListener('resize', resizeSand, { passive:true });
  }

});
