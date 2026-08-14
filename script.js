// IVAÍ RESIDENCE — interações do site

function initIvaiResidence() {

  // Menu mobile -------------------------------------------------------
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // FAQ accordion -------------------------------------------------------
  document.querySelectorAll(".faq-item").forEach(function (item) {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", function () {
      const alreadyOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (open) {
        open.classList.remove("open");
      });
      if (!alreadyOpen) item.classList.add("open");
    });
  });

  // Pop-up de saída -------------------------------------------------------
  const exitPopup = document.getElementById("exitPopup");
  const exitClose = document.getElementById("exitClose");
  const STORAGE_KEY = "ivai_exit_popup_shown";

  function showExitPopup() {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    exitPopup.hidden = false;
    sessionStorage.setItem(STORAGE_KEY, "1");
  }
  function hideExitPopup() {
    exitPopup.hidden = true;
  }

  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (exitPopup && isFinePointer) {
    let armed = false;
    setTimeout(function () { armed = true; }, 4000);

    document.documentElement.addEventListener("mouseleave", function (e) {
      if (armed && e.clientY <= 0) {
        showExitPopup();
      }
    });
    exitClose.addEventListener("click", hideExitPopup);
    exitPopup.addEventListener("click", function (e) {
      if (e.target === exitPopup) hideExitPopup();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideExitPopup();
    });
  }

  // Movimento sutil ao rolar a página --------------------------------------
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    // Agrupa elementos que devem entrar em sequência, com atraso crescente
    document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
      Array.from(group.children).forEach(function (child, i) {
        if (!child.classList.contains("reveal") && !child.classList.contains("reveal-scale")) {
          child.classList.add("reveal");
        }
        child.style.transitionDelay = Math.min(i * 90, 360) + "ms";
      });
    });

    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll(".reveal, .reveal-scale").forEach(function (el) {
      revealObserver.observe(el);
    });

    // Contagem numérica nos números-chave (40%, 400 m², 100%...)
    function animateCount(el) {
      const target = parseFloat(el.dataset.countTo);
      const prefix = el.dataset.countPrefix || "";
      const suffix = el.dataset.countSuffix || "";
      const duration = 1300;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll("[data-count-to]").forEach(function (el) {
      countObserver.observe(el);
    });

    // Parallax bem sutil: fundo do hero (mobile + desktop) e imagem de
    // localização (só desktop, coluna estreita no mobile não pede o efeito)
    const heroBg = document.querySelector("[data-parallax-bg]");
    const parallaxImg = document.querySelector("[data-parallax]");
    const parallaxImgActive = !!(parallaxImg && window.innerWidth > 900);

    if (heroBg || parallaxImgActive) {
      let ticking = false;
      function updateParallax() {
        if (heroBg) {
          const heroOffset = window.scrollY * 0.12;
          heroBg.style.transform = "translateY(" + heroOffset.toFixed(1) + "px)";
        }
        if (parallaxImgActive) {
          const rect = parallaxImg.getBoundingClientRect();
          const vh = window.innerHeight;
          const distanceFromCenter = (rect.top + rect.height / 2 - vh / 2) / vh;
          const offset = distanceFromCenter * 24;
          parallaxImg.style.transform = "translateY(" + offset.toFixed(1) + "px) scale(1.08)";
        }
        ticking = false;
      }
      window.addEventListener("scroll", function () {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }, { passive: true });
      updateParallax();
    }
  } else {
    // Sem suporte a observer, ou movimento reduzido: garante que tudo apareça
    document.querySelectorAll(".reveal, .reveal-scale").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIvaiResidence);
} else {
  initIvaiResidence();
}
