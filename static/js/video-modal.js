/* Открытие кейса в модальном окне */

(function () {
  "use strict";

  const dialog = document.querySelector("#videoDialog");
  const dialogVideo = document.querySelector("#dialogVideo");
  const dialogTitle = document.querySelector("#dialogTitle");
  const closeButton = document.querySelector(".dialog-close");

  document.querySelectorAll(".case-button").forEach((button) => {
    button.addEventListener("click", () => {
      const caseItem = button.closest(".case-item");
      const caseDescription = caseItem?.querySelector(".case-description")?.textContent?.trim();

      dialogTitle.textContent = caseDescription || button.dataset.title || "Видео";
      window.captureAnalytics("portfolio_reel_opened", {
        title: dialogTitle.textContent,
        video: button.dataset.video,
      });
      dialogVideo.innerHTML = "";
      const source = document.createElement("source");
      source.src = button.dataset.video;
      source.type = "video/mp4";
      dialogVideo.appendChild(source);
      dialogVideo.load();
      document.body.classList.add("modal-open");
      dialog.showModal();
      dialogVideo.play().catch(() => {});
    });
  });

  function closeDialog() {
    dialogVideo.pause();
    dialog.close();
    document.body.classList.remove("modal-open");
  }

  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;

    if (clickedOutside) {
      closeDialog();
    }
  });

  dialog.addEventListener("close", () => {
    dialogVideo.pause();
    document.body.classList.remove("modal-open");
  });
})();
