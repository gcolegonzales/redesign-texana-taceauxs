/* TexAna Taceauxs & More — redesign concept
   Polished, dependency-free interactions. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- current year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- sticky nav shrink on scroll ---- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (!nav) return;
    if (window.scrollY > 20) nav.classList.add('shrink');
    else nav.classList.remove('shrink');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var closeMenu = function () {
    if (!menu) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  var openMenu = function () {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  };
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (menu.hidden) openMenu(); else closeMenu();
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && !menu.hidden) closeMenu();
    });
  }

  /* ---- scroll reveal via IntersectionObserver ---- */
  var revealTargets = [
    '.section__head', '.board', '.special', '.extras',
    '.find__head', '.sched', '.live',
    '.story__art', '.story__copy',
    '.raves__head', '.rave',
    '.catering__pitch', '.catering__formwrap',
    '.visit__info', '.visit__map',
    '.hero__copy', '.hero__art'
  ];
  var nodes = [];
  revealTargets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (n) { nodes.push(n); });
  });

  if (reduce || !('IntersectionObserver' in window)) {
    nodes.forEach(function (n) { n.classList.add('reveal', 'in'); });
  } else {
    nodes.forEach(function (n, i) {
      n.classList.add('reveal');
      // small stagger within groups of siblings
      n.style.transitionDelay = ((i % 4) * 70) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---- drop-in real photos: if a file exists at data-src, use it ----
     Lets the owner drop real (FB/IG) photos into assets/photos/ and have
     them light up automatically. Falls back to the designed placeholder. */
  document.querySelectorAll('.js-photo').forEach(function (el) {
    var src = el.getAttribute('data-src');
    if (!src) return;
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.add('has-photo');
    };
    img.src = src;
  });

  /* ---- catering form (demo — not wired to a live inbox) ---- */
  var form = document.getElementById('cateringForm');
  var ok = document.getElementById('formOk');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (ok) {
        ok.hidden = false;
        ok.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }
      form.querySelector('button[type="submit"]').textContent = 'Sent — thank you!';
      form.querySelectorAll('input, textarea, button').forEach(function (f) {
        if (f.type !== 'submit') f.setAttribute('disabled', 'true');
      });
    });
  }
})();
