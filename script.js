// =========================
// Contact Form Submission
// =========================
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function(e){
      e.preventDefault();
      alert("Thanks for reaching out! I will get back to you soon.");
      contactForm.reset(); // clears form after submission
  });
}

// =========================
// Particle Background
// =========================
tsParticles.load("tsparticles", {
  particles: {
    number: { value: 60 },
    color: { value: "#00e5ff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: { min: 1, max: 3 } },
    move: { enable: true, speed: 1, direction: "none", outMode: "bounce" }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { quantity: 4 }
    }
  },
  retina_detect: true
});

// =========================
// Smooth Scroll for Navbar
// =========================
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if(target){
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =========================
// Fade-in Animations on Scroll
// =========================
const faders = document.querySelectorAll('.fade-in');

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// Observe all fade-in elements
faders.forEach(fader => appearOnScroll.observe(fader));
