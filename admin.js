(function () {
  "use strict";

  // ⚠️ Cambia esta contraseña por una propia antes de publicar el sitio.
  // Este es un panel para un sitio 100% estático (sin servidor), así que
  // esta contraseña vive en el código del navegador: sirve para evitar que
  // un visitante casual toque el catálogo, pero NO es seguridad real.
  // No la uses para datos sensibles.
  var ADMIN_PASSWORD = "santana2026";
  var SESSION_KEY = "santana_admin_session";
  var STORAGE_KEY = "santana_products_v1";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  var brand = window.__BRAND__ || {};
  var site = window.__SITE__ || {};
  var escHTML = site.escHTML || function (s) { return s; };
  var icon = site.icon || function () { return ""; };
  var categoryName = site.categoryName || function (id) { return id; };

  var editingId = null;

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
    var catSelect = $("#f-category");
    var iconSelect = $("#f-icon");
    if (catSelect) {
      catSelect.innerHTML = (brand.categories || []).map(function (c) {
        return '<option value="' + escHTML(c.id) + '">' + escHTML(c.name) + "</option>";
      }).join("");
    }
    var iconNames = ["pipe", "sprinkler", "valve", "faucet", "wrench", "bolt", "elbow", "drain", "hose", "timer", "tee", "tank", "boxes"];
    if (iconSelect) {
      iconSelect.innerHTML = iconNames.map(function (n) {
        return '<option value="' + n + '">' + n + "</option>";
      }).join("");
    }
  }

  function renderChips() {
    var target = $("[data-admin-chips]");
    if (!target) return;
    var html = '<button class="chip is-active" data-chip="all" type="button">Todos</button>';
    html += (brand.categories || []).map(function (c) {
      return '<button class="chip" data-chip="' + escHTML(c.id) + '" type="button">' + escHTML(c.name) + "</button>";
    }).join("");
    target.innerHTML = html;
  }

  function currentFilter() {
    var chips = $("[data-admin-chips]");
    var active = chips ? chips.querySelector(".chip.is-active") : null;
    var cat = active ? active.dataset.chip : "all";
    var search = $("[data-admin-search]");
    var q = search ? search.value.trim().toLowerCase() : "";
    return { cat: cat, q: q };
  }

  function renderTable() {
    var tbody = $("[data-product-table]");
    var countEl = $("[data-product-count]");
    if (!tbody) return;
    var list = getProducts();
    var f = currentFilter();
    var filtered = list.filter(function (p) {
      var matchCat = f.cat === "all" || p.category === f.cat;
      var matchQ = !f.q || (p.name || "").toLowerCase().indexOf(f.q) !== -1;
      return matchCat && matchQ;
    });
    if (countEl) countEl.textContent = list.length;
    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--ink-mute);padding:2rem 0;">Sin productos que coincidan.</td></tr>';
      return;
    }
    tbody.innerHTML = filtered.map(function (p) {
      var price = p.price ? ("$" + escHTML(p.price)) : '<span style="color:var(--ink-mute)">Cotizar</span>';
      return (
        "<tr>" +
          '<td><div class="p-thumb">' + icon(p.icon) + "</div></td>" +
          "<td><strong>" + escHTML(p.name) + '</strong><br><span style="color:var(--ink-mute);font-size:.78rem;">' + escHTML(p.unit || "") + "</span></td>" +
          '<td><span class="badge-tag">' + escHTML(categoryName(p.category)) + "</span></td>" +
          "<td>" + price + "</td>" +
          '<td><div class="row-actions">' +
            '<button class="icon-btn" data-edit="' + escHTML(p.id) + '" type="button" aria-label="Editar">' + editIconSvg() + "</button>" +
            '<button class="icon-btn danger" data-delete="' + escHTML(p.id) + '" type="button" aria-label="Eliminar">' + trashIconSvg() + "</button>" +
          "</div></td>" +
        "</tr>"
      );
    }).join("");

    $$("[data-edit]", tbody).forEach(function (btn) {
      btn.addEventListener("click", function () { startEdit(btn.dataset.edit); });
    });
    $$("[data-delete]", tbody).forEach(function (btn) {
      btn.addEventListener("click", function () { deleteProduct(btn.dataset.delete); });
    });
  }

  function editIconSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  }
  function trashIconSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';
  }

  /* -----------------------------------------------------------
     Form: add / edit
  ----------------------------------------------------------- */
  function bindForm() {
    var form = $("[data-product-form]");
    var cancelBtn = $("[data-cancel-edit]");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var list = getProducts();
      var values = {};
      $$("[data-field]", form).forEach(function (el) { values[el.dataset.field] = el.value.trim(); });

      if (editingId) {
        list = list.map(function (p) {
          if (p.id !== editingId) return p;
          return Object.assign({}, p, values, { id: p.id });
        });
      } else {
        values.id = nextId(list);
        list.push(values);
      }
      saveProducts(list);
      resetForm();
      renderTable();
      flashStatus("Producto guardado. Ya se ve en la tienda de este navegador.");
    });

    if (cancelBtn) cancelBtn.addEventListener("click", resetForm);
  }

  function startEdit(id) {
    var list = getProducts();
    var p = list.find(function (item) { return item.id === id; });
    if (!p) return;
    editingId = id;
    var form = $("[data-product-form]");
    $$("[data-field]", form).forEach(function (el) {
      el.value = p[el.dataset.field] || "";
    });
    $("[data-form-title]").textContent = "Editar producto";
    $("[data-submit-label]").textContent = "Guardar cambios";
    $("[data-cancel-edit]").style.display = "inline-flex";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetForm() {
    editingId = null;
    var form = $("[data-product-form]");
    form.reset();
    $("[data-form-title]").textContent = "Agregar producto";
    $("[data-submit-label]").textContent = "Agregar producto";
    $("[data-cancel-edit]").style.display = "none";
  }

  function deleteProduct(id) {
    if (!window.confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    var list = getProducts().filter(function (p) { return p.id !== id; });
    saveProducts(list);
    renderTable();
    flashStatus("Producto eliminado.");
  }

  /* -----------------------------------------------------------
     Filters
  ----------------------------------------------------------- */
  function bindFilters() {
    var chips = $("[data-admin-chips]");
    var search = $("[data-admin-search]");
    if (chips) {
      chips.addEventListener("click", function (e) {
        var b = e.target.closest(".chip");
        if (!b) return;
        $$(".chip", chips).forEach(function (c) { c.classList.remove("is-active"); });
        b.classList.add("is-active");
        renderTable();
      });
    }
    if (search) search.addEventListener("input", renderTable);
  }

  /* -----------------------------------------------------------
     Export updated products-data.js
  ----------------------------------------------------------- */
  function bindExport() {
    var btn = $("[data-export-btn]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var list = getProducts();
      var fileContent =
        '(function () {\n  "use strict";\n\n  // Catálogo generado desde el panel de administración.\n' +
        "  // Reemplaza el archivo lib/products-data.js de tu repositorio con este contenido\n" +
        "  // y súbelo a GitHub para que el cambio se vea en el sitio publicado.\n" +
        "  window.__PRODUCTS__ = " + JSON.stringify(list, null, 2) + ";\n})();\n";

      var blob = new Blob([fileContent], { type: "text/javascript" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "products-data.js";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      var statusEl = $("[data-export-status]");
      if (statusEl) {
        statusEl.textContent = "Descargado. Súbelo a lib/products-data.js en GitHub.";
        statusEl.classList.add("is-ok");
      }
    });
  }

  function bindReset() {
    var btn = $("[data-reset-btn]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (!window.confirm("Esto borrará los cambios guardados en este navegador y volverá al catálogo original del archivo. ¿Continuar?")) return;
      try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
      renderTable();
      flashStatus("Catálogo restablecido al original.");
    });
  }

  function flashStatus(msg) {
    var statusEl = $("[data-export-status]");
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.remove("is-ok");
  }

  document.addEventListener("DOMContentLoaded", function () {
    safe(initAuth, "initAuth");
  });
})();
