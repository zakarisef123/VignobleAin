(function () {
  "use strict";

  var AGE_KEY = "contreforts-age-ok";

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* stockage indisponible */ }
  }

  // Vérification d'âge (obligatoire pour un site de vente d'alcool)
  var gate = document.querySelector(".age-gate");
  if (gate && storageGet(AGE_KEY) !== "1") {
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
