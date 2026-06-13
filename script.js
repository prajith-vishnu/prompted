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

  // ---------- Nav dropdown ----------
  const closeDropdowns = (except) => {
    document.querySelectorAll(".has-dropdown.open").forEach((d) => {
      if (d === except) return;
      d.classList.remove("open");
      const t = d.querySelector(".nav-dropdown-toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  };
  document.querySelectorAll(".nav-dropdown-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const li = btn.closest(".has-dropdown");
      const willOpen = !li.classList.contains("open");
      closeDropdowns(li);
      li.classList.toggle("open", willOpen);
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-dropdown")) closeDropdowns();
  });

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
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const showSuccess = () => {
      form.style.display = "none";
      const success = form.parentElement.querySelector(".form-success");
      if (success) success.classList.add("show");
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const endpoint = form.getAttribute("action");
      // No endpoint wired up yet — keep the demo confirmation.
      if (!endpoint) return showSuccess();

      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      try {
        const data = Object.fromEntries(new FormData(form).entries());
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        showSuccess();
      } catch (err) {
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
        alert("Sorry — that didn't send. Please email promptedworkshops@gmail.com directly.");
      }
    });
  });
});
