/* TexAna Taceauxs & More — redesign concept
   Polished, dependency-free interactions. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- current year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- sticky nav: shrink + hide-on-scroll-down / reveal-on-scroll-up ---- */
  var nav = document.getElementById('nav');
  var lastY = window.scrollY;
  var onScroll = function () {
    if (!nav) return;
    var y = window.scrollY;
    if (y > 20) nav.classList.add('shrink');
    else nav.classList.remove('shrink');

    // Reveal on ANY upward scroll; hide only when scrolling down past the header.
    if (menuOpen) {
      nav.classList.remove('nav--hidden');
    } else if (y > lastY && y > 90) {
      nav.classList.add('nav--hidden');      // scrolling down
    } else if (y < lastY) {
      nav.classList.remove('nav--hidden');   // scrolling up (even a few px)
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- mobile drawer menu ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var menuOpen = false;
  var scrim = null;

  if (toggle && menu) {
    // Relocate drawer + scrim OUT of the backdrop-filtered <header> so their
    // position:fixed resolves against the viewport (full-height, no bottom gap).
    scrim = document.createElement('div');
    scrim.className = 'nav-scrim';
    scrim.setAttribute('hidden', '');
    document.body.appendChild(scrim);
    document.body.appendChild(menu);
    menu.hidden = false; // visibility now controlled by transform/.open, not [hidden]

    // Everything in <body> except the drawer + scrim gets inerted while open.
    var bgTargets = [];
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el !== menu && el !== scrim) bgTargets.push(el);
    });
    var setBackgroundInert = function (on) {
      bgTargets.forEach(function (el) {
        if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
        else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
      });
    };
    // When closed (or on desktop), keep off-canvas links out of the tab order.
    var setDrawerInert = function (on) {
      if (on) menu.setAttribute('inert', '');
      else menu.removeAttribute('inert');
    };
    var focusables = function () {
      return Array.prototype.filter.call(
        menu.querySelectorAll('a[href],button:not([disabled])'),
        function (el) { return el.offsetParent !== null || el === document.activeElement; }
      );
    };

    var lastFocused = null;

    var closeMenu = function (returnFocus) {
      menuOpen = false;
      menu.classList.remove('open');
      scrim.classList.remove('open');
      setBackgroundInert(false);
      setDrawerInert(true);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      if (returnFocus !== false && lastFocused) { try { lastFocused.focus(); } catch (e) {} }
      window.setTimeout(function () { if (!menuOpen) scrim.setAttribute('hidden', ''); }, 320);
    };
    var openMenu = function () {
      menuOpen = true;
      lastFocused = toggle;
      scrim.removeAttribute('hidden');
      // force reflow so the transition runs from the hidden state
      void scrim.offsetWidth;
      setDrawerInert(false);
      menu.classList.add('open');
      scrim.classList.add('open');
      nav.classList.remove('nav--hidden');
      setBackgroundInert(true);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      // Move focus into the drawer (close button, then first link).
      var f = menu.querySelector('#mobileClose') || focusables()[0];
      if (f) { try { f.focus(); } catch (e) {} }
    };

    // Start closed → drawer must not be reachable by Tab.
    setDrawerInert(true);

    toggle.addEventListener('click', function () {
      if (menuOpen) closeMenu(); else openMenu();
    });
    // In-panel close button — lives inside the top-most drawer layer, so it is
    // always tappable on touch even when the panel paints over the header toggle.
    var panelClose = menu.querySelector('#mobileClose');
    if (panelClose) panelClose.addEventListener('click', function () { closeMenu(); });
    scrim.addEventListener('click', function () { closeMenu(); });
    menu.querySelectorAll('a').forEach(function (a) {
      // Nav-link tap: let navigation proceed, restore state but don't steal focus.
      a.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!menuOpen) return;
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key === 'Tab') {
        var items = focusables();
        if (!items.length) { e.preventDefault(); return; }
        var first = items[0], last = items[items.length - 1];
        var active = document.activeElement;
        if (e.shiftKey && (active === first || !menu.contains(active))) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && (active === last || !menu.contains(active))) {
          e.preventDefault(); first.focus();
        }
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) {
        if (menuOpen) closeMenu(false);
        // Ensure a clean desktop state: drawer not tabbable, toggle collapsed.
        setDrawerInert(true);
        setBackgroundInert(false);
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  onScroll();

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
  // Event date can't be in the past — set min to today (local time).
  var dateField = form && form.querySelector('input[name="date"]');
  if (dateField) {
    var now = new Date();
    var iso = now.getFullYear() + '-' +
      ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
      ('0' + now.getDate()).slice(-2);
    dateField.setAttribute('min', iso);
  }
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
