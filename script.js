/* =============================================
   Kikyo Birthday — Script
   ============================================= */

// ====== Konfigurasi ======
const CONFIG = {
  password: "kikyo",        // ← ganti kalau mau
  maxPetalCount: 22,        // jumlah kelopak di layar
};

// ====== Elemen ======
const gate = document.getElementById("gate");
const content = document.getElementById("content");
const passwordInput = document.getElementById("passwordInput");
const unlockBtn = document.getElementById("unlockBtn");
const errorMsg = document.getElementById("errorMsg");
const petalsContainer = document.getElementById("petals");

// =============================================
// 1. Kelopak Bunga Jatuh
// =============================================
function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petal");

  const size = 8 + Math.random() * 12;         // 8–20 px
  const duration = 8 + Math.random() * 10;      // 8–18 detik
  const delay = Math.random() * 8;              // 0–8 detik
  const left = Math.random() * 100;             // 0–100%

  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.left = `${left}%`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `-${delay}s`;
  petal.style.opacity = 0.5 + Math.random() * 0.4;

  petalsContainer.appendChild(petal);
}

for (let i = 0; i < CONFIG.maxPetalCount; i++) {
  createPetal();
}

// =============================================
// 5. Backsound
// =============================================
const backsound = document.getElementById("backsound");
const musicToggle = document.getElementById("musicToggle");

// Volume awal (0.0 – 1.0) — jangan terlalu keras
backsound.volume = 0.35;

// Coba autoplay saat halaman pertama dibuka (mungkin diblokir browser)
function tryAutoplay() {
  backsound.play().catch(() => {
    // Autoplay diblokir — biarkan, nanti diputar setelah unlock
    console.log("Autoplay diblokir, menunggu interaksi user.");
  });
}
tryAutoplay();

// Mulai musik setelah user berhasil unlock
const originalUnlock = unlock;
unlock = function () {
  originalUnlock();
  // Cek setelah animasi gate selesai
 setTimeout(() => {
  gate.style.display = "none";
  content.classList.remove("hidden");
  initReveal();
  showMusicToggle();      // ← tambahkan ini
  window.scrollTo({ top: 0, behavior: "smooth" });
}, 700);
};

// Toggle musik
musicToggle.addEventListener("click", () => {
  if (backsound.paused) {
    backsound.play().then(() => {
      musicToggle.classList.add("playing");
    }).catch(() => {});
  } else {
    backsound.pause();
    musicToggle.classList.remove("playing");
  }
});

// Tampilkan tombol musik setelah konten muncul
function showMusicToggle() {
  musicToggle.classList.remove("hidden");
}

// Ganti kelopak lama supaya animasi tetap segar
setInterval(() => {
  if (petalsContainer.children.length > CONFIG.maxPetalCount) {
    petalsContainer.removeChild(petalsContainer.firstChild);
  }
  createPetal();
}, 4000);

// =============================================
// 2. Password Gate
// =============================================
function unlock() {
  const value = passwordInput.value.trim().toLowerCase();

  if (value === CONFIG.password) {
    errorMsg.textContent = "";
    // Sembunyikan gate dengan animasi
    gate.classList.add("fade-out");
    setTimeout(() => {
      gate.style.display = "none";
      content.classList.remove("hidden");
      // Trigger reveal animations
      initReveal();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  } else {
    errorMsg.textContent = "Sepertinya belum tepat. Coba lagi ya 🌸";
    passwordInput.classList.add("shake");
    setTimeout(() => passwordInput.classList.remove("shake"), 400);
    passwordInput.select();
  }
}

unlockBtn.addEventListener("click", unlock);
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock();
});

// Fokus otomatis saat halaman dibuka
window.addEventListener("load", () => {
  passwordInput.focus();
});

// =============================================
// 3. Reveal on Scroll
// =============================================
function initReveal() {
  const targets = document.querySelectorAll(
    ".hero .eyebrow, .hero .title, .hero .subtitle, .scroll-hint, .gallery-section, .message-section .letter, .reward-section, footer"
  );

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));

  // Hero langsung muncul
  setTimeout(() => {
    document.querySelectorAll(".hero .reveal").forEach((el) =>
      el.classList.add("visible")
    );
  }, 100);
}

// =============================================
// 4. Fallback foto jika belum ada
// =============================================
document.querySelectorAll(".gallery img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.display = "none";
    const fig = img.parentElement;
    fig.style.minHeight = "340px";
    fig.style.display = "flex";
    fig.style.alignItems = "center";
    fig.style.justifyContent = "center";
    fig.style.background =
      "linear-gradient(135deg, #f7d9e3, #e8d9f0)";
    fig.style.color = "#a888c4";
    fig.style.fontSize = "0.9rem";
    fig.innerHTML =
      '<div style="text-align:center;padding:24px;">🌸<br><small>Foto akan segera hadir</small></div>';
  });
});