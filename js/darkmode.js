export function initDarkMode() {
  const btn = document.getElementById('dark-mode-toggle');
  if (!btn) return;

  const apply = (dark) => {
    document.documentElement.classList.toggle('dark', dark);
    btn.setAttribute('aria-pressed', String(dark));
    btn.innerHTML = dark
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
  };

  const saved = localStorage.getItem('mskathi-darkmode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved !== null ? saved === 'true' : prefersDark;
  apply(isDark);

  btn.addEventListener('click', () => {
    const nowDark = !document.documentElement.classList.contains('dark');
    localStorage.setItem('mskathi-darkmode', String(nowDark));
    apply(nowDark);
  });
}
