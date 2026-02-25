document.addEventListener("DOMContentLoaded", () => {
  // ✅ Feb 26, 2026 12:00 AM Milwaukee (CST=UTC-6) => 06:00 UTC
  const unlockTimeUTC = Date.UTC(2026, 1, 25, 6, 0, 0);
  let hasBurst = false;

  const lockScreen = document.getElementById("lockScreen");
  const birthdayScreen = document.getElementById("birthdayScreen");
  const countdownEl = document.getElementById("countdown");
  const unlockDateText = document.getElementById("unlockDateText");
  const tickAudio = document.getElementById("tickAudio");
  const bgVideoWrap = document.getElementById("bgVideoWrap");
  const bgVideo = document.getElementById("bgVideo");

  if (!lockScreen || !birthdayScreen || !countdownEl || !unlockDateText) return;

  const pad = (n) => String(n).padStart(2, "0");

  function updateCountdown() {
    const diff = unlockTimeUTC - Date.now();

    unlockDateText.textContent =
      "Unlocks at: " + new Date(unlockTimeUTC).toLocaleString();

    // ✅ UNLOCKED
    if (diff <= 0) {
      lockScreen.hidden = true;
      birthdayScreen.hidden = false;
      countdownEl.textContent = "00d : 00h : 00m : 00s";

      // Stop ticking
      if (tickAudio) {
        tickAudio.pause();
        tickAudio.currentTime = 0;
      }

      // Show + fade in background video
      if (bgVideoWrap && bgVideo) {
        bgVideoWrap.hidden = false;
        bgVideoWrap.offsetHeight; // trigger transition
        bgVideoWrap.classList.add("show");
        bgVideo.play().catch(() => {});
      }

      // Confetti once
      if (!hasBurst) {
        hasBurst = true;
        confettiBurst(40);
        setTimeout(() => confettiBurst(40), 400);
        setTimeout(() => confettiBurst(40), 800);
      }

      return;
    }

    // ✅ STILL LOCKED
    lockScreen.hidden = false;
    birthdayScreen.hidden = true;

    // ticking while locked (autoplay may require a click first; won’t crash)
    if (tickAudio && tickAudio.paused) {
      tickAudio.play().catch(() => {});
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownEl.textContent =
      `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Buttons
  const confettiBtn = document.getElementById("confettiBtn");
  const surpriseBtn = document.getElementById("surpriseBtn");
  const surpriseText = document.getElementById("surpriseText");

  if (confettiBtn) confettiBtn.addEventListener("click", () => confettiBurst(25));
  if (surpriseBtn && surpriseText) {
    surpriseBtn.addEventListener("click", () => {
      surpriseText.hidden = !surpriseText.hidden;
    });
  }

  // Lightbox
  const images = document.querySelectorAll(".gallery img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeLightbox = document.getElementById("closeLightbox");

  if (lightbox && lightboxImg && closeLightbox) {
    images.forEach(img => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.hidden = false;
      });
    });

    closeLightbox.addEventListener("click", () => {
      lightbox.hidden = true;
      lightboxImg.src = "";
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.hidden = true;
        lightboxImg.src = "";
      }
    });
  }
});

function confettiBurst(times = 25) {
  for (let i = 0; i < times; i++) {
    const piece = document.createElement("div");
    piece.textContent = ["🎊","✨","🎉","💖","🎂"][Math.floor(Math.random() * 5)];
    piece.style.position = "fixed";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-30px";
    piece.style.fontSize = (18 + Math.random() * 18) + "px";
    piece.style.zIndex = "9999";
    piece.style.pointerEvents = "none";
    document.body.appendChild(piece);

    let y = -30;
    const speed = 3 + Math.random() * 7;

    const fall = setInterval(() => {
      y += speed;
      piece.style.top = y + "px";
      if (y > window.innerHeight + 60) {
        clearInterval(fall);
        piece.remove();
      }
    }, 16);
  }
}