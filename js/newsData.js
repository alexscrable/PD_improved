const NewsDB = (() => {
const KEY = 'pd_news';
const DEFAULT_ARTICLES = [
{
id: 'mykolaiv-2026',
title: 'Відкриття осередку в Миколаєві',
tag: 'Осередок',
date: '2026-04-20',
cover: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80&fit=crop',
excerpt: "«Північна Дивізія» продовжує розширюватись — новий осередок відкрито в Миколаєві. Тепер нас п’ятеро: зустрічаємо нових братів на півдні країни.",
body: `<h2>Південь приєднується до руху</h2>
<p>20 квітня 2026 року «Північна Дивізія» офіційно відкрила свій п’ятий осередок — у Миколаєві. Захід зібрав понад 40 учасників: як місцевих активістів, так і братів з інших міст, які приїхали підтримати.</p>
<blockquote>«Ми завжди знали, що південь — наш. Миколаїв — місто з характером, і тут є люди, які готові діяти. Чекаємо на великі справи.» — керівник київського осередку</blockquote>
<h2>Що далі</h2>
<p>Вже найближчим часом миколаївський осередок планує перший вишкіл та низку волонтерських ініціатив. Долучитись можна через форму на сайті або напряму через Telegram.</p>`,
published: true,
createdAt: '2026-04-20T12:00:00Z'
},
{
id: 'animals-kyiv-2026',
title: 'Київський осередок відвідав центр адопції тварин',
tag: 'Волонтерство',
date: '2026-04-05',
cover: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&q=80&fit=crop',
excerpt: 'Хлопці з Києва провели час із підопічними центру — допомогли, поспілкувались і нагадали, що дія може бути доброю.',
body: `<h2>Дія — це не завжди вишкіл</h2>
<p>5 квітня учасники київського осередку провели волонтерський день у центрі адопції тварин. Хлопці прибирали, годували тварин, грали з ними та допомогли центру з організаційними питаннями.</p>
<p>«Ми показуємо, що братерство — це не лише про себе. Це про відповідальність перед тими, хто слабший» — сказав один із учасників.</p>
<h2>Плануємо повторити</h2>
<p>За результатами дня вже домовилися про наступний візит у травні. Якщо хочеш приєднатись — пиши в Telegram.</p>`,
published: true,
createdAt: '2026-04-05T14:00:00Z'
},
{
id: 'labuda-track-2026',
title: 'Nord Records: вийшов новий трек «Лабуда»',
tag: 'Музика',
date: '2026-03-20',
cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80&fit=crop',
excerpt: 'Свіжий реліз від нашого лейблу вже доступний на всіх стрімінгових платформах. Слухай — і розповідай своїм.',
body: `<h2>Новий реліз Nord Records</h2>
<p>20 березня лейбл Nord Records випустив новий трек «Лабуда». Пісня поєднує в собі атмосферу руху — сиру, чесну і без зайвого пафосу.</p>
<p>Трек вже доступний на Spotify, Apple Music, YouTube Music та всіх інших стрімінгових платформах.</p>
<blockquote>«Ми не робимо музику "про рух". Ми робимо музику, яка і є рухом.»</blockquote>
<h2>Слухай і ділись</h2>
<p>Посилання на трек — в Instagram та Telegram каналі Nord Records. Репостни, розкажи друзям. Це найкраща підтримка.</p>`,
published: true,
createdAt: '2026-03-20T10:00:00Z'
}
];
function getAll() {
try {
const raw = localStorage.getItem(KEY);
if (!raw) {
localStorage.setItem(KEY, JSON.stringify(DEFAULT_ARTICLES));
return DEFAULT_ARTICLES;
}
return JSON.parse(raw);
} catch (e) {
return DEFAULT_ARTICLES;
}
}
function getPublished() {
return getAll()
.filter(a => a.published)
.sort((a, b) => new Date(b.date) - new Date(a.date));
}
function getById(id) {
return getAll().find(a => a.id === id) || null;
}
function save(article) {
const all = getAll();
const idx = all.findIndex(a => a.id === article.id);
if (idx >= 0) {
all[idx] = article;
} else {
all.unshift(article);
}
localStorage.setItem(KEY, JSON.stringify(all));
}
function remove(id) {
const all = getAll().filter(a => a.id !== id);
localStorage.setItem(KEY, JSON.stringify(all));
}
function generateId(title) {
return title.toLowerCase()
.replace(/[^а-яіїєёa-z0-9\s]/gi, '')
.replace(/\s+/g, '-')
.slice(0, 40)
+ '-' + Date.now().toString(36);
}
function formatDate(dateStr, lang = 'uk') {
const d = new Date(dateStr + 'T12:00:00');
const months = {
uk: ['Січня','Лютого','Березня','Квітня','Травня','Червня','Липня','Серпня','Вересня','Жовтня','Листопада','Грудня'],
en: ['January','February','March','April','May','June','July','August','September','October','November','December']
};
const m = months[lang] || months.uk;
if (lang === 'en') return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
}
return { getAll, getPublished, getById, save, remove, generateId, formatDate };
})();