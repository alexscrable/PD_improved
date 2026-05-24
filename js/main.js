/**
 * main.js — Північна Дивізія (improved)
 * Navbar · Mobile menu · Hero animations · Parallax ·
 * Scroll reveal · Counters · Gallery stagger · Lightbox · Language toggle
 */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   1. NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const threshold = 60;
  if (!navbar) return;

  const observer = new IntersectionObserver(
    ([entry]) => navbar.classList.toggle('is-scrolled', !entry.isIntersecting),
    { rootMargin: `-${threshold}px 0px 0px 0px` }
  );

  const sentinel = document.getElementById('nav-sentinel');
  if (sentinel) observer.observe(sentinel);
}

/* ============================================================
   2. MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const body       = document.body;
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function open() {
    isOpen = true;
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    body.style.overflow = 'hidden';
  }

  function close() {
    isOpen = false;
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => isOpen ? close() : open());
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });
}

/* ============================================================
   3. HERO ANIMATION
   ============================================================ */
function initHeroAnimation() {
  const lines = document.querySelectorAll('.hero__title-line');
  if (!lines.length) return;

  const tl = gsap.timeline({ delay: 0.15 });
  tl
    .to(lines, { y: '0%', duration: 1.1, ease: 'power3.out', stagger: 0.12 })
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.6')
    .to('.hero__subtitle', { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .to('.hero__divider',  { opacity: 1, duration: 0.5 }, '-=0.3')
    .to('.hero__actions',  { opacity: 1, duration: 0.5 }, '-=0.25')
    .to('.hero__scroll',   { opacity: 1, duration: 0.5 }, '-=0.2');
}

/* ============================================================
   4. PARALLAX
   ============================================================ */
function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  gsap.to(heroBg, {
    yPercent: 28, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  const watermark = document.querySelector('.manifesto__watermark');
  if (watermark) {
    gsap.to(watermark, {
      xPercent: -18, ease: 'none',
      scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }
}

/* ============================================================
   5. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  gsap.utils.toArray('.reveal').forEach((el, index) => {
    gsap.fromTo(el,
      { opacity: 0, y: 44 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
        delay: (index % 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ============================================================
   6. COUNTERS
   ============================================================ */
function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target   = parseInt(el.dataset.counter, 10);
    const suffix   = el.dataset.suffix || '';

    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 1.85, ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          }
        });
      }
    });
  });
}

/* ============================================================
   7. GALLERY STAGGER
   ============================================================ */
function initGallery() {
  const items = document.querySelectorAll('.gallery__item');
  if (!items.length) return;

  gsap.from(items, {
    opacity: 0, scale: 0.95, duration: 0.65, ease: 'power2.out', stagger: 0.06,
    scrollTrigger: { trigger: '.gallery__grid', start: 'top 87%', toggleActions: 'play none none none' }
  });
}

/* ============================================================
   8. LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const img       = document.getElementById('lightbox-img');
  const closeBtn  = document.getElementById('lightbox-close');
  const prevBtn   = document.getElementById('lightbox-prev');
  const nextBtn   = document.getElementById('lightbox-next');
  const counter   = document.getElementById('lightbox-counter');
  if (!lightbox) return;

  const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
  const images = galleryItems.map(item => {
    const galleryImg = item.querySelector('.gallery__img');
    return { src: galleryImg.src, alt: galleryImg.alt };
  });

  let current = 0;

  function open(index) {
    current = index;
    showImage(current);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showImage(index) {
    img.classList.add('is-loading');
    img.src = images[index].src;
    img.alt = images[index].alt;
    img.onload = () => img.classList.remove('is-loading');
    counter.textContent = `${index + 1} / ${images.length}`;
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
    showImage(current);
  }

  function next() {
    current = (current + 1) % images.length;
    showImage(current);
  }

  // Attach open to gallery buttons
  galleryItems.forEach((item, index) => {
    const btn = item.querySelector('.gallery__btn');
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); open(index); });
    // Also allow clicking the overlay itself
    const overlay = item.querySelector('.gallery__overlay');
    if (overlay) overlay.addEventListener('click', () => open(index));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Click outside image to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch/swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  }, { passive: true });
}

/* ============================================================
   9. LANGUAGE TOGGLE
   ============================================================ */
function initLanguageToggle() {
  const htmlEl  = document.documentElement;
  const btnUk   = document.getElementById('lang-uk');
  const btnEn   = document.getElementById('lang-en');
  const toggle  = document.getElementById('lang-toggle');
  if (!toggle) return;

  let currentLang = localStorage.getItem('pd-lang') || 'uk';

  function applyLang(lang) {
    currentLang = lang;
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('data-lang', lang);
    localStorage.setItem('pd-lang', lang);

    // Update active indicators
    btnUk.classList.toggle('lang-toggle__option--active', lang === 'uk');
    btnEn.classList.toggle('lang-toggle__option--active', lang === 'en');

    // Translate all elements with data-uk / data-en
    document.querySelectorAll('[data-uk]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (!text) return;
      // If it contains HTML tags (like <em>, <br>), use innerHTML
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Update page title and meta
    if (lang === 'en') {
      document.title = 'Northern Division';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = 'Northern Division — youth organization. Youth. Action. Brotherhood.';
    } else {
      document.title = 'Північна Дивізія';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = 'Північна Дивізія — молодіжна організація. Молодь. Дія. Братерство.';
    }
  }

  toggle.addEventListener('click', () => {
    applyLang(currentLang === 'uk' ? 'en' : 'uk');
  });

  // Apply saved language on load
  applyLang(currentLang);
}

/* ============================================================
   10. BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroAnimation();
  initParallax();
  initScrollReveal();
  initCounters();
  initGallery();
  initLightbox();
  initLanguageToggle();

  console.log(
    '%c Північна Дивізія 🛡️ ',
    'font-size:14px; font-weight:600; color:#fff; background:#000; padding:6px 14px; border:1px solid #2e2e2e;'
  );
});
