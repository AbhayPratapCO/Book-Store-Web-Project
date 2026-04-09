export function initParallax() {
  const hero = document.querySelector('#hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const sc = window.scrollY;
    hero.style.backgroundPosition = `center ${sc * 0.25}px`;
  }, { passive: true });
}
