/* Показ шапки после прокрутки героя */

(function () {
  "use strict";

  const hero = document.querySelector(".hero");

  function updateHeaderVisibility() {
    const threshold = Math.max(0, hero.offsetTop + hero.offsetHeight - 120);
    document.body.classList.toggle("header-visible", window.scrollY >= threshold);
  }

  updateHeaderVisibility();
  window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
  window.addEventListener("resize", updateHeaderVisibility);
})();
