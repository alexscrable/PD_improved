'use strict';
gsap.registerPlugin(ScrollTrigger);
function initNavbar() {
const navbar = document.getElementById('navbar');
if (!navbar) return;
const observer = new IntersectionObserver(
([e]) => navbar.classList.toggle('is-scrolled', !e.isIntersecting),
{ rootMargin: '-60px 0px 0px 0px' }
);
const s = document.getElementById('nav-sentinel');
if (s) observer.observe(s);
}
function initMobileMenu() {
const h = document.getElementById('hamburger');
const m = document.getElementById('mobile-menu');
if (!h || !m) return;
let open = false;
const toggle = () => {
open = !open;
h.classList.toggle('is-open', open);
m.classList.toggle('is-open', open);
document.body.style.overflow = open ? 'hidden' : '';
};
h.addEventListener('click', toggle);
m.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { open = true; toggle(); }));
}
function renderCards(articles) {
const grid = document.getElementById('news-grid');
const empty = document.getElementById('news-empty');
grid.innerHTML = '';
if (!articles.length) {
empty.style.display = 'block';
return;
}
empty.style.display = 'none';
articles.forEach((a, i) => {
const card = document.createElement('article');
card.className = 'news-card' + (i === 0 ? ' news-card--page-featured' : '');
card.innerHTML = `
<a href="article.html?id=${a.id}" class="news-card__link-wrap">
<div class="news-card__thumb-wrap">
<img class="news-card__thumb" src="${a.cover}" alt="${a.title}" loading="lazy">
</div>
<div class="news-card__body">
<div class="news-card__meta">
<span class="news-card__tag">${a.tag}</span>
<time class="news-card__date">${NewsDB.formatDate(a.date)}</time>
</div>
<h2 class="news-card__title">${a.title}</h2>
<p class="news-card__excerpt">${a.excerpt}</p>
<span class="news-card__read-more">Читати далі →</span>
</div>
</a>`;
grid.appendChild(card);
});
gsap.from(grid.querySelectorAll('.news-card'), {
opacity: 0, y: 30, duration: 0.5, stagger: 0.08, ease: 'power2.out'
});
}
function initFilters() {
const btns = document.querySelectorAll('.filter-btn');
btns.forEach(btn => {
btn.addEventListener('click', () => {
btns.forEach(b => b.classList.remove('filter-btn--active'));
btn.classList.add('filter-btn--active');
const f = btn.dataset.filter;
const all = NewsDB.getPublished();
renderCards(f === 'all' ? all : all.filter(a => a.tag === f));
});
});
}
document.addEventListener('DOMContentLoaded', () => {
initNavbar();
initMobileMenu();
const script = document.createElement('script');
script.src = 'js/newsData.js';
script.onload = () => {
renderCards(NewsDB.getPublished());
initFilters();
};
document.head.appendChild(script);
});