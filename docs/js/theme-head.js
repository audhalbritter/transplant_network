(function () {
  try {
    var s = localStorage.getItem("transplant_network_theme");
    if (s === "light") document.documentElement.dataset.theme = "light";
    else if (s === "dark") document.documentElement.removeAttribute("data-theme");
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.documentElement.dataset.theme = "light";
    }
  } catch (e) {
    /* private mode etc. */
  }
})();
