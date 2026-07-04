const weddingDate = new Date("2026-10-03T13:30:00-06:00");
const whatsappNumber = "50689119310";

const cover = document.getElementById("cover");
const openInvitation = document.getElementById("openInvitation");
const musicButton = document.getElementById("musicButton");
const weddingMusic = document.getElementById("weddingMusic");
const revealItems = document.querySelectorAll(".reveal");
const rsvpForm = document.getElementById("rsvpForm");
let isOpening = false;

openInvitation.addEventListener("pointerdown", () => {
  if (!isOpening) openInvitation.classList.add("is-pressing");
});

["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
  openInvitation.addEventListener(eventName, () => {
    openInvitation.classList.remove("is-pressing");
  });
});

openInvitation.addEventListener("click", () => {
  if (isOpening) return;
  isOpening = true;
  openInvitation.classList.remove("is-pressing");
  openInvitation.classList.add("is-tapping");

  window.setTimeout(() => {
    cover.classList.add("is-open");
    document.body.classList.remove("locked");
  }, 650);

  window.setTimeout(() => {
    cover.setAttribute("aria-hidden", "true");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1950);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        return;
      }

      const farAbove = entry.boundingClientRect.bottom < -window.innerHeight * 0.15;
      const farBelow = entry.boundingClientRect.top > window.innerHeight * 1.15;

      if (farAbove || farBelow) {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  { threshold: [0, 0.16], rootMargin: "0px 0px -4% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const parts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  parts.days.textContent = String(days).padStart(3, "0");
  parts.hours.textContent = pad(hours);
  parts.minutes.textContent = pad(minutes);
  parts.seconds.textContent = pad(seconds);
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

musicButton.addEventListener("click", async () => {
  try {
    if (weddingMusic.paused) {
      await weddingMusic.play();
      musicButton.classList.add("playing");
      musicButton.setAttribute("aria-label", "Pausar música");
      return;
    }

    weddingMusic.pause();
    musicButton.classList.remove("playing");
    musicButton.setAttribute("aria-label", "Reproducir música");
  } catch (error) {
    musicButton.classList.remove("playing");
    musicButton.setAttribute("aria-label", "Reproducir música");
    console.warn("No se pudo reproducir la música.", error);
  }
});

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const count = document.getElementById("guestCount").value;
  const message = document.getElementById("guestMessage").value.trim();
  const text = [
    "Hola, quiero confirmar mi asistencia a la boda de Mariana y Daniel.",
    "Fecha límite para confirmar: 10 de agosto.",
    `Nombre: ${name}`,
    `Invitados: ${count}`,
    message ? `Mensaje: ${message}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
});
