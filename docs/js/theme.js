const STORAGE_KEY = "transplant_network_theme";

/** @returns {"dark" | "light"} */
function resolvedTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") root.dataset.theme = "light";
  else root.removeAttribute("data-theme");

  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const isLight = theme === "light";
  btn.setAttribute("aria-checked", isLight ? "true" : "false");
  btn.setAttribute(
    "aria-label",
    isLight
      ? "Theme: light. Activate to use dark theme."
      : "Theme: dark. Activate to use light theme."
  );
  btn.setAttribute(
    "title",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );
}

function initTheme() {
  applyTheme(resolvedTheme());

  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}
