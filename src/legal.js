import { tienda } from './config.js';
import { iniciarCookies } from './cookies.js';

document.querySelector('#anio').textContent = new Date().getFullYear();
iniciarCookies();

document.querySelectorAll('[data-wa-link]').forEach((a) => (a.href = 'https://wa.me/' + tienda.whatsapp));
document.querySelectorAll('[data-ig-link]').forEach((a) => (a.href = 'https://www.instagram.com/' + tienda.instagram + '/'));
