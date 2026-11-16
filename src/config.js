// Datos editables del sitio y del sorteo. Todo lo que la clienta quiera
// cambiar (premios, precio, fecha, contacto) vive en este archivo.

export const tienda = {
  nombre: 'Tiendita María3y',
  instagram: 'tiendita.maria3y',
  whatsapp: '56965989780',
  whatsappVisible: '+56 9 6598 9780',
  ciudad: 'Santiago',
};

export const sorteo = {
  titulo: 'Sorteo de ropa',
  descripcion:
    'Compra tu imagen digital y participa por ropa linda de la tiendita. Cada imagen es un ticket para el sorteo.',
  precioTicket: 1000,
  maxPorCompra: 50,
  fecha: 'Fecha por confirmar',
  transmision: 'En vivo por Instagram',
  // Premios de ejemplo: reemplazar por fotos y nombres reales.
  premios: [
    { lugar: '1er lugar', nombre: 'Pack de ropa completo', detalle: 'Premio de ejemplo', icono: 'bolsa' },
    { lugar: '2do lugar', nombre: 'Polerón a elección', detalle: 'Premio de ejemplo', icono: 'poleron' },
    { lugar: '3er lugar', nombre: 'Set sorpresa', detalle: 'Premio de ejemplo', icono: 'regalo' },
  ],
  packs: [1, 3, 5, 10],
};

// Cuando exista el backend, definir VITE_API_URL en un archivo .env.
// Sin esa variable la página funciona en modo demostración (no cobra).
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
