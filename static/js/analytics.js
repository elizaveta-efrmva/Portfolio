/* PostHog + Яндекс.Метрика; отдаёт window.captureAnalytics */

(function () {
  "use strict";

  function captureAnalytics(eventName, properties = {}) {
    window.posthog?.capture(eventName, properties);

    if (window.__YANDEX_METRIKA_ID__ && typeof window.ym === "function") {
      const goalProperties = Object.fromEntries(
        Object.entries(properties).filter(([, value]) => value !== undefined && value !== null),
      );
      window.ym(window.__YANDEX_METRIKA_ID__, "reachGoal", eventName, goalProperties);
    }
  }

  window.captureAnalytics = captureAnalytics;

  document.querySelectorAll("[data-analytics-event]").forEach((element) => {
    element.addEventListener("click", () => {
      captureAnalytics(element.dataset.analyticsEvent, {
        placement: element.dataset.analyticsPlacement,
        label: element.textContent.trim(),
      });
    });
  });

  document.querySelectorAll(".faq-list details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (details.open) {
        captureAnalytics("faq_opened", {
          question: details.querySelector("summary")?.textContent?.trim(),
        });
      }
    });
  });
})();
