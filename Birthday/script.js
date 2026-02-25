document.addEventListener("DOMContentLoaded", () => {
  const unlockTimeUTC = Date.UTC(2026, 1, 26, 6, 0, 0);
  let hasBurst = false;

  const lockScreen = document.getElementById("lockScreen");
  const birthdayScreen = document.getElementById("birthdayScreen");
  const countdownEl = document.getElementById("countdown");
  const unlockDateText = document.getElementById("unlockDateText");

  if (!lockScreen || !birthdayScreen || !countdownEl || !unlockDateText) return;

  const pad = (n) => String(n).padStart(2, "0");

  
  function updateCountdown() {
    const diff = unlockTimeUTC - Date.now();

    if (diff <= 0) {
      lockScreen.hidden = true;
      birthdayScreen.hidden = false;

      if (!hasBurst) {
        hasBurst = true;
        confettiBurst(40);                 // instant burst
        setTimeout(() => confettiBurst(40), 400);  // extra burst
        setTimeout(() => confettiBurst(40), 800);  // extra burst
      }

      return;
    }

    unlockDateText.textContent = "Unlocks at: " + new Date(unlockTimeUTC).toLocaleString();

    if (diff <= 0) {
      lockScreen.hidden = true;
      birthdayScreen.hidden = false;
      countdownEl.textContent = "00d : 00h : 00m : 00s";
      return;
    }

    lockScreen.hidden = false;
    birthdayScreen.hidden = true;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownEl.textContent = `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Buttons (safe: only add listeners if they exist)
  const confettiBtn = document.getElementById("confettiBtn");
  const surpriseBtn = document.getElementById("surpriseBtn");
  const surpriseText = document.getElementById("surpriseText");

  if (confettiBtn) {
    confettiBtn.addEventListener("click", () => {
      const burst = document.createElement("div");
      burst.style.position = "fixed";
      burst.style.left = Math.random() * 100 + "vw";
      burst.style.top = "-20px";
      burst.style.fontSize = "28px";
      burst.style.zIndex = "9999";
      burst.textContent = "🎊✨🎉💖🎂";
      document.body.appendChild(burst);

      let y = -20;
      const fall = setInterval(() => {
        y += 8;
        burst.style.top = y + "px";
        if (y > window.innerHeight + 50) {
          clearInterval(fall);
          burst.remove();
        }
      }, 16);
    });
  }

  if (surpriseBtn && surpriseText) {
    surpriseBtn.addEventListener("click", () => {
      surpriseText.hidden = !surpriseText.hidden;
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