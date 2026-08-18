document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Hero slider Shukery (slides + fleches + points + autoplay) ----
  (function () {
    var root = document.getElementById('skHeroSlider');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('.sk-hero-slide'));
    if (slides.length < 2) return;
    var dotsEl = document.getElementById('skHeroDots');
    var prevBtn = document.getElementById('skHeroPrev');
    var nextBtn = document.getElementById('skHeroNext');
    var cur = 0, timer;

    if (dotsEl) {
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Aller à la diapositive ' + (i + 1));
        if (i === 0) b.classList.add('is-active');
        b.addEventListener('click', function () { go(i); restart(); });
        dotsEl.appendChild(b);
      });
    }

    function go(i) {
      slides[cur].classList.remove('is-active');
      if (dotsEl) dotsEl.children[cur].classList.remove('is-active');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('is-active');
      if (dotsEl) dotsEl.children[cur].classList.add('is-active');
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 6000); }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(cur - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(cur + 1); restart(); });
    restart();
  })();

  // ---- Carte : nav catégories active au scroll (scrollspy) ----
  var catNav = document.querySelector('.sk-cm-cat');
  if (catNav) {
    var catLinks = Array.prototype.slice.call(catNav.querySelectorAll('a'));

    function setActiveCat(id) {
      var matched = false;
      catLinks.forEach(function (a) {
        var on = !matched && a.getAttribute('href') === id;
        if (on) matched = true;
        a.classList.toggle('is-active', on);
      });
    }

    var sections = [];
    catLinks.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        var sec = document.querySelector(href);
        if (sec && sections.indexOf(sec) === -1) sections.push(sec);
      }
    });

    if (sections.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveCat('#' + entry.target.id);
        });
      }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
      sections.forEach(function (s) { observer.observe(s); });
    }
  }

  // ---- Effets : apparition au scroll (reveal) ----
  var revealSelector = '.sk-menu-teaser-tile, .sk-histoire-item, .sk-insta-grid > a, .sk-info > div, .sk-cm-band, .sk-cm-item, .sk-eq-collage, .sk-eq-value, .sk-eq-quote, .sk-eq-job';
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSelector));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    revealEls.forEach(function (el) {
      el.classList.add('sk-reveal');
      // léger décalage en cascade entre voisins d'un même parent
      var idx = 0, sib = el.previousElementSibling;
      while (sib) { if (sib.classList && sib.classList.contains('sk-reveal')) idx++; sib = sib.previousElementSibling; }
      el.style.transitionDelay = (Math.min(idx, 6) * 70) + 'ms';
    });
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObs.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  // ---- Instagram : lecture des reels au survol de la souris ----
  document.querySelectorAll('.sk-insta-grid video').forEach(function (video) {
    var cell = video.closest('a') || video;
    cell.addEventListener('mouseenter', function () {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });
    cell.addEventListener('mouseleave', function () {
      video.pause();
      video.currentTime = 0;
    });
  });

  // ---- Effets : spotlight glow (halo qui suit le curseur) ----
  var glowEls = Array.prototype.slice.call(document.querySelectorAll('.sk-eq-job, .sk-eq-value'));
  glowEls.forEach(function (card) {
    card.classList.add('sk-glow');
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
});
