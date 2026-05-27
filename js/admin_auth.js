'use strict';
const Auth = (() => {
const CREDENTIAL = {
salt: 'sdlXh3LrPD3XIi1kRiHe5RvjjQhUsxHRNyuY+Iqy/ZA=',
hash: 'HXhmkbTn6igjOFtEBfeOG+jK9uI3JXQxzM1wSUh9kJg=',
iterations: 310000
};
const MAX_ATTEMPTS = 10;
const LOCKOUT_BASE_S = 2;
const SESSION_KEY = 'pd_sess_token';
const LOCKOUT_KEY = 'pd_lockout';
const INACTIVITY_MS = 30 * 60 * 1000;
let inactivityTimer = null;
function b64ToBytes(b64) {
const bin = atob(b64);
return Uint8Array.from(bin, c => c.charCodeAt(0));
}
function bytesToB64(buf) {
return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
function timingSafeEqual(a, b) {
if (a.byteLength !== b.byteLength) return false;
const va = new DataView(a instanceof ArrayBuffer ? a : a.buffer);
const vb = new DataView(b instanceof ArrayBuffer ? b : b.buffer);
let diff = 0;
for (let i = 0; i < a.byteLength; i++) {
diff |= va.getUint8(i) ^ vb.getUint8(i);
}
return diff === 0;
}
async function hashPassword(password, saltBytes) {
const enc = new TextEncoder();
const keyMaterial = await crypto.subtle.importKey(
'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
);
const bits = await crypto.subtle.deriveBits(
{ name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: CREDENTIAL.iterations },
keyMaterial, 256
);
return bits;
}
async function verifyPassword(password) {
try {
const saltBytes = b64ToBytes(CREDENTIAL.salt);
const storedHash = b64ToBytes(CREDENTIAL.hash);
const computedHash = await hashPassword(password, saltBytes);
return timingSafeEqual(storedHash, computedHash);
} catch {
return false;
}
}
function generateToken() {
const buf = new Uint8Array(32);
crypto.getRandomValues(buf);
return bytesToB64(buf);
}
function getLockout() {
try {
return JSON.parse(localStorage.getItem(LOCKOUT_KEY)) || { attempts: 0, lockedUntil: 0 };
} catch { return { attempts: 0, lockedUntil: 0 }; }
}
function saveLockout(data) {
localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data));
}
function isLocked() {
const { lockedUntil } = getLockout();
return Date.now() < lockedUntil;
}
function lockoutRemainingSeconds() {
const { lockedUntil } = getLockout();
return Math.ceil(Math.max(0, lockedUntil - Date.now()) / 1000);
}
function recordFailedAttempt() {
const data = getLockout();
data.attempts = (data.attempts || 0) + 1;
const delaySec = Math.min(Math.pow(LOCKOUT_BASE_S, data.attempts), 86400);
data.lockedUntil = Date.now() + delaySec * 1000;
saveLockout(data);
return { attempts: data.attempts, delaySec };
}
function resetLockout() {
localStorage.removeItem(LOCKOUT_KEY);
}
function getStoredToken() {
return sessionStorage.getItem(SESSION_KEY);
}
function createSession() {
const token = generateToken();
sessionStorage.setItem(SESSION_KEY, token);
resetLockout();
resetInactivityTimer();
return token;
}
function destroySession() {
sessionStorage.removeItem(SESSION_KEY);
clearTimeout(inactivityTimer);
}
function isAuthenticated() {
return !!getStoredToken();
}
function resetInactivityTimer() {
clearTimeout(inactivityTimer);
inactivityTimer = setTimeout(() => {
destroySession();
window.location.reload();
}, INACTIVITY_MS);
}
function attachActivityListeners() {
['click', 'keydown', 'mousemove', 'touchstart'].forEach(evt => {
document.addEventListener(evt, resetInactivityTimer, { passive: true });
});
}
async function login(password) {
if (isLocked()) {
return { ok: false, locked: true, remainingSec: lockoutRemainingSeconds() };
}
await new Promise(r => setTimeout(r, 200));
const valid = await verifyPassword(password);
if (valid) {
createSession();
attachActivityListeners();
return { ok: true };
} else {
const { attempts, delaySec } = recordFailedAttempt();
const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attempts);
return { ok: false, locked: isLocked(), remainingSec: delaySec, attemptsLeft };
}
}
function logout() {
destroySession();
}
function guard() {
if (!isAuthenticated()) {
destroySession();
return false;
}
resetInactivityTimer();
return true;
}
function resumeSession() {
if (isAuthenticated()) {
attachActivityListeners();
resetInactivityTimer();
return true;
}
return false;
}
return { login, logout, guard, isAuthenticated, resumeSession, isLocked, lockoutRemainingSeconds };
})();