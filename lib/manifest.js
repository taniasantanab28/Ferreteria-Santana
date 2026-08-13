(function() {
  "use strict";

  // Configuración de categorías para el panel
  window.__BRAND__ = {
    categories: [
      { id: 'ELECTRICOS', name: 'Eléctricos' },
      { id: 'PLOMERIA', name: 'Plomería' },
      { id: 'PINTURA', name: 'Pintura' },
      { id: 'HERRAMIENTA', name: 'Herramienta' },
      { id: 'JARDINERIA', name: 'Jardinería' },
      { id: 'CERRAJERIA', name: 'Cerrajería' },
      { id: 'SEGURIDAD', name: 'Seguridad' },
      { id: 'ILUMINACION', name: 'Iluminación' },
      { id: 'FERRETERIA', name: 'Ferretería general' }
    ]
  };

  // Funciones auxiliares
  window.__SITE__ = {
    escHTML: function(str) {
      if (!str) return '';
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    },
    categoryName: function(id) {
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
  };

})();
