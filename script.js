// IVAÍ RESIDENCE — interações do site

document.addEventListener("DOMContentLoaded", function () {

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

  if (exitPopup) {
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY < 10) {
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
});
