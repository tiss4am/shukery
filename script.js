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

  // ---- Formulaires (contact) ----
  // Pas de backend branché : on affiche juste une confirmation visuelle.
  function wireForm(formId, noteId) {
    var form = document.getElementById(formId);
    var note = document.getElementById(noteId);
    if (!form || !note) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.hidden = false;
      form.reset();
    });
  }

  wireForm('contactForm', 'contactNote');
  wireForm('homeContactForm', 'homeContactNote');

  // ---- Carousels (prestations / avis) ----
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    if (!track) return;

    function scrollByCard(dir) {
      var card = track.querySelector(':scope > *');
      var amount = card ? card.getBoundingClientRect().width + 26 : 300;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { scrollByCard(-1); });
    if (next) next.addEventListener('click', function () { scrollByCard(1); });
  });

  // ---- Lightbox galerie ----
  var lightbox = document.getElementById('lightbox');
  var galleryFigures = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid figure'));

  if (lightbox && galleryFigures.length) {
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var currentIndex = 0;

    function showImage(index) {
      currentIndex = (index + galleryFigures.length) % galleryFigures.length;
      var figure = galleryFigures[currentIndex];
      var img = figure.querySelector('img');
      var caption = figure.querySelector('figcaption');
      lightboxImg.innerHTML = img ? '<img src="' + img.src + '" alt="' + img.alt + '">' : '';
      lightboxCaption.textContent = caption ? caption.textContent : '';
    }

    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    galleryFigures.forEach(function (figure, index) {
      figure.addEventListener('click', function () { openLightbox(index); });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function () { showImage(currentIndex - 1); });
    lightboxNext.addEventListener('click', function () { showImage(currentIndex + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  // ---- Slider générique (hero + espace) ----
  function initSlider(opts) {
    var root = document.getElementById(opts.rootId);
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll(opts.slideSelector));
    if (!slides.length) return;
    var pagerEl = document.getElementById(opts.pagerId);
    var prevBtn = document.getElementById(opts.prevId);
    var nextBtn = document.getElementById(opts.nextId);
    var current = 0;
    var timer;

    if (pagerEl) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Aller à la diapositive ' + (i + 1));
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        pagerEl.appendChild(dot);
      });
    }

    function goTo(index) {
      slides[current].classList.remove('is-active');
      if (pagerEl) pagerEl.children[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (pagerEl) pagerEl.children[current].classList.add('is-active');
    }

    function resetTimer() {
      if (!opts.autoplay) return;
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, opts.autoplay);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

    resetTimer();
  }

  initSlider({ rootId: 'heroSlider', slideSelector: '.hero-slide', pagerId: 'heroPager', prevId: 'heroPrev', nextId: 'heroNext', autoplay: 6000 });
  initSlider({ rootId: 'browseSlider', slideSelector: '.browse-slide', pagerId: 'browsePager', prevId: 'browsePrev', nextId: 'browseNext', autoplay: 5000 });

  // ---- Onglets "Univers Shukery" ----
  var universeTabs = document.getElementById('universeTabs');
  var universeGrid = document.getElementById('universeGrid');
  if (universeTabs && universeGrid) {
    var cards = Array.prototype.slice.call(universeGrid.querySelectorAll('.universe-card'));

    function filterUniverse(tab) {
      cards.forEach(function (card) {
        card.style.display = (tab === 'all' || card.getAttribute('data-cat') === tab) ? '' : 'none';
      });
      universeTabs.querySelectorAll('button').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tab);
      });
    }

    universeTabs.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () { filterUniverse(btn.getAttribute('data-tab')); });
    });

    // liens du mega-menu pointant vers un onglet précis (#univers + data-tab)
    document.querySelectorAll('a[href="index.html#univers"][data-tab]').forEach(function (link) {
      link.addEventListener('click', function () {
        filterUniverse(link.getAttribute('data-tab'));
      });
    });
  }
});
