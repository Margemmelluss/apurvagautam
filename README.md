# Durlabh Gautam — Personal Portfolio

A sleek, accessible, and performant personal portfolio built with vanilla HTML, CSS, and JavaScript. This repository hosts a lightweight one-page site with a smooth diagonal sticky hero, canvas-based starfield, interactive decorative elements, and tactile canvas effects (sand clearing + ripples).

---

## ✨ Live demo
Visit the project :
www.apurvagautam.me

---

## 🚀 Features
- Lightweight, framework-free (vanilla HTML/CSS/JS)
- Canvas starfield and interactive particle bursts
- Sand canvas with pointer-driven clearing and ripple effects
- Six theme variants (cycle using the theme control)
- Accessible: keyboard operable controls, ARIA labels, and reduced-motion support
- Responsive and optimized for modern browsers

---

## 🧭 Quick start
Requirements:
- Any modern browser
- Optional: Node.js for local dev tooling

Run locally:

```bash
# from the project root
# Option A: quick static server (Python 3)
python -m http.server 8000
# then open http://localhost:8000 in your browser

# Option B: use Live Server (VS Code extension) or any static server of your choice
```

---

## 🛠 Development
- Edit markup in `index.html`, styles in `style.css`, and interactive logic in `script.js`.
- Canvas assets are automatically generated at runtime (starfield, sand texture, ripple rendering).
- Keep `prefers-reduced-motion` in mind when adding animations for accessibility.

Tips:
- Use `window.devicePixelRatio`-aware canvas sizes are already implemented for crisp rendering on high-DPI displays.
- Theme state persists via `localStorage` (key: `themeIndex`).

---

## ♿ Accessibility & performance
- Reduced-motion handling is implemented (animations and effects are toned down or disabled if `prefers-reduced-motion: reduce`).
- Animation updates use `requestAnimationFrame` and `transform`-based transitions to minimize layout thrashing.

---

## 🤝 Contributing
Contributions are welcome! If you'd like to contribute:
1. Fork the repo
2. Create a branch (e.g. `feature/new-theme`)
3. Commit your changes and open a PR with a clear description

Please keep changes small and focused; add tests or manual verification steps for visual changes.

---

## ✉️ Contact
Apurva Gautam: apurvagautam675@gmail.com
               durlabhgautamapurva@newhorizon.edu.np
               sculptbyte@gmail.com

               +9779804479062
