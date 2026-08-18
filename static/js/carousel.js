/* Горизонтальная карусель кейсов */

(function () {
  "use strict";

  const casesWrap = document.querySelector(".cases-wrap");
  const casesCarousel = document.querySelector(".cases");
  const carouselPrev = document.querySelector(".carousel-button-prev");
  const carouselNext = document.querySelector(".carousel-button-next");

  function updateCarouselButtons() {
    if (!casesCarousel) return;

    const maxScroll = casesCarousel.scrollWidth - casesCarousel.clientWidth;
    const isScrollable = maxScroll > 4;
    const isAtEnd = casesCarousel.scrollLeft >= maxScroll - 4;

    carouselPrev.classList.toggle("is-visible", isScrollable && isAtEnd);
    carouselNext.classList.toggle("is-visible", isScrollable && !isAtEnd);
  }

  if (casesWrap && casesCarousel && carouselPrev && carouselNext) {
    carouselNext.addEventListener("click", () => {
      window.captureAnalytics("portfolio_carousel_navigated", { direction: "forward" });
      casesCarousel.scrollTo({ left: casesCarousel.scrollWidth, behavior: "smooth" });
    });

    carouselPrev.addEventListener("click", () => {
      window.captureAnalytics("portfolio_carousel_navigated", { direction: "back" });
      casesCarousel.scrollTo({ left: 0, behavior: "smooth" });
    });

    casesCarousel.addEventListener("scroll", updateCarouselButtons, { passive: true });
    window.addEventListener("resize", updateCarouselButtons);
    updateCarouselButtons();
  }
})();
