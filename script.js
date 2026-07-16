(() => {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');

  const setMenu = (open) => {
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    menu?.setAttribute('aria-hidden', String(!open));
    menu?.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };

  toggle?.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal, .project, .brand, .method-step');

  const updateScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / max));
    progress.style.transform = `scaleX(${ratio})`;
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    document.body.classList.toggle('scrolled', window.scrollY > 24);

    document.querySelectorAll('.method-step.visible').forEach((step) => {
      const rect = step.getBoundingClientRect();
      const local = 1 - Math.max(0, Math.min(1, rect.top / (window.innerHeight * .78)));
      step.style.setProperty('--line-fill', `${Math.round(local * 100)}%`);
    });
  };

  window.addEventListener('scroll', () => requestAnimationFrame(updateScroll), { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(updateScroll));
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
  }, { passive: true });
  updateScroll();

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      updateScroll();
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' });

  reveals.forEach((element) => observer.observe(element));
})();
