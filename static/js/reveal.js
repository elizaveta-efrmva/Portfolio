/* Появление блоков по скроллу (.fade-in) */

(function () {
  "use strict";

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));
})();
