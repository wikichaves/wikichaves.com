/* Lightbox — click any case-study image to expand.
   Keyboard (←/→/Esc) and touch swipe supported.
   Shared by every page under /design/projects/*. */
(function () {
  var imgs = Array.prototype.slice.call(
    document.querySelectorAll('.figure-band img, figure.compare img, figure.shot img')
  );
  var lb = document.getElementById('lightbox');
  if (!imgs.length || !lb) return;
  var lbImg = lb.querySelector('.lightbox__img');
  var lbCap = lb.querySelector('.lightbox__cap');
  var i = 0;
  function srcOf(im) { return im.currentSrc || im.src; }
  function capOf(im) { var f = im.closest('figure'); var c = f && f.querySelector('figcaption'); return c ? c.textContent.trim() : ''; }
  function preload(idx) { var im = imgs[idx]; if (!im) return; var p = new Image(); p.src = srcOf(im); }
  function paint() {
    var im = imgs[i];
    lb.classList.add('loading');
    lbImg.src = srcOf(im);
    lbImg.alt = im.alt || '';
    lbCap.textContent = capOf(im);
    preload((i + 1) % imgs.length);
    preload((i - 1 + imgs.length) % imgs.length);
  }
  lbImg.addEventListener('load', function () { lb.classList.remove('loading'); });
  lbImg.addEventListener('error', function () { lb.classList.remove('loading'); });
  function open(idx) { i = idx; paint(); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('lb-open'); }
  function close() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lb-open'); }
  function next() { i = (i + 1) % imgs.length; paint(); }
  function prev() { i = (i - 1 + imgs.length) % imgs.length; paint(); }
  imgs.forEach(function (im, idx) { im.style.cursor = 'zoom-in'; im.addEventListener('click', function () { open(idx); }); });
  lb.querySelectorAll('[data-lb-close]').forEach(function (el) { el.addEventListener('click', close); });
  lb.querySelector('[data-lb-prev]').addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  lb.querySelector('[data-lb-next]').addEventListener('click', function (e) { e.stopPropagation(); next(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });
  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (touchX === null) return; var dx = e.changedTouches[0].clientX - touchX; touchX = null; if (Math.abs(dx) > 50) (dx < 0 ? next() : prev()); }, { passive: true });
})();
