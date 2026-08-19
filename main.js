(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  var escHTML = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  /* -----------------------------------------------------------
     Icon library — line icons, inherit currentColor via CSS
  ----------------------------------------------------------- */
  var ICONS = {
    pipe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H7"/><circle cx="4" cy="8" r="2"/><circle cx="7" cy="14" r="2"/></svg>',
    sprinkler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M8 13a4 4 0 0 1 8 0"/><path d="M12 2v3"/><path d="M5 6l2 2"/><path d="M19 6l-2 2"/><path d="M3 11h3"/><path d="M18 11h3"/></svg>',
    valve: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M4 12h4"/><path d="M16 12h4"/><path d="M12 4v3"/><path d="M12 17v3"/></svg>',
    faucet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8V6a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v2"/><path d="M17 8H6a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h11"/><path d="M17 12v3a2 2 0 0 1-2 2h-1"/><path d="M12 21v-4"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2-2Z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 13h6l-1 9 9-13h-6l1-7Z"/></svg>',
    elbow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v9a5 5 0 0 0 5 5h7"/><circle cx="6" cy="4" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    drain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h8"/></svg>',
    hose: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4a5 5 0 0 0 5 5h6a5 5 0 0 1 5 5v6"/><circle cx="4" cy="4" r="2"/></svg>',
    timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/></svg>',
    tee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v9"/><path d="M4 12h16"/><path d="M12 12v9"/></svg>',
    tank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8c0-2.5 2.7-4.5 6-4.5S18 5.5 18 8v8c0 2.5-2.7 4.5-6 4.5S6 18.5 6 16Z"/><path d="M6 8h12"/></svg>',
    badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M9 14.5 7 22l5-3 5 3-2-7.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 1 1-3.3-6.5"/><path d="M21 3v6h-6"/></svg>',
    boxes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l6-4 6 4-6 4-6-4Z"/><path d="M3 8v8l6 4 6-4V8"/><path d="M15 8l6 4v8l-6-4"/><path d="M15 8l-6 4"/></svg>',
    quote: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7c-2 1.5-3 3.6-3 6.2 0 2.9 1.9 4.8 4.3 4.8 2 0 3.5-1.5 3.5-3.4 0-1.8-1.3-3.2-3-3.2-.3 0-.6 0-.8.1C8.2 9.3 9.7 7.9 12 7l-1-1.3C9.6 6.1 8 6.6 7 7Zm10 0c-2 1.5-3 3.6-3 6.2 0 2.9 1.9 4.8 4.3 4.8 2 0 3.5-1.5 3.5-3.4 0-1.8-1.3-3.2-3-3.2-.3 0-.6 0-.8.1 0-1.2 1.5-2.6 3.8-3.5l-1-1.3C18.6 6.1 17 6.6 17 7Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.3a16 16 0 0 0 6 6l1.5-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.6-1.5-.9-2c-.2-.5-.5-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.2.1 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.2h-3V7.7c0-.9.3-1.6 1.6-1.6h1.6V3.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.7H7.9V13h2.7v8h2.9Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>'
  };
  function icon(name) { return ICONS[name] || ICONS.boxes; }

  /* -----------------------------------------------------------
     Products: merge default catalog with any local admin edits
  ----------------------------------------------------------- */
  function getProducts() {
    var base = (window.__PRODUCTS__ || []).slice();
    try {
      var raw = window.localStorage.getItem("santana_products_v1");
      if (raw) {
        var stored = JSON.parse(raw);
        if (Array.isArray(stored)) return stored;
      }
    } catch (e) { /* localStorage unavailable */ }
    return base;
  }

  var CATEGORY_STORAGE_KEY = "santana_categories_v1";

  function getCategories() {
    try {
      var raw = window.localStorage.getItem(CATEGORY_STORAGE_KEY);
      if (raw) {
        var stored = JSON.parse(raw);
        if (Array.isArray(stored)) return stored;
      }
    } catch (e) { /* localStorage unavailable */ }
    return (data.categories || []).slice();
  }

  function categoryName(id) {
    var cats = getCategories();
    for (var i = 0; i < cats.length; i++) if (cats[i].id === id) return cats[i].name;
    return id;
  }

  /* -----------------------------------------------------------
     Mounts (idempotent)
  ----------------------------------------------------------- */
  function mountNav() {
    var linksTarget = $("[data-nav-links]");
    var mobileTarget = $("[data-nav-mobile]");
    if (linksTarget && linksTarget.children.length === 0 && data.nav) {
      linksTarget.innerHTML = data.nav.map(function (l) {
        return '<a href="' + escHTML(l.href) + '">' + escHTML(l.label) + "</a>";
      }).join("");
    }
    if (mobileTarget && mobileTarget.children.length === 0 && data.nav) {
      mobileTarget.innerHTML = data.nav.map(function (l) {
        return '<a href="' + escHTML(l.href) + '">' + escHTML(l.label) + "</a>";
      }).join("") + '<a class="btn btn-accent btn-block" href="contacto.html">Contáctanos</a>';
    }
  }

  function mountBrandText() {
    $$("[data-brand-name]").forEach(function (el) { if (!el.dataset.filled) { el.textContent = data.name || ""; el.dataset.filled = "1"; } });
    $$("[data-brand-phone]").forEach(function (el) { if (!el.dataset.filled) { el.textContent = data.contact.phoneDisplay || ""; el.dataset.filled = "1"; } });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function mountCategories() {
    var target = $("[data-categories]");
    if (!target || target.children.length > 0) return;
    var cats = getCategories();
    if (!cats.length) return;
    target.innerHTML = cats.map(function (c) {
      return (
        '<article class="cat-card reveal">' +
          '<div class="ico-wrap">' + icon(c.icon) + "</div>" +
          "<h3>" + escHTML(c.name) + "</h3>" +
          "<p>" + escHTML(c.desc) + "</p>" +
          '<a class="cat-link" href="tienda.html?cat=' + encodeURIComponent(c.id) + '">Ver productos ' + icon("arrow") + "</a>" +
        "</article>"
      );
    }).join("");
  }

  function mountPillars() {
    var target = $("[data-pillars]");
    if (!target || target.children.length > 0 || !data.pillars) return;
    target.innerHTML = data.pillars.map(function (p) {
      return (
        '<article class="pillar-card reveal">' +
          '<div class="ico-wrap">' + icon(p.icon) + "</div>" +
          "<h3>" + escHTML(p.title) + "</h3>" +
          "<p>" + escHTML(p.desc) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function mountTestimonials() {
    var target = $("[data-testimonials]");
    if (!target || target.children.length > 0 || !data.testimonials) return;
    target.innerHTML = data.testimonials.map(function (t) {
      return (
        '<article class="testi-card reveal">' +
          icon("quote") +
          '<p class="quote">' + escHTML(t.quote) + "</p>" +
          '<p class="testi-author">' + escHTML(t.author) + "</p>" +
          '<p class="testi-role">' + escHTML(t.role) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function mountHeroStats() {
    var target = $("[data-hero-stats]");
    if (!target || target.children.length > 0 || !data.stats) return;
    target.innerHTML = data.stats.map(function (s) {
      return (
        '<div class="hero-stat">' +
          '<strong data-count-to="' + s.value + '">0' + s.suffix + "</strong>" +
          "<span>" + escHTML(s.label) + "</span>" +
        "</div>"
      );
    }).join("");
  }

  function mountFeatured() {
    var target = $("[data-featured]");
    if (!target || target.children.length > 0) return;
    var items = getProducts().slice(0, 8);
    target.innerHTML = items.map(productCardHTML).join("");
  }

  function productCardHTML(p) {
    var price = p.price ? ('<span class="product-price">$' + escHTML(p.price) + "</span>") : ('<span class="product-price">Cotizar</span>');
    var waMsg = encodeURIComponent("Hola, me interesa: " + p.name + ". ¿Tienen disponibilidad?");
    return (
      '<article class="product-card reveal" data-cat="' + escHTML(p.category) + '" data-name="' + escHTML((p.name || "").toLowerCase()) + '">' +
        '<div class="product-media"><span class="product-cat-tag">' + escHTML(categoryName(p.category)) + "</span>" + icon(p.icon) + "</div>" +
        '<div class="product-body">' +
          "<h3>" + escHTML(p.name) + "</h3>" +
          "<p>" + escHTML(p.desc || "") + "</p>" +
          '<div class="product-meta">' + price + '<span class="product-unit">' + escHTML(p.unit || "") + "</span></div>" +
          '<a class="btn btn-primary btn-sm btn-block" target="_blank" rel="noopener" href="https://wa.me/' + escHTML(data.contact.whatsapp) + "?text=" + waMsg + '">' + icon("whatsapp") + " Pedir por WhatsApp</a>" +
        "</div>" +
      "</article>"
    );
  }

  function mountShopGrid() {
    var target = $("[data-shop-grid]");
    if (!target) return;
    var all = getProducts();
    target.dataset.all = "1";
    target.innerHTML = all.map(productCardHTML).join("");
    initShopFilters(all);
  }

  function mountShopChips() {
    var target = $("[data-shop-chips]");
    if (!target || target.children.length > 0) return;
    var cats = getCategories();
    if (!cats.length) return;
    var html = '<button class="chip is-active" data-chip="all" type="button">Todos</button>';
    html += cats.map(function (c) {
      return '<button class="chip" data-chip="' + escHTML(c.id) + '" type="button">' + escHTML(c.name) + "</button>";
    }).join("");
    target.innerHTML = html;
  }

  function initShopFilters() {
    var chips = $("[data-shop-chips]");
    var search = $("[data-shop-search]");
    var grid = $("[data-shop-grid]");
    var empty = $("[data-shop-empty]");
    if (!grid) return;

    var params = new URLSearchParams(location.search);
    var initialCat = params.get("cat");
    if (initialCat && chips) {
      var btn = chips.querySelector('[data-chip="' + initialCat + '"]');
      if (btn) {
        $$(".chip.is-active", chips).forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
      }
    }

    function apply() {
      var activeChip = chips ? chips.querySelector(".chip.is-active") : null;
      var cat = activeChip ? activeChip.dataset.chip : "all";
      var q = search ? search.value.trim().toLowerCase() : "";
      var visibleCount = 0;
      $$(".product-card", grid).forEach(function (card) {
        var matchCat = cat === "all" || card.dataset.cat === cat;
        var matchQ = !q || card.dataset.name.indexOf(q) !== -1;
        var show = matchCat && matchQ;
        card.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });
      if (empty) empty.style.display = visibleCount === 0 ? "block" : "none";
    }

    if (chips) {
      chips.addEventListener("click", function (e) {
        var b = e.target.closest(".chip");
        if (!b) return;
        $$(".chip", chips).forEach(function (c) { c.classList.remove("is-active"); });
        b.classList.add("is-active");
        apply();
      });
    }
    if (search) search.addEventListener("input", apply);
    apply();
  }

  /* -----------------------------------------------------------
     Nav interactions
  ----------------------------------------------------------- */
  function initNav() {
    var burger = $("[data-nav-burger]");
    var mobile = $("[data-nav-mobile]");
    if (burger && mobile) {
      burger.addEventListener("click", function () {
        mobile.classList.toggle("is-open");
      });
    }
    var path = location.pathname.split("/").pop() || "index.html";
    $$(".nav-links a, .nav-mobile a").forEach(function (a) {
      var href = a.getAttribute("href").split("#")[0];
      if (href === path || (path === "" && href === "index.html")) a.classList.add("is-active");
    });
  }

  /* -----------------------------------------------------------
     Reveal on scroll
  ----------------------------------------------------------- */
  function initReveals() {
    var els = $$(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      $$(".reveal:not(.is-visible)").forEach(function (el) { el.classList.add("is-visible"); });
    }, 6000);
  }

  function bindDynamicReveals() {
    // newly mounted content also needs .reveal handling — re-run reveal init
    initReveals();
  }

  /* -----------------------------------------------------------
     Count-up stats
  ----------------------------------------------------------- */
  function initCountUp() {
    var els = $$("[data-count-to]");
    if (!els.length) return;
    var done = false;
    function run() {
      if (done) return;
      done = true;
      els.forEach(function (el) {
        var target = parseInt(el.dataset.countTo, 10) || 0;
        var suffix = (el.textContent.match(/[a-zA-Z%+]+$/) || [""])[0];
        var startTime = null;
        var duration = reduced ? 1 : 1200;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var val = Math.floor(progress * target);
          el.textContent = val + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
      });
    }
    var host = els[0].closest("section") || document.body;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: 0.2 });
      io.observe(host);
    } else {
      run();
    }
  }

  /* -----------------------------------------------------------
     Tilt on hero icon cards (fine pointers only)
  ----------------------------------------------------------- */
  function initTilt() {
    if (!fineHover) return;
    $$("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "rotate3d(" + (-y) + "," + x + ",0,7deg)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* -----------------------------------------------------------
     Contact form -> WhatsApp / mailto handoff (no backend)
  ----------------------------------------------------------- */
  function initContactForm() {
    var form = $("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var name = $("#cf-name", form).value.trim();
      var phone = $("#cf-phone", form).value.trim();
      var subject = $("#cf-subject", form).value;
      var message = $("#cf-message", form).value.trim();
      var text = "Hola, soy " + name + " (" + phone + "). Asunto: " + subject + ". " + message;
      var method = form.querySelector('input[name="send-method"]:checked');
      if (method && method.value === "email") {
        window.location.href = "mailto:" + data.contact.email + "?subject=" + encodeURIComponent("Contacto web - " + subject) + "&body=" + encodeURIComponent(text);
      } else {
        window.open("https://wa.me/" + data.contact.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      }
    });
  }

  /* -----------------------------------------------------------
     Fill contact info blocks
  ----------------------------------------------------------- */
  function mountContactInfo() {
    var target = $("[data-contact-info]");
    if (!target || target.children.length > 0) return;
    var c = data.contact;
    var hoursHTML = (c.hours || []).map(function (h) {
      return "<div>" + escHTML(h.day) + ": <strong>" + escHTML(h.time) + "</strong></div>";
    }).join("");
    target.innerHTML =
      '<div class="info-row"><div class="ico-wrap">' + icon("phone") + '</div><div><strong>Teléfono / WhatsApp</strong><br><a href="tel:' + escHTML(c.phone) + '">' + escHTML(c.phoneDisplay) + "</a></div></div>" +
      '<div class="info-row"><div class="ico-wrap">' + icon("mail") + '</div><div><strong>Correo</strong><br><a href="mailto:' + escHTML(c.email) + '">' + escHTML(c.email) + "</a></div></div>" +
      '<div class="info-row"><div class="ico-wrap">' + icon("pin") + '</div><div><strong>Dirección</strong><br><span>' + escHTML(c.address) + ", " + escHTML(c.city) + "</span></div></div>" +
      '<div class="info-row"><div class="ico-wrap">' + icon("clock") + '</div><div><strong>Horario</strong><br><span>' + hoursHTML + "</span></div></div>";
  }

  function mountMap() {
    var target = $("[data-map]");
    if (!target || target.dataset.filled) return;
    target.dataset.filled = "1";
    target.innerHTML = '<iframe src="' + escHTML(data.contact.mapsEmbed) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Ubicación"></iframe>';
  }

  function mountFooter() {
    var target = $("[data-footer-content]");
    if (!target || target.dataset.filled) return;
    target.dataset.filled = "1";
    target.innerHTML =
      '<div>' +
        '<div class="brand"><div class="brand-mark">' + icon("pipe") + '</div><div><span>' + escHTML(data.name) + "</span><small>" + escHTML(data.tagline) + "</small></div></div>" +
        '<p class="desc">' + escHTML(data.subtagline) + "</p>" +
        '<div class="footer-social">' +
          '<a href="' + escHTML(data.social.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + icon("facebook") + "</a>" +
          '<a href="' + escHTML(data.social.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + icon("instagram") + "</a>" +
        "</div>" +
      "</div>" +
      '<div><h4>Navegación</h4><div class="footer-links">' +
        (data.nav || []).map(function (l) { return '<a href="' + escHTML(l.href) + '">' + escHTML(l.label) + "</a>"; }).join("") +
      "</div></div>" +
      '<div><h4>Contacto</h4><div class="footer-links">' +
        '<a href="tel:' + escHTML(data.contact.phone) + '">' + escHTML(data.contact.phoneDisplay) + "</a>" +
        '<a href="mailto:' + escHTML(data.contact.email) + '">' + escHTML(data.contact.email) + "</a>" +
        "<a>" + escHTML(data.contact.address) + ", " + escHTML(data.contact.city) + "</a>" +
      "</div></div>";
  }

  function mountWaFloat() {
    var target = $("[data-wa-float]");
    if (!target || target.dataset.filled) return;
    target.dataset.filled = "1";
    var msg = encodeURIComponent("Hola, tengo una pregunta sobre sus productos.");
    target.innerHTML = '<a class="wa-float" href="https://wa.me/' + escHTML(data.contact.whatsapp) + "?text=" + msg + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon("whatsapp") + "</a>";
  }

  /* -----------------------------------------------------------
     View transitions between pages (progressive enhancement)
  ----------------------------------------------------------- */
  function initViewTransitions() {
    if (!document.startViewTransition) return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href]');
      if (!a) return;
      var url;
      try { url = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (!/\.html$/.test(url.pathname) && url.pathname !== "/") return;
      e.preventDefault();
      document.startViewTransition(function () { location.href = a.href; });
    });
  }

  /* -----------------------------------------------------------
     Boot
  ----------------------------------------------------------- */
  function boot() {
    safe(mountNav, "mountNav");
    safe(mountBrandText, "mountBrandText");
    safe(mountCategories, "mountCategories");
    safe(mountPillars, "mountPillars");
    safe(mountTestimonials, "mountTestimonials");
    safe(mountHeroStats, "mountHeroStats");
    safe(mountFeatured, "mountFeatured");
    safe(mountShopChips, "mountShopChips");
    safe(mountShopGrid, "mountShopGrid");
    safe(mountContactInfo, "mountContactInfo");
    safe(mountMap, "mountMap");
    safe(mountFooter, "mountFooter");
    safe(mountWaFloat, "mountWaFloat");
    safe(initNav, "initNav");
    safe(initContactForm, "initContactForm");
    safe(bindDynamicReveals, "bindDynamicReveals");
    safe(initCountUp, "initCountUp");
    safe(initTilt, "initTilt");
    safe(initViewTransitions, "initViewTransitions");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Expose a couple of helpers for admin.js to reuse
  window.__SITE__ = { icon: icon, escHTML: escHTML, getProducts: getProducts, productCardHTML: productCardHTML, categoryName: categoryName, getCategories: getCategories };
})();
