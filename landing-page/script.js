// -----------------------------
// Ileya Landing Page Scripts
// -----------------------------

// Scroll reveal animation using Intersection Observer
const revealElements = document.querySelectorAll('.fade-up, .reveal');

const observerOptions = {
  root: null,
  threshold: 0.15,
};

const revealOnScroll = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(revealOnScroll, observerOptions);
revealElements.forEach((el) => observer.observe(el));

// Sticky nav shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('shadow');
  } else {
    navbar.classList.remove('shadow');
  }
});
