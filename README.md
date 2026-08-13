# Ferretería Santana — Sitio Web

Sitio estático (HTML/CSS/JS puro, sin frameworks) listo para subir a GitHub Pages o cualquier hosting estático.

## 📁 Estructura

```
ferreteria-santana/
├── index.html          ← Página de inicio
├── tienda.html          ← Catálogo de productos con filtros
├── contacto.html        ← Formulario de contacto + mapa
├── admin.html            ← Panel para agregar/editar productos
├── styles.css
├── main.js
├── admin.js
├── lib/
│   ├── manifest.js       ← Datos de la marca (contacto, categorías, textos)
│   ├── products-data.js  ← Catálogo de productos por defecto
│   ├── gsap.min.js
│   └── ScrollTrigger.min.js
├── .htaccess             ← Solo aplica si usas hosting Apache (Hostinger, etc.)
└── README.md
```

## ✏️ Antes de publicar: datos que DEBES editar

Abre `lib/manifest.js` y reemplaza estos valores marcados con TODO:

- `contact.phone`, `contact.phoneDisplay`, `contact.whatsapp` (con código de país, sin `+` ni espacios, ej. `528711234567`)
- `contact.email`
- `contact.address` y `contact.city`
- `contact.mapsEmbed` (ve a Google Maps → Compartir → Insertar mapa → copia la URL del `src` del iframe)
- `social.facebook` / `social.instagram`

También puedes editar libremente los productos de ejemplo en `lib/products-data.js`, o hacerlo desde el panel de administración (ver abajo).

## 🔐 Panel de administración (`admin.html`)

Permite agregar, editar y eliminar productos desde el navegador, sin tocar código.

- **Contraseña por defecto:** `santana2026` — dentro de `admin.js` (línea con `ADMIN_PASSWORD`). **Cámbiala antes de publicar el sitio.**
- **Importante:** este sitio no tiene servidor ni base de datos, así que la contraseña vive en el código del navegador. Es suficiente para que un visitante casual no toque tu catálogo, pero no es seguridad real — cualquiera con conocimientos técnicos podría verla en el código fuente. Si más adelante necesitas seguridad real, se necesitaría un backend (fuera del alcance de un sitio estático).
- Los cambios que hagas en el panel se guardan automáticamente en el navegador donde los hiciste (localStorage) y se ven reflejados de inmediato en `tienda.html` **desde ese mismo navegador**.
- Para que **todos los visitantes del sitio** (no solo tú) vean los productos nuevos, usa el botón **"Descargar products-data.js actualizado"**, y sube ese archivo a tu repositorio de GitHub reemplazando `lib/products-data.js`. Luego haz commit y push — GitHub Pages se actualiza solo en 1-2 minutos.

### Flujo recomendado para agregar productos

1. Entra a `tuweb.com/admin.html` con la contraseña.
2. Agrega/edita/elimina los productos que necesites.
3. Da clic en "Descargar products-data.js actualizado".
4. Sube el archivo descargado a GitHub, reemplazando `lib/products-data.js`.
5. Espera 1-2 minutos y revisa `tienda.html` — ya debe verse igual para todos.

## 🚀 Subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público o privado con GitHub Pro para Pages privado).
2. Sube TODOS los archivos de esta carpeta a la raíz del repositorio (arrastra y suelta en la web de GitHub, o usa `git push`).
3. Ve a **Settings → Pages** del repositorio.
4. En "Source" elige la rama `main` y la carpeta `/ (root)`.
5. Guarda. GitHub te dará una URL tipo `https://tuusuario.github.io/ferreteria-santana/`.
6. Si tienes un dominio propio (ej. `ferreteriasantana.mx`), puedes configurarlo en la misma sección "Pages" con un registro CNAME en tu proveedor de dominio.

## 🖼️ Agregar fotos reales

El sitio usa íconos ilustrados en vez de fotografías para que puedas publicarlo de inmediato. Cuando tengas fotos de la tienda, del inventario o del personal:

1. Guárdalas en `assets/img/` (crea la carpeta si no existe), idealmente en formato `.webp` o `.jpg`.
2. Reemplaza los bloques `<div class="product-media">...</div>` o las tarjetas del hero en el HTML con `<img src="assets/img/tu-foto.jpg" alt="...">`.
3. Si quieres, puedo ayudarte a integrarlas — solo compárteme las imágenes.

## 🌐 Sin conexión / probar localmente

Todos los archivos usan `<script defer>` clásico (no ES modules), así que puedes abrir `index.html` directamente haciendo doble clic — funciona incluso sin servidor local. Para una vista más realista, puedes correr:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

## ⚠️ Nota sobre WhatsApp y el formulario de contacto

El botón de WhatsApp y el formulario de contacto abren WhatsApp Web / tu correo con el mensaje pre-escrito — no hay un backend que envíe correos automáticamente (un sitio estático en GitHub no puede hacer esto sin un servicio externo). Si más adelante quieres que el formulario envíe correos de verdad sin abrir el cliente de correo del usuario, se puede integrar un servicio como Formspree — dime si te interesa y te ayudo a conectarlo.
