// ---------- Theme toggle ----------
const root = document.documentElement;
const saved = localStorage.getItem("prompted-theme");
if (saved === "light") root.setAttribute("data-theme", "light");

function syncThemeIcon() {
  const btn = document.querySelector(".theme-toggle i");
  if (!btn) return;
  const light = root.getAttribute("data-theme") === "light";
  btn.setAttribute("data-lucide", light ? "moon" : "sun");
  if (window.lucide) lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  syncThemeIcon();

  const toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const light = root.getAttribute("data-theme") === "light";
      if (light) {
        root.removeAttribute("data-theme");
        localStorage.setItem("prompted-theme", "dark");
      } else {
        root.setAttribute("data-theme", "light");
        localStorage.setItem("prompted-theme", "light");
      }
      syncThemeIcon();
    });
  }

  // ---------- Mobile menu ----------
  const burger = document.querySelector(".hamburger");
  const links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", () => links.classList.toggle("open"));
  }

  // ---------- Scroll reveal ----------
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // ---------- Typing hero ----------
  const typeTarget = document.querySelector("[data-type]");
  if (typeTarget) {
    const full = typeTarget.getAttribute("data-type");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      typeTarget.textContent = full;
    } else {
      typeTarget.textContent = "";
      let i = 0;
      const tick = () => {
        if (i <= full.length) {
          typeTarget.textContent = full.slice(0, i);
          i++;
          setTimeout(tick, 46);
        }
      };
      setTimeout(tick, 350);
    }
  }

  // ---------- FAQ accordion ----------
  document.querySelectorAll(".faq-q").forEach((q) => {
    q.addEventListener("click", () => {
      q.parentElement.classList.toggle("open");
    });
  });

  // ---------- Forms ----------
  document.querySelectorAll("form[data-demo]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.style.display = "none";
      const success = form.parentElement.querySelector(".form-success");
      if (success) success.classList.add("show");
    });
  });
});
