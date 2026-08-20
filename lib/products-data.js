(function () {
  "use strict";

  window.__PRODUCTS__ = [
    // ===== TUBERÍA Y DRENAJE (id: tuberia) =====
    {
      id: "p-0001",
      name: "Tubo PVC sanitario 4\" x 3m",
      category: "tuberia",
      icon: "pipe",
      price: "380.00",
      unit: "tramo 3m",
      desc: "Tubo de PVC para drenaje sanitario, cédula 40."
    },
    {
      id: "p-0002",
      name: "Tubo PVC sanitario 6\" x 3m",
      category: "tuberia",
      icon: "pipe",
      price: "620.00",
      unit: "tramo 3m",
      desc: "Tubo de PVC para drenaje sanitario y pluvial."
    },
    {
      id: "p-0003",
      name: "Tubo PVC pluvial 10\" x 3m",
      category: "tuberia",
      icon: "pipe",
      price: "1250.00",
      unit: "tramo 3m",
      desc: "Tubo de PVC para drenaje pluvial, alta resistencia."
    },

    // ===== FITTINGS Y CONEXIONES (id: fittings) =====
    {
      id: "p-0004",
      name: "Codo PVC 4\" 90°",
      category: "fittings",
      icon: "elbow",
      price: "85.00",
      unit: "pieza",
      desc: "Codo de PVC para drenaje, 90 grados."
    },
    {
      id: "p-0005",
      name: "Tee PVC 4\"",
      category: "fittings",
      icon: "tee",
      price: "120.00",
      unit: "pieza",
      desc: "Tee de PVC para derivaciones en drenaje."
    },
    {
      id: "p-0006",
      name: "Reducción PVC 4\" a 3\"",
      category: "fittings",
      icon: "pipe",
      price: "65.00",
      unit: "pieza",
      desc: "Reducción concéntrica de PVC."
    },
    {
      id: "p-0007",
      name: "Codo CPVC 1/2\" 90°",
      category: "fittings",
      icon: "elbow",
      price: "28.00",
      unit: "pieza",
      desc: "Codo de CPVC para agua caliente y fría."
    },
    {
      id: "p-0008",
      name: "Tee CPVC 1/2\"",
      category: "fittings",
      icon: "tee",
      price: "32.00",
      unit: "pieza",
      desc: "Tee de CPVC para instalación hidrosanitaria."
    },

    // ===== VÁLVULAS Y FILTROS (id: valvulas) =====
    {
      id: "p-0009",
      name: "Válvula de esfera 1\" roscada",
      category: "valvulas",
      icon: "valve",
      price: "185.00",
      unit: "pieza",
      desc: "Válvula de paso de bronce, maneral de palanca."
    },
    {
      id: "p-0010",
      name: "Válvula check 1\"",
      category: "valvulas",
      icon: "valve",
      price: "220.00",
      unit: "pieza",
      desc: "Válvula de retención para evitar flujo inverso."
    },
    {
      id: "p-0011",
      name: "Válvula compuerta 2\"",
      category: "valvulas",
      icon: "valve",
      price: "450.00",
      unit: "pieza",
      desc: "Válvula de compuerta de bronce."
    },
    {
      id: "p-0012",
      name: "Llave de paso 1/2\"",
      category: "valvulas",
      icon: "faucet",
      price: "95.00",
      unit: "pieza",
      desc: "Llave de paso angosta para salida de agua."
    },

    // ===== INFRAESTRUCTURA Y ALCANTARILLADO (id: alcantarillado) =====
    {
      id: "p-0013",
      name: "Tubo concreto reforzado 12\"",
      category: "alcantarillado",
      icon: "pipe",
      price: "2800.00",
      unit: "tramo 2m",
      desc: "Tubo de concreto reforzado para alcantarillado."
    },
    {
      id: "p-0014",
      name: "Tubo concreto reforzado 18\"",
      category: "alcantarillado",
      icon: "pipe",
      price: "4200.00",
      unit: "tramo 2m",
      desc: "Tubo de concreto reforzado para alcantarillado pluvial."
    },
    {
      id: "p-0015",
      name: "Tubo concreto reforzado 24\"",
      category: "alcantarillado",
      icon: "pipe",
      price: "5800.00",
      unit: "tramo 2m",
      desc: "Tubo de concreto reforzado para infraestructura mayor."
    },

    // ===== SISTEMAS DE RIEGO (id: riego) =====
    {
      id: "p-0016",
      name: "Aspersor rotatorio 360°",
      category: "riego",
      icon: "sprinkler",
      price: "285.00",
      unit: "pieza",
      desc: "Aspersor de impacto, alcance 8-12 metros."
    },
    {
      id: "p-0017",
      name: "Aspersor estático 180°",
      category: "riego",
      icon: "sprinkler",
      price: "195.00",
      unit: "pieza",
      desc: "Aspersor de rociado fijo para áreas pequeñas."
    },
    {
      id: "p-0018",
      name: "Cinta de goteo 16mm x 100m",
      category: "riego",
      icon: "hose",
      price: "450.00",
      unit: "rollo",
      desc: "Cinta de riego por goteo, emisores a 20cm."
    },
    {
      id: "p-0019",
      name: "Programador de riego digital",
      category: "riego",
      icon: "timer",
      price: "890.00",
      unit: "pieza",
      desc: "Programador para 2 zonas con pantalla LCD."
    },

    // ===== TOMAS Y REPARACIÓN (id: reparacion) =====
    {
      id: "p-0020",
      name: "Llave stillson 14\"",
      category: "reparacion",
      icon: "wrench",
      price: "320.00",
      unit: "pieza",
      desc: "Llave de tubo ajustable, gran diámetro."
    },
    {
      id: "p-0021",
      name: "Corta tubo PVC 1\" a 4\"",
      category: "reparacion",
      icon: "wrench",
      price: "650.00",
      unit: "pieza",
      desc: "Cortador de tubo PVC con cuchilla de acero."
    },
    {
      id: "p-0022",
      name: "Nivel de burbuja 120cm",
      category: "reparacion",
      icon: "wrench",
      price: "180.00",
      unit: "pieza",
      desc: "Nivel de aluminio con 3 burbujas."
    },
    {
      id: "p-0023",
      name: "Cinta métrica 5m",
      category: "reparacion",
      icon: "wrench",
      price: "85.00",
      unit: "pieza",
      desc: "Cinta métrica de acero con bloqueo."
    }
  ];
})();
