export function ThemeScript() {
  const script = `(() => { try { const key = "drmc-theme"; const saved = localStorage.getItem(key); const preference = saved === "light" || saved === "dark" || saved === "system" ? saved : "system"; const dark = preference === "dark" || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches); const root = document.documentElement; root.dataset.theme = preference; root.classList.toggle("theme-dark", dark); root.classList.toggle("theme-light", !dark); root.style.colorScheme = dark ? "dark" : "light"; } catch {} })();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
