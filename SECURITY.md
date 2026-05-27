# Безпека сайту — Північна Дивізія

## Архітектура захисту

### 1. Адмін-панель
| Рівень | Захист |
|--------|--------|
| URL | Секретний шлях (не індексується) |
| Пароль | PBKDF2-SHA256, 310 000 ітерацій |
| Брутфорс | Експоненційне блокування (2^спроб секунд) |
| Сесія | Криптографічний токен (32 байти) |
| Таймаут | Автовихід через 30 хв бездіяльності |
| XSS | Sanitize всіх виводів, URL-валідація |

### 2. HTTP-заголовки (через .htaccess / nginx)
- `X-Frame-Options: DENY` — захист від clickjacking
- `Content-Security-Policy` — захист від XSS
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — вимкнення небезпечних API браузера
- `Strict-Transport-Security` (після підключення HTTPS)

### 3. Rate limiting (Nginx)
- Публічні сторінки: 10 запитів/сек
- Адмін-сторінка: 2 запити/сек

---

## Як змінити пароль адміну

### Крок 1 — Згенерувати новий хеш
```python
import hashlib, os, base64, json

password = "НОВИЙ_ПАРОЛЬ_ТУТ"   # ← замінити
salt = os.urandom(32)
key  = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 310000)

print(json.dumps({
  "salt": base64.b64encode(salt).decode(),
  "hash": base64.b64encode(key).decode(),
  "iterations": 310000
}))
```

### Крок 2 — Вставити в admin_auth.js
Знайди блок `CREDENTIAL` і замінити значення `salt` та `hash`:
```js
const CREDENTIAL = {
  salt:       'НОВИЙ_SALT_BASE64',
  hash:       'НОВИЙ_HASH_BASE64',
  iterations: 310000
};
```

---

## Секретний URL адмін-панелі
Файл: `admin_KJTAwOzToZxQj5X7V7ILGFweMyg.html`

⚠️ **Ніколи не публікуй цей URL у відкритому доступі!**
- Не додавай посилання на нього в публічних сторінках
- Не зберігай в Git (додай до .gitignore)
- Не надсилай через незахищені канали

---

## Рекомендації для продакшену

1. **HTTPS** — обов'язково. Розкоментуй HSTS в .htaccess після підключення.
2. **Хостинг** — обери провайдера з підтримкою заголовків безпеки.
3. **Бекап** — `localStorage` зберігається лише в браузері. Для реального продакшену потрібен сервер і база даних.
4. **Моніторинг** — підключи UptimeRobot або аналогічний сервіс.
5. **Оновлення** — слідкуй за оновленнями бібліотек (GSAP та ін.).

---

## .gitignore (якщо використовуєш Git)
```
.htaccess
admin_*.html
SECURITY.md
nginx_security.conf
*.log
*.bak
```
