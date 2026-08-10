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
      var tile = figure.querySelector('.gallery-tile');
      var caption = figure.querySelector('figcaption');
      lightboxImg.innerHTML = tile ? tile.innerHTML : '';
      lightboxImg.className = 'lightbox__img ' + (tile ? tile.className.replace('gallery-tile', '') : '');
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
});
