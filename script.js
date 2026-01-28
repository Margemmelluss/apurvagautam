// Contact form alert
document.getElementById("contact-form").addEventListener("submit", function(e){
    e.preventDefault();
    alert("Thanks for reaching out! I will get back to you soon.");
});
// Particle background
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
// Smooth scroll for nav links
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});


