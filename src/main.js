import { tienda, sorteo, API_URL } from './config.js';
import { iniciarCookies } from './cookies.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');
const MODO_DEMO = !API_URL;

const ICONOS = {
  bolsa:
    '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  poleron:
    '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z"/>',
  regalo:
    '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
};

const icono = (nombre) =>
  `<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre] || ICONOS.regalo}</svg>`;

// ---------- Contenido desde config ----------
function pintarContenido() {
  $('#demo-banner').hidden = !MODO_DEMO;
  $$('[data-precio]').forEach((el) => (el.textContent = clp(sorteo.precioTicket)));
  $('[data-sorteo-titulo]').textContent = sorteo.titulo;
  $('[data-sorteo-descripcion]').textContent = sorteo.descripcion;
  $('[data-sorteo-fecha]').textContent = sorteo.fecha;
  $('[data-sorteo-transmision]').textContent = sorteo.transmision;
  $('#anio').textContent = new Date().getFullYear();

  const premios = $('#premios');
  for (const p of sorteo.premios) {
    const card = document.createElement('article');
    card.className = 'prize';
    card.innerHTML = `<div class="prize-icon">${icono(p.icono)}</div><span class="prize-place"></span><h3></h3><p></p>`;
    $('.prize-place', card).textContent = p.lugar;
    $('h3', card).textContent = p.nombre;
    $('p', card).textContent = p.detalle;
    premios.append(card);
  }

  const mensaje = encodeURIComponent('Hola! Tengo una consulta sobre el sorteo');
  $$('[data-wa-link]').forEach((a) => (a.href = `https://wa.me/${tienda.whatsapp}?text=${mensaje}`));
  $$('[data-ig-link]').forEach((a) => (a.href = `https://www.instagram.com/${tienda.instagram}/`));
  $$('[data-wa-text]').forEach((a) => (a.textContent = `WhatsApp ${tienda.whatsappVisible}`));
}

// ---------- Cantidad de tickets ----------
let cantidad = 1;

function pintarCantidad() {
  $('#cantidad').textContent = cantidad;
  $('#res-cantidad').textContent = cantidad;
  $('#res-total').textContent = clp(cantidad * sorteo.precioTicket);
  $('#menos').disabled = cantidad <= 1;
  $('#mas').disabled = cantidad >= sorteo.maxPorCompra;
  $$('.pack').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.n) === cantidad)));
}

function setCantidad(n) {
  cantidad = Math.min(sorteo.maxPorCompra, Math.max(1, n));
  pintarCantidad();
}

function iniciarCantidad() {
  const packs = $('#packs');
  for (const n of sorteo.packs) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pack';
    b.dataset.n = n;
    b.innerHTML = `<strong>${n}</strong><span>${clp(n * sorteo.precioTicket)}</span>`;
    b.addEventListener('click', () => setCantidad(n));
    packs.append(b);
  }
  $('#menos').addEventListener('click', () => setCantidad(cantidad - 1));
  $('#mas').addEventListener('click', () => setCantidad(cantidad + 1));
  pintarCantidad();
}

// ---------- RUT ----------
export function limpiarRut(valor) {
  return valor.replace(/[^0-9kK]/g, '').toUpperCase();
}

export function rutValido(valor) {
  const rut = limpiarRut(valor);
  if (!/^\d{7,8}[0-9K]$/.test(rut)) return false;
  const cuerpo = rut.slice(0, -1);
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const dv = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === rut.slice(-1);
}

function formatearRut(valor) {
  const rut = limpiarRut(valor).slice(0, 9);
  if (rut.length < 2) return rut;
  const cuerpo = rut.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpo}-${rut.slice(-1)}`;
}

// ---------- Formulario ----------
const REGLAS = {
  nombre: (v) => (v.trim().split(/\s+/).length >= 2 ? '' : 'Escribe tu nombre y apellido.'),
  rut: (v) => (rutValido(v) ? '' : 'Ingresa un RUT válido.'),
  telefono: (v) => (/^9\d{8}$/.test(v) ? '' : 'Debe tener 9 dígitos y empezar con 9.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Ingresa un correo válido.'),
  email2: (v, datos) =>
    v.trim().toLowerCase() === datos.email.trim().toLowerCase() ? '' : 'Los correos no coinciden.',
  acepto: (v) => (v ? '' : 'Debes aceptar las bases para continuar.'),
};

function leerFormulario(form) {
  return {
    nombre: form.nombre.value,
    rut: form.rut.value,
    telefono: form.telefono.value,
    email: form.email.value,
    email2: form.email2.value,
    instagram: form.instagram.value.trim(),
    acepto: form.acepto.checked,
  };
}

function validar(form) {
  const datos = leerFormulario(form);
  let primero = null;
  for (const [campo, regla] of Object.entries(REGLAS)) {
    const mensaje = regla(datos[campo], datos);
    const input = form[campo];
    $(`[data-error="${campo}"]`, form).textContent = mensaje;
    input.setAttribute('aria-invalid', String(Boolean(mensaje)));
    if (mensaje && !primero) primero = input;
  }
  if (primero) primero.focus();
  return primero ? null : datos;
}

function abrirModal(html) {
  $('#modal-body').innerHTML = html;
  $('#modal').showModal();
}

function escapar(texto) {
  const d = document.createElement('div');
  d.textContent = texto;
  return d.innerHTML;
}

// Con backend: crea la compra y redirige a Mercado Pago.
async function iniciarPago(datos) {
  const res = await fetch(`${API_URL}/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: datos.nombre.trim(),
      rut: limpiarRut(datos.rut),
      phoneNumber: `+56${datos.telefono}`,
      email: datos.email.trim().toLowerCase(),
      socialHandle: datos.instagram,
      quantity: cantidad,
      checkoutRequestId: crypto.randomUUID(),
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.redirectUrl) throw new Error(json.message || 'No fue posible iniciar el pago.');
  window.location.assign(json.redirectUrl);
}

// Sin backend: muestra cómo se vería la confirmación, sin cobrar.
function simularPago(datos) {
  const base = 1000 + Math.floor(Math.random() * 8000);
  const tickets = Array.from({ length: cantidad }, (_, i) => `#${String(base + i).padStart(5, '0')}`);
  abrirModal(`
    <h3>¡Listo, ${escapar(datos.nombre.trim().split(/\s+/)[0])}!</h3>
    <p>Así se verá la confirmación después de pagar <strong>${clp(cantidad * sorteo.precioTicket)}</strong> en Mercado Pago.</p>
    <ul class="tickets">${tickets.map((t) => `<li>${t}</li>`).join('')}</ul>
    <p class="modal-note">Demostración: no se realizó ningún cobro y estos números no son válidos.</p>
  `);
}

function iniciarFormulario() {
  const form = $('#form-compra');
  const boton = $('#pagar');

  form.rut.addEventListener('input', () => (form.rut.value = formatearRut(form.rut.value)));
  form.telefono.addEventListener('input', () => (form.telefono.value = form.telefono.value.replace(/\D/g, '')));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = validar(form);
    if (!datos) return;
    boton.disabled = true;
    const texto = boton.textContent;
    boton.textContent = 'Iniciando pago seguro…';
    try {
      if (MODO_DEMO) simularPago(datos);
      else await iniciarPago(datos);
    } catch (err) {
      abrirModal(`<h3>Ups</h3><p>${escapar(err.message)}</p>`);
    } finally {
      boton.disabled = false;
      boton.textContent = texto;
    }
  });

  $('#ver-bases').addEventListener('click', () =>
    abrirModal(`
      <h3>Bases del sorteo</h3>
      <ul class="bases">
        <li>Cada ticket pagado participa una vez en el sorteo.</li>
        <li>Los tickets se envían al correo indicado al confirmarse el pago.</li>
        <li>El sorteo se realiza en vivo por Instagram en la fecha anunciada.</li>
        <li>No se hacen devoluciones ni cambios.</li>
      </ul>
      <p class="modal-note">Texto de ejemplo: las bases definitivas se acordarán con la tienda.</p>
    `)
  );
}

function iniciarRecuperar() {
  $('#form-recuperar').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#rec-email').value;
    const msg = $('#rec-msg');
    if (REGLAS.email(email)) {
      msg.textContent = 'Ingresa un correo válido.';
      return;
    }
    msg.textContent = MODO_DEMO
      ? 'Demostración: aquí se enviará un enlace privado a tu correo.'
      : 'Si el correo tiene tickets, te llegará un enlace en unos minutos.';
  });
}

pintarContenido();
iniciarCantidad();
iniciarFormulario();
iniciarRecuperar();
iniciarCookies();
