(function() {
  "use strict";

  var ADMIN_PASSWORD = "santana2026";
  var SESSION_KEY = "santana_admin_session";
  var STORAGE_KEY = "santana_products_v1";

  function $(selector) { return document.querySelector(selector); }
  function $$(selector) { return Array.from(document.querySelectorAll(selector)); }

  // ===== LOGIN =====
  function initAuth() {
    var lock = $('[data-admin-lock]');
    var app = $('[data-admin-app]');
    var form = $('[data-admin-login]');
    var errorEl = $('[data-admin-error]');
    var logoutBtn = $('[data-admin-logout]');

    function unlock() {
      lock.style.display = 'none';
      app.style.display = 'block';
      initApp();
    }

    // Verificar sesión guardada
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        unlock();
        return;
      }
    } catch(e) {}

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var password = document.getElementById('admin-pass').value;
      
      if (password === ADMIN_PASSWORD) {
        try { sessionStorage.setItem(SESSION_KEY, '1'); } catch(e) {}
        errorEl.textContent = '';
        unlock();
      } else {
        errorEl.textContent = '❌ Contraseña incorrecta';
        document.getElementById('admin-pass').value = '';
        document.getElementById('admin-pass').focus();
      }
    });

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        try { sessionStorage.removeItem(SESSION_KEY); } catch(e) {}
        location.reload();
      });
    }
  }

  // ===== APP =====
  function initApp() {
    renderProducts(getProducts());
    renderChips();
    setupForm();
    setupFilters();
    setupExport();
    setupReset();
  }

  // ===== PRODUCTOS =====
  function getProducts() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch(e) {}
    return window.__PRODUCTS__ || [];
  }

  function saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return true;
    } catch(e) { return false; }
  }

  // ===== RENDER =====
  function renderProducts(products) {
    var tbody = document.querySelector('[data-product-table]');
    var count = document.querySelector('[data-product-count]');
    if (!tbody) return;

    var search = document.querySelector('[data-admin-search]');
    var searchTerm = search ? search.value.toLowerCase().trim() : '';
    
    var activeChip = document.querySelector('[data-admin-chips] .chip.is-active');
    var category = activeChip ? activeChip.dataset.chip : 'all';
    
    var filtered = products.filter(function(p) {
      var matchSearch = !searchTerm || 
        (p.name || '').toLowerCase().includes(searchTerm) ||
        (p.desc || '').toLowerCase().includes(searchTerm);
      var matchCategory = category === 'all' || p.category === category;
      return matchSearch && matchCategory;
    });
    
    if (count) count.textContent = products.length;
    
    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#6b7280;">No hay productos</td></tr>';
      return;
    }
    
    var html = '';
    filtered.forEach(function(p) {
      var iconHtml = p.icon ? getIcon(p.icon) : '📦';
      var categoryName = getCategoryName(p.category);
      var priceHtml = p.price ? '$' + p.price : 'Cotizar';
      
      html += `
        <tr>
          <td style="font-size:1.3rem;">${iconHtml}</td>
          <td><strong>${p.name}</strong></td>
          <td><span style="background:${getCategoryColor(p.category)};color:white;padding:2px 10px;border-radius:12px;font-size:0.75rem;">${categoryName}</span></td>
          <td>${priceHtml}</td>
          <td>
            <button class="btn btn-sm btn-ghost" data-edit="${p.id}">✏️</button>
            <button class="btn btn-sm btn-ghost" data-delete="${p.id}" style="color:#ef4444;">🗑️</button>
          </td>
        </tr>
      `;
    });
    
    tbody.innerHTML = html;
    
    document.querySelectorAll('[data-edit]').forEach(function(btn) {
      btn.addEventListener('click', function() { editProduct(this.dataset.edit); });
    });
    document.querySelectorAll('[data-delete]').forEach(function(btn) {
      btn.addEventListener('click', function() { deleteProduct(this.dataset.delete); });
    });
  }

  // ===== CATEGORÍAS =====
  function getCategoryName(id) {
    var map = {
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
    return map[id] || id || 'General';
  }

  function getCategoryColor(category) {
    var colors = {
      'ELECTRICOS': '#f59e0b',
      'PLOMERIA': '#3b82f6',
      'PINTURA': '#8b5cf6',
      'HERRAMIENTA': '#ef4444',
      'JARDINERIA': '#22c55e',
      'CERRAJERIA': '#f97316',
      'SEGURIDAD': '#6366f1',
      'ILUMINACION': '#0ea5e9',
      'FERRETERIA': '#6b7280'
    };
    return colors[category] || '#6b7280';
  }

  function getIcon(name) {
    var icons = {
      'toolbox': '🧰',
      'light': '💡',
      'paint': '🎨',
      'security': '🛡️',
      'key': '🔑',
      'pipe': '🔧',
      'valve': '⚙️'
    };
    return icons[name] || '📦';
  }

  // ===== CHIPS =====
  function renderChips() {
    var container = document.querySelector('[data-admin-chips]');
    if (!container) return;
    
    var products = getProducts();
    var categories = ['all'];
    products.forEach(function(p) {
      if (p.category && !categories.includes(p.category)) {
        categories.push(p.category);
      }
    });
    
    var html = '<button class="chip is-active" data-chip="all">Todos</button>';
    categories.forEach(function(cat) {
      if (cat === 'all') return;
      var name = getCategoryName(cat);
      html += `<button class="chip" data-chip="${cat}">${name}</button>`;
    });
    
    container.innerHTML = html;
    
    container.querySelectorAll('.chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        container.querySelectorAll('.chip').forEach(function(c) { c.classList.remove('is-active'); });
        this.classList.add('is-active');
        renderProducts(getProducts());
      });
    });
  }

  // ===== FORMULARIO =====
  var editingId = null;

  function setupForm() {
    var form = document.querySelector('[data-product-form]');
    var cancelBtn = document.querySelector('[data-cancel-edit]');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var name = document.getElementById('f-name').value.trim();
      var category = document.getElementById('f-category').value;
      var icon = document.getElementById('f-icon').value;
      var price = document.getElementById('f-price').value.trim();
      var unit = document.getElementById('f-unit').value.trim();
      var desc = document.getElementById('f-desc').value.trim();
      
      if (!name) { alert('El nombre es obligatorio'); return; }
      if (!category) { alert('Selecciona una categoría'); return; }
      
      var products = getProducts();
      
      if (editingId) {
        products = products.map(function(p) {
          if (p.id === editingId) {
            return { id: p.id, name: name, category: category, icon: icon, price: price, unit: unit, desc: desc };
          }
          return p;
        });
      } else {
        var newId = 'p-' + String(products.length + 1).padStart(4, '0');
        products.push({ id: newId, name: name, category: category, icon: icon, price: price, unit: unit, desc: desc });
      }
      
      saveProducts(products);
      resetForm();
      renderProducts(products);
      renderChips();
    });
    
    if (cancelBtn) { cancelBtn.addEventListener('click', resetForm); }
  }

  function editProduct(id) {
    var products = getProducts();
    var product = products.find(function(p) { return p.id === id; });
    if (!product) return;
    
    editingId = id;
    document.getElementById('f-name').value = product.name || '';
    document.getElementById('f-category').value = product.category || '';
    document.getElementById('f-icon').value = product.icon || '';
    document.getElementById('f-price').value = product.price || '';
    document.getElementById('f-unit').value = product.unit || '';
    document.getElementById('f-desc').value = product.desc || '';
    
    document.querySelector('[data-form-title]').textContent = 'Editar producto';
    document.querySelector('[data-submit-label]').textContent = 'Guardar cambios';
    document.querySelector('[data-cancel-edit]').style.display = 'inline-flex';
  }

  function resetForm() {
    editingId = null;
    document.querySelector('[data-product-form]').reset();
    document.querySelector('[data-form-title]').textContent = 'Agregar producto';
    document.querySelector('[data-submit-label]').textContent = 'Agregar producto';
    document.querySelector('[data-cancel-edit]').style.display = 'none';
  }

  function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    var products = getProducts().filter(function(p) { return p.id !== id; });
    saveProducts(products);
    renderProducts(products);
    renderChips();
  }

  // ===== FILTROS =====
  function setupFilters() {
    var search = document.querySelector('[data-admin-search]');
    if (search) {
      search.addEventListener('input', function() { renderProducts(getProducts()); });
    }
  }

  // ===== EXPORTAR =====
  function setupExport() {
    var btn = document.querySelector('[data-export-btn]');
    if (!btn) return;
    
    btn.addEventListener('click', function() {
      var products = getProducts();
      var content = '(function() {\n  "use strict";\n  window.__PRODUCTS__ = ' + 
        JSON.stringify(products, null, 2) + ';\n})();';
      
      var blob = new Blob([content], { type: 'application/javascript' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'products-data.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      var status = document.querySelector('[data-export-status]');
      if (status) {
        status.textContent = '✅ Descargado correctamente';
        status.style.color = '#22c55e';
      }
    });
  }

  // ===== RESET =====
  function setupReset() {
    var btn = document.querySelector('[data-reset-btn]');
    if (!btn) return;
    
    btn.addEventListener('click', function() {
      if (!confirm('¿Restablecer al catálogo original?')) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
      renderProducts(getProducts());
      renderChips();
    });
  }

  // ===== INICIAR =====
  document.addEventListener('DOMContentLoaded', function() {
    initAuth();
  });

})();
