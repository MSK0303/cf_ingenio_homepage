const menuToggle = document.querySelector('.menu-toggle');
const globalNav = document.querySelector('.global-nav');
const yearNode = document.querySelector('#currentYear');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && globalNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    globalNav.classList.toggle('is-open');
  });

  globalNav.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      globalNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealTargets = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealTargets.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}
