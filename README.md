# Rifa María

Sitio web de sorteos para la Tiendita María3y.

## Estado

Demo de frontend lista para mostrar. Funciona en **modo demostración**: el pago está
simulado y no se cobra nada. Falta el backend (Mercado Pago, tickets y correo).

## Uso

```bash
npm install
npm run dev
```

`npm run build` genera el sitio estático en `dist/`.

## Estructura

- `index.html`: la página completa (hero, sorteo, pasos, compra, recuperar tickets).
- `src/config.js`: datos editables (premios, precio del ticket, fecha, WhatsApp, Instagram).
- `src/main.js`: selector de tickets, validación del formulario (incluye RUT) y flujo de pago.
- `src/style.css`: estilos con la identidad de la tienda.
- `public/logo.webp`: logo recortado desde una captura; reemplazar por el archivo original.

## Conectar el backend

Al definir `VITE_API_URL` en un archivo `.env`, el formulario deja el modo demostración y
envía la compra a `POST {VITE_API_URL}/purchase`, que debe responder `{ "redirectUrl": "..." }`
con el enlace de pago de Mercado Pago.
