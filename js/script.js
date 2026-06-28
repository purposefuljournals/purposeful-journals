// ─── YEAR ───────────────────────────────────────────────
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ─── MOBILE NAV ─────────────────────────────────────────
var siteNav = document.getElementById('site-nav');
var navToggle = siteNav && siteNav.querySelector('.nav-toggle');
var navMenu = document.getElementById('nav-menu');

if (siteNav && navToggle && navMenu) {
  var navBackdrop = document.createElement('button');
  navBackdrop.type = 'button';
  navBackdrop.className = 'nav-backdrop';
  navBackdrop.setAttribute('aria-label', 'Close menu');
  navBackdrop.hidden = true;
  document.body.appendChild(navBackdrop);

  function setNavOpen(open) {
    siteNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
    navBackdrop.hidden = !open;
    navBackdrop.classList.toggle('is-visible', open);
  }

  navToggle.addEventListener('click', function () {
    setNavOpen(!siteNav.classList.contains('is-open'));
  });

  navBackdrop.addEventListener('click', function () {
    setNavOpen(false);
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setNavOpen(false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
      setNavOpen(false);
    }
  });

  window.matchMedia('(min-width: 701px)').addEventListener('change', function (e) {
    if (e.matches) setNavOpen(false);
  });
}

// ─── SMOOTH SCROLL ──────────────────────────────────────
function getScrollOffset() {
  var nav = document.querySelector('nav');
  return (nav ? nav.offsetHeight : 56) + 32;
}

function scrollToHashTarget(target) {
  var top = window.scrollY + target.getBoundingClientRect().top - getScrollOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var hash = this.getAttribute('href');
    if (!hash || hash === '#') return;

    var target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    scrollToHashTarget(target);
  });
});

if (window.location.hash) {
  var initialTarget = document.querySelector(window.location.hash);
  if (initialTarget) {
    requestAnimationFrame(function () {
      scrollToHashTarget(initialTarget);
    });
  }
}

// ─── COVER LIGHTBOX ─────────────────────────────────────
var lightbox = document.getElementById('cover-lightbox');
var lightboxImage = document.getElementById('lightbox-image');
var lightboxCaption = document.getElementById('lightbox-caption');

if (lightbox && lightboxImage) {
  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    if (lightboxCaption) lightboxCaption.textContent = alt;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.product-cover-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var insideSrc = btn.getAttribute('data-inside-src');
      var insideAlt = btn.getAttribute('data-inside-alt');
      var img = btn.querySelector('.product-cover');
      if (insideSrc) {
        openLightbox(insideSrc, insideAlt || '');
      } else if (img) {
        openLightbox(img.src, img.alt);
      }
    });
  });

  lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.hidden && e.key === 'Escape') closeLightbox();
  });
}

// ─── AMAZON STORE DROPDOWN ──────────────────────────────
var AMAZON_MARKETPLACES = [
  { host: 'amazon.com', label: 'United States' },
  { host: 'amazon.co.uk', label: 'United Kingdom' },
  { host: 'amazon.ca', label: 'Canada' },
  { host: 'amazon.com.au', label: 'Australia' },
  { host: 'amazon.de', label: 'Germany' },
  { host: 'amazon.fr', label: 'France' },
  { host: 'amazon.it', label: 'Italy' },
  { host: 'amazon.es', label: 'Spain' },
  { host: 'amazon.nl', label: 'Netherlands' },
  { host: 'amazon.se', label: 'Sweden' },
  { host: 'amazon.pl', label: 'Poland' },
  { host: 'amazon.com.be', label: 'Belgium' },
  { host: 'amazon.ie', label: 'Ireland' },
  { host: 'amazon.co.jp', label: 'Japan' },
  { host: 'amazon.in', label: 'India' },
  { host: 'amazon.com.br', label: 'Brazil' },
  { host: 'amazon.com.mx', label: 'Mexico' },
  { host: 'amazon.sg', label: 'Singapore' },
  { host: 'amazon.ae', label: 'United Arab Emirates' },
  { host: 'amazon.sa', label: 'Saudi Arabia' },
  { host: 'amazon.com.tr', label: 'Turkey' },
  { host: 'amazon.eg', label: 'Egypt' }
];

function buildAmazonProductUrl(host, asin) {
  return 'https://www.' + host + '/dp/' + asin;
}

document.querySelectorAll('.amazon-store').forEach(function (store) {
  var asin = store.getAttribute('data-asin');
  if (!asin) return;

  var card = store.closest('.product-card');
  var productName = card ? card.querySelector('.product-name') : null;
  var label = productName
    ? 'Buy on Amazon — ' + productName.textContent.trim()
    : 'Buy on Amazon';

  var legacySelect = store.querySelector('.amazon-store-select');
  if (legacySelect) legacySelect.remove();

  var picker = document.createElement('details');
  picker.className = 'amazon-store-picker';

  var summary = document.createElement('summary');
  summary.textContent = 'Buy on Amazon';
  picker.appendChild(summary);

  var menu = document.createElement('div');
  menu.className = 'amazon-store-menu';
  var list = document.createElement('ul');

  AMAZON_MARKETPLACES.forEach(function (market) {
    var item = document.createElement('li');
    var link = document.createElement('a');
    link.href = buildAmazonProductUrl(market.host, asin);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = market.label;
    item.appendChild(link);
    list.appendChild(item);
  });

  menu.appendChild(list);
  picker.appendChild(menu);
  store.setAttribute('aria-label', label);
  store.appendChild(picker);

  picker.addEventListener('toggle', function () {
    if (!picker.open) return;
    document.querySelectorAll('.amazon-store-picker[open]').forEach(function (other) {
      if (other !== picker) other.open = false;
    });
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      picker.open = false;
    });
  });
});

// ─── BOOK SHOWCASE MARQUEE ──────────────────────────────
document.querySelectorAll('.book-showcase-track').forEach(function (track) {
  var items = Array.from(track.children);
  items.forEach(function (item) {
    var clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('tabindex', '-1');
    track.appendChild(clone);
  });
});
