(function () {
  const STORAGE_KEY  = "lang";
  const DEFAULT_LANG = "en";
  const SUPPORTED    = ["en", "es"];

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  async function loadTranslations(lang) {
    const res = await fetch(`locales/${lang}.json`);
    if (!res.ok) throw new Error(`Could not load locales/${lang}.json`);
    return res.json();
  }

  function applyTranslations(t, lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key in t) el.innerHTML = t[key];
    });

      const btn = document.getElementById("lang-toggle");
      if (btn) {
        btn.textContent = lang === "en" ? "ES" : "EN";
        btn.setAttribute(
          "aria-label",
          lang === "en" ? "Cambiar a español" : "Switch to English"
        );
      }

      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
  }

  async function switchLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    const t = await loadTranslations(lang);
    applyTranslations(t, lang);
  }

  // --- Theme ---

  const THEME_KEY = "theme";

  function applyTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }

  // --- Init ---

  document.addEventListener("DOMContentLoaded", async () => {
    // Theme: restore saved preference, fall back to OS preference
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(savedTheme ? savedTheme === "dark" : prefersDark);

    document.getElementById("theme-toggle")?.addEventListener("click", () => {
      applyTheme(!document.documentElement.classList.contains("dark"));
    });

    // Language
    await switchLang(currentLang);

    document.getElementById("lang-toggle")?.addEventListener("click", () => {
      switchLang(currentLang === "en" ? "es" : "en");
    });
  });
})();
