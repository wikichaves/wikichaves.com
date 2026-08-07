/* Lightbox — click any case-study image to expand.
   Keyboard (←/→/Esc) and touch swipe supported.
   Shared by every page under /design/projects/*. */
(function () {
  var imgs = Array.prototype.slice.call(
    document.querySelectorAll('.figure-band img, figure.compare img, figure.shot img')
  );
  var lb = document.getElementById('lightbox');
  if (!imgs.length || !lb) return;
  var lbInner = lb.querySelector('.lightbox__inner');
  var lbCap = lb.querySelector('.lightbox__cap');
  var shown = lb.querySelector('.lightbox__img');
  var i = 0;

  function capOf(im) { var f = im.closest('figure'); var c = f && f.querySelector('figcaption'); return c ? c.textContent.trim() : ''; }
  function loaded() { lb.classList.remove('loading'); }

  /* A <picture> is the only way to ask the browser for "whichever format you
     prefer" — there is no API that returns the URL it would pick. So cloning
     one is how both the visible image and the neighbour prefetch work here.
     `new Image().src = img.src` would pull the JPEG, and flipping the page
     image's own loading="lazy" makes Chrome fetch the JPEG *and* the AVIF. */
  function clonePicture(im) {
    var pic = im.closest('picture');
    var node = pic ? pic.cloneNode(true) : im.cloneNode(false);
    var img = node.tagName === 'PICTURE' ? node.querySelector('img') : node;
    img.removeAttribute('loading');
    img.removeAttribute('fetchpriority');
    img.removeAttribute('style');
    return { node: node, img: img, isPicture: node.tagName === 'PICTURE' };
  }

  /* Off-screen holder that warms the next/previous image. Kept to two
     children so it never grows into a second copy of the gallery. */
  var warm = document.createElement('div');
  warm.setAttribute('aria-hidden', 'true');
  warm.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
  lb.appendChild(warm);

  function preload() {
    warm.textContent = '';
    [(i + 1) % imgs.length, (i - 1 + imgs.length) % imgs.length].forEach(function (idx) {
      if (idx === i) return;
      warm.appendChild(clonePicture(imgs[idx]).node);
    });
  }

  /* Show a clone of the source <picture> rather than a bare URL, so the
     browser runs its own AVIF/WebP negotiation and reuses what it has
     already cached. Reading .currentSrc would work only once the original
     has finished loading, and .src is always the JPEG. */
  function paint() {
    var im = imgs[i];
    var c = clonePicture(im);

    c.node.className = c.isPicture ? 'lightbox__pic' : 'lightbox__img';
    c.img.className = 'lightbox__img';
    c.img.alt = im.alt || '';
    c.img.addEventListener('load', loaded);
    c.img.addEventListener('error', loaded);

    lb.classList.add('loading');
    lbInner.replaceChild(c.node, shown);
    shown = c.node;
    if (c.img.complete) loaded();

    lbCap.textContent = capOf(im);
    preload();
  }

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
