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
});
