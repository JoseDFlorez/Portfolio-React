export const motionInitScript = `
(function() {
  try {
    var root = document.documentElement;
    var media = window.matchMedia('(prefers-reduced-motion: no-preference)');
    if (!media.matches) return;
    root.classList.add('motion-ok');
    window.setTimeout(function() {
      root.classList.remove('motion-ok');
    }, 2500);
  } catch (_) {}
})();
`.trim();
