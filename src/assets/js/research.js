/**
 * research.js — Research page behavior.
 *
 * The lists themselves are rendered at build time (src/_data/research.js +
 * src/research.njk). This script (1) animates the <details> open/close by
 * transitioning the .abstract-wrap height, (2) opens the paper addressed by
 * the URL hash (e.g. /research/#bw_spillovers, linked from the home page),
 * and (3) drives the sticky section nav: measures its height into --subnav-h,
 * marks the current section, and flags when it is stuck. Without JS, the
 * native <details> toggle and plain anchor links still work.
 */

(function () {
  function wireAnimations(root) {
    root.querySelectorAll('details.paper').forEach((details) => {
      const summary = details.querySelector('summary.paper-toggle');
      const wrap = details.querySelector('.abstract-wrap');
      if (!summary || !wrap) return;

      let state = details.hasAttribute('open') ? 'open' : 'closed';
      wrap.style.display = 'block';
      if (state === 'open') {
        wrap.style.height = 'auto';
        wrap.style.opacity = '1';
        wrap.style.transform = 'translateY(0)';
      } else {
        wrap.style.height = '0px';
        wrap.style.opacity = '0';
        wrap.style.transform = 'translateY(-2px)';
      }

      summary.setAttribute('aria-expanded', state === 'open' ? 'true' : 'false');

      let animTimer = null;
      const clearTimer = () => { if (animTimer) { clearTimeout(animTimer); animTimer = null; } };

      const onEnd = (e) => {
        if (e && e.target !== wrap) return;
        if (e && e.propertyName && e.propertyName !== 'height') return;
        clearTimer();
        wrap.removeEventListener('transitionend', onEnd);
        if (state === 'opening') {
          wrap.style.height = 'auto';
          state = 'open';
        } else if (state === 'closing') {
          details.removeAttribute('open');
          state = 'closed';
        }
      };

      const openAnim = () => {
        state = 'opening';
        details.setAttribute('open', '');
        wrap.style.height = 'auto';
        const end = wrap.scrollHeight;
        wrap.style.height = '0px';
        wrap.style.opacity = '0';
        wrap.style.transform = 'translateY(-2px)';
        void wrap.offsetWidth;
        wrap.addEventListener('transitionend', onEnd);
        wrap.style.height = end + 'px';
        wrap.style.opacity = '1';
        wrap.style.transform = 'translateY(0)';
        animTimer = setTimeout(onEnd, 400);
      };

      const closeAnim = () => {
        state = 'closing';
        const start = wrap.scrollHeight;
        wrap.style.height = start + 'px';
        void wrap.offsetWidth;
        wrap.addEventListener('transitionend', onEnd);
        wrap.style.height = '0px';
        wrap.style.opacity = '0';
        wrap.style.transform = 'translateY(-2px)';
        animTimer = setTimeout(onEnd, 400);
      };

      summary.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          summary.click();
        }
      });

      summary.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (state === 'opening' || state === 'closing') return;
        if (state === 'closed') {
          openAnim();
          summary.setAttribute('aria-expanded', 'true');
        } else if (state === 'open') {
          closeAnim();
          summary.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function paperFromHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return null;
    const el = document.getElementById(id);
    return el && el.matches('details.paper') ? el : null;
  }

  function wireSectionNav() {
    const nav = document.querySelector('.section-nav');
    const header = document.querySelector('.site-header');
    if (!nav) return;

    const pairs = Array.from(nav.querySelectorAll('a[href^="#"]'))
      .map((a) => ({ a, target: document.getElementById(a.getAttribute('href').slice(1)) }))
      .filter((p) => p.target);
    if (!pairs.length) return;

    const measure = () => {
      document.documentElement.style.setProperty('--subnav-h', nav.offsetHeight + 'px');
    };

    const update = () => {
      const headerH = header ? header.offsetHeight : 0;
      const line = headerH + nav.offsetHeight + 16;
      let current = null;
      for (const p of pairs) {
        if (p.target.getBoundingClientRect().top <= line) current = p;
        else break;
      }
      // At the very bottom the last section is current even if its heading
      // never reaches the top of the viewport.
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        current = pairs[pairs.length - 1];
      }
      pairs.forEach((p) => p.a.classList.toggle('is-current', p === current));
      nav.classList.toggle('is-stuck', window.scrollY > 0 && nav.getBoundingClientRect().top <= headerH + 0.5);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; update(); });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { measure(); update(); });
    measure();
    update();
  }

  function init() {
    wireSectionNav();

    // Open the linked paper before wiring so it renders open without animating.
    const target = paperFromHash();
    if (target) target.setAttribute('open', '');

    wireAnimations(document);

    // In-page hash changes (e.g. a link to another paper): animate open.
    window.addEventListener('hashchange', () => {
      const el = paperFromHash();
      if (el && !el.hasAttribute('open')) {
        el.querySelector('summary.paper-toggle').click();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
