(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  function updateTheme(isDark) {
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (toggle) {
    const savedTheme = localStorage.getItem('theme');
    updateTheme(savedTheme === 'dark');
    toggle.addEventListener('click', () => {
      const isDark = root.dataset.theme !== 'dark';
      updateTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
  const revealElements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('active'));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealElements.forEach((element) => observer.observe(element));
})();
