// Aviso y preferencias de cookies.
// Hoy el sitio no usa cookies de medición ni publicidad: solo guarda esta
// elección. Si se agrega analítica, debe cargarse únicamente cuando
// consentimiento() devuelva 'all'.

const CLAVE = 'cookies-consent';

export function consentimiento() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function guardar(valor) {
  try {
    localStorage.setItem(CLAVE, valor);
  } catch {
    // Sin almacenamiento disponible el aviso vuelve a aparecer en la próxima visita.
  }
}

export function iniciarCookies() {
  const banner = document.querySelector('#cookie-banner');
  if (!banner) return;

  banner.hidden = Boolean(consentimiento());

  banner.querySelectorAll('[data-cookie-choice]').forEach((boton) =>
    boton.addEventListener('click', () => {
      guardar(boton.dataset.cookieChoice);
      banner.hidden = true;
      document.dispatchEvent(new CustomEvent('cookies:cambio', { detail: boton.dataset.cookieChoice }));
    })
  );

  document.querySelectorAll('[data-cookie-prefs]').forEach((boton) =>
    boton.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('button').focus();
    })
  );
}
