(function () {
  "use strict";

  // ⚠️ Cambia esta contraseña por una propia antes de publicar el sitio.
  var ADMIN_PASSWORD = "santana2026";
  var SESSION_KEY = "santana_admin_session";
  var STORAGE_KEY = "santana_products_v1";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  var brand = window.__BRAND__ || {};
  var site = window.__SITE__ || {};
  var escHTML = site.escHTML || function (s) { 
    if (!s) return '';
    return String(s).replace(/[&<>"]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      if (m === '"') return '&quot;';
      return m;
    });
  };
  
  var icon = site.icon || function (iconName) {
    var icons = {
      'pipe': '🔧',
      'sprinkler': '💧',
      'valve': '⚙️',
      'faucet': '🚿',
      'wrench': '🔧',
      'bolt': '🔩',
      'elbow': '🔄',
      'drain': '🕳️',
      'hose': '🧵',
      'timer': '⏱️',
      'tee': '🔀',
      'tank': '🛢️',
      'boxes': '📦',
      'toolbox': '🧰',
      'light': '💡',
      'paint': '🎨',
      'security': '🛡️',
      'key': '🔑'
    };
    return icons[iconName] || '📦';
  };
  
  var categoryName = site.categoryName || function (id) {
    var names = {
      'ELECTRICOS': 'Eléctricos',
      'PLOMERIA': 'Plomería',
      'PINTURA': 'Pintura',
      'HERRAMIENTA': 'Herramienta',
      'JARDINERIA': 'Jardinería',
      'CERRAJERIA': 'Cerrajería',
      'SEGURIDAD': 'Seguridad',
      'ILUMINACION': 'Iluminación',
      'FERRETERIA': 'Ferretería general'
    };
    return names[id] || id || 'General';
  };

  var editingId = null;
  var selectedCategory = 'all';

  function getProducts() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var stored = JSON.parse(raw);
        if (Array.isArray(stored)) return stored;
      }
    } catch (e) { /* ignore */ }
    return (window.__PRODUCTS__ || []).slice();
  }

  function saveProducts(list) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn("No se pudo guardar en localStorage", e);
      return false;
    }
  }

  function nextId(list) {
    var max = 0;
    list.forEach(function (p) {
      var n = parseInt(String(p.id || "").replace(/\D/g, ""), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return "p-" + String(max + 1).padStart(4, "0");
  }

  /* -----------------------------------------------------------
     Auth
  ----------------------------------------------------------- */
  function initAuth() {
    var lock = $("[data-admin-lock]");
    var app = $("[data-admin-app]");
    var form = $("[data-admin-login]");
    var errorEl = $("[data-admin-error]");
    var logoutBtn = $("[data-admin-logout]");

    function unlock() {
      lock.style.display = "none";
      app.style.display = "block";
      initApp();
    }

    var isUnlocked = false;
    try { isUnlocked = window.sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { /* ignore */ }
    if (isUnlocked) { unlock(); return; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = $("#admin-pass", form).value;
      if (val === ADMIN_PASSWORD) {
        try { window.sessionStorage.setItem(SESSION_KEY, "1"); } catch (err) { /* ignore */ }
        errorEl.textContent = "";
        unlock();
      } else {
        errorEl.textContent = "Contraseña incorrecta. Intenta de nuevo.";
      }
    });

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        try { window.sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
        location.reload();
      });
    }
  }

  /* -----------------------------------------------------------
     App (once unlocked)
  ----------------------------------------------------------- */
  var appInitialized = false;
  function initApp() {
    if (appInitialized) return;
    appInitialized = true;

    populateSelects();
    renderChips();
    renderTable();
    bindForm();
    bindExport();
    bindReset();
    bindFilters();
  }

  function populateSelects() {
    // Poblar select de categorías
    var catSelect = $("#f-category");
    if (catSelect) {
      // Usar categorías de brand o las predefinidas
      var categories = brand.categories || [
        { id: 'ELECTRICOS', name: 'Eléctricos' },
        { id: 'PLOMERIA', name: 'Plomería' },
        { id: 'PINTURA', name: 'Pintura' },
        { id: 'HERRAMIENTA', name: 'Herramienta' },
        { id: 'JARDINERIA', name: 'Jardinería' },
        { id: 'CERRAJERIA', name: 'Cerrajería' },
        { id: 'SEGURIDAD', name: 'Seguridad' },
        { id: 'ILUMINACION', name: 'Iluminación' },
        { id: 'FERRETERIA', name: 'Ferretería general' }
      ];
      
      catSelect.innerHTML = '<option value="">Seleccionar categoría</option>' + 
        categories.map(function (c) {
          return '<option value="' + escHTML(c.id) + '">' + escHTML(c.name) + "</option>";
        }).join("");
    }
    
    // Poblar select de íconos
    var iconSelect = $("#f-icon");
    if (iconSelect) {
      var iconNames = [
        { id: '', name: 'Sin ícono' },
        { id: 'toolbox', name: '🧰 Herramientas' },
        { id: 'light', name: '💡 Ilumin
