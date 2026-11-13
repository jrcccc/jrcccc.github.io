'use strict';

// Animations page: clicking a card opens a player for that video,
// streamed from Zenodo. Nothing is downloaded until a card is clicked,
// and closing the player stops the download.

(function () {
  const modal = document.querySelector("[data-video-modal]");
  if (!modal || typeof modal.showModal !== "function") return; // fall back to plain Zenodo links

  const player = modal.querySelector("[data-video-player]");
  const title = modal.querySelector("[data-video-title]");
  const source = modal.querySelector("[data-video-source]");
  const error = modal.querySelector("[data-video-error]");
  const closeBtn = modal.querySelector("[data-video-close]");

  const open = function (card) {
    title.textContent = card.querySelector(".animation-title").textContent.trim();
    source.href = card.href;
    error.hidden = true;
    player.src = card.dataset.video;
    modal.showModal();
    const playing = player.play();
    if (playing && playing.catch) playing.catch(function () { /* user can press play */ });
  };

  const stop = function () {
    player.pause();
    player.removeAttribute("src");
    player.load(); // aborts any download in progress
  };

  document.querySelectorAll(".animation-link[data-video]").forEach(function (card) {
    card.addEventListener("click", function (event) {
      // Let modified clicks (new tab/window) go straight to Zenodo.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      open(card);
    });
  });

  player.addEventListener("error", function () {
    if (player.getAttribute("src")) error.hidden = false;
  });

  closeBtn.addEventListener("click", function () { modal.close(); });

  // Close when clicking the dimmed backdrop around the player.
  modal.addEventListener("click", function (event) {
    if (event.target === modal) modal.close();
  });

  // Fires for the close button, backdrop click and the Escape key.
  modal.addEventListener("close", stop);
})();
