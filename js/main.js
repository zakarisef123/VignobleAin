(function () {
  "use strict";

  var AGE_KEY = "domaine-age-ok";

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* stockage indisponible */ }
  }

  var root = document.documentElement;
  var intro = document.querySelector(".intro");
  var introOn = !!intro && root.classList.contains("show-intro");

  // Animation d'ouverture : la vérification d'âge se fait à la fin de l'intro
  if (introOn) {
    try { window.sessionStorage.setItem("intro-vue", "1"); } catch (e) { /* stockage indisponible */ }
    var scene = intro.querySelector(".intro__scene");
    if (window.innerWidth < window.innerHeight) scene.setAttribute("viewBox", "370 90 820 790");
    var done = false;
    var timer = setTimeout(finishIntro, 6900);

    function revealSite() {
      var glass = intro.querySelector(".ib-glass").getBoundingClientRect();
      intro.style.setProperty("--rx", (glass.left + glass.width / 2) + "px");
      intro.style.setProperty("--ry", (glass.top + glass.height / 2) + "px");
      intro.classList.remove("intro--age");
      intro.classList.add("is-revealing");
      setTimeout(function () {
        root.classList.remove("show-intro");
        document.dispatchEvent(new Event("intro:done"));
      }, 1250);
    }
    function finishIntro() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      // « Passer » : on saute directement au tableau final
      intro.getAnimations({ subtree: true }).forEach(function (anim) {
        if (isFinite(anim.effect.getComputedTiming().endTime)) anim.finish();
      });
      if (storageGet(AGE_KEY) === "1") { revealSite(); return; }
      intro.classList.add("intro--age");
      intro.querySelector("[data-intro-yes]").focus({ preventScroll: true });
    }
    intro.querySelector(".intro__skip").addEventListener("click", finishIntro);
    intro.querySelector("[data-intro-yes]").addEventListener("click", function () {
      storageSet(AGE_KEY, "1");
      revealSite();
    });
    intro.querySelector("[data-intro-no]").addEventListener("click", function () {
      window.location.href = "https://www.google.fr";
    });
  }

  // Vérification d'âge (obligatoire pour un site de vente d'alcool)
  var gate = document.querySelector(".age-gate");
  if (gate && !introOn && storageGet(AGE_KEY) !== "1") {
    gate.classList.add("is-open");
    gate.querySelector("[data-age-yes]").addEventListener("click", function () {
      storageSet(AGE_KEY, "1");
      gate.classList.remove("is-open");
    });
    gate.querySelector("[data-age-no]").addEventListener("click", function () {
      window.location.href = "https://www.google.fr";
    });
  }

  // En-tête : ombre au défilement
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Effet « lever de rideau » sur les photos, lancé après l'intro
  function watchCurtains() {
    var curtains = document.querySelectorAll(".visual, .gallery figure");
    if (!("IntersectionObserver" in window)) {
      curtains.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    curtains.forEach(function (el) { co.observe(el); });
  }
  if (introOn) document.addEventListener("intro:done", watchCurtains, { once: true });
  else watchCurtains();

  // Apparition au défilement
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Filtres de la page Vins
  var filters = document.querySelectorAll(".filter");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var type = btn.getAttribute("data-filter");
      btn.parentNode.querySelectorAll(".filter").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      btn.closest(".container").querySelectorAll("[data-type]").forEach(function (item) {
        item.hidden = type !== "all" && item.getAttribute("data-type") !== type;
      });
    });
  });

  // Galerie : visionneuse
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var inner = lightbox.querySelector(".lightbox__inner");
    function close() { lightbox.classList.remove("is-open"); inner.innerHTML = ""; }
    document.querySelectorAll(".gallery figure").forEach(function (fig) {
      fig.addEventListener("click", function () {
        var media = fig.querySelector("img, svg");
        if (!media) return;
        inner.innerHTML = "";
        inner.appendChild(media.cloneNode(true));
        lightbox.classList.add("is-open");
      });
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lightbox__close")) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  // Formulaire de contact : ouvre la messagerie avec le message prérempli
  var form = document.querySelector("#contact-form");
  if (form) {
    // Préremplissage depuis les liens « Réserver » et « Commander »
    var params = new URLSearchParams(window.location.search);
    var activite = params.get("activite");
    var sujet = form.querySelector("#sujet");
    var message = form.querySelector("#message");
    if (activite) {
      sujet.value = activite === "Bon cadeau" ? "Bon cadeau" : "Réserver une activité";
      message.value = "Activité souhaitée : " + activite + "\nDate(s) souhaitée(s) : \nNombre de personnes : \n";
    } else if (params.get("sujet") === "commande") {
      sujet.value = "Commander du vin";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subject = "[Site] " + (data.get("sujet") || "Demande") + " — " + (data.get("nom") || "");
      var body = [
        "Nom : " + (data.get("nom") || ""),
        "E-mail : " + (data.get("email") || ""),
        "Téléphone : " + (data.get("tel") || ""),
        "",
        data.get("message") || ""
      ].join("\n");
      window.location.href = "mailto:" + form.getAttribute("data-to") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      var note = form.querySelector(".form-note");
      if (note) note.hidden = false;
    });
  }

  // Année du copyright
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
