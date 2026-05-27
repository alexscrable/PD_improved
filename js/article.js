'use strict';
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
function getArticleId() {
return new URLSearchParams(window.location.search).get('id');
}
function render404() {
document.getElementById('article-title').textContent = 'Статтю не знайдено';
document.getElementById('article-content').innerHTML = '<p>Можливо, вона була видалена або посилання неправильне.</p><a href="news.html" class="btn btn--outline" style="margin-top:2rem;display:inline-flex;">← Всі новини</a>';
}
function renderArticle(a) {
document.title = a.title + ' — Північна Дивізія';
const cover = document.getElementById('article-cover');
if (a.cover) { cover.src = a.cover; cover.alt = a.title; }
else { document.querySelector('.article-hero__bg').style.background = 'var(--color-graphite-deep)'; }
document.getElementById('article-tag').textContent = a.tag;
document.getElementById('article-date').textContent = NewsDB.formatDate(a.date);
document.getElementById('article-title').textContent = a.title;
document.getElementById('article-content').innerHTML = a.body || '<p>Текст статті скоро буде додано.</p>';
const others = NewsDB.getPublished().filter(x => x.id !== a.id).slice(0, 3);
const rel = document.getElementById('related-articles');
rel.innerHTML = others.map(o => `
<a href="article.html?id=${o.id}" class="related-card">
<div class="related-card__img" style="background-image:url('${o.cover}')"></div>
<div class="related-card__body">
<span class="news-card__tag">${o.tag}</span>
<p class="related-card__title">${o.title}</p>
</div>
</a>`).join('');
}
document.addEventListener('DOMContentLoaded', () => {
initNavbar();
initMobileMenu();
const script = document.createElement('script');
script.src = 'js/newsData.js';
script.onload = () => {
const id = getArticleId();
if (!id) { render404(); return; }
const article = NewsDB.getById(id);
if (!article || !article.published) { render404(); return; }
renderArticle(article);
};
document.head.appendChild(script);
});