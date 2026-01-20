/**
 * research.js — Research page renderer (with animated abstracts)
 * Sections (order): <pub>, <wp>, <wip>, <other_pub>, <rip>
 * - Sorts each section by <date> descending. Undated => bottom.
 * - Publications: Journal block is "vol(issue), pages, Month Year" (date last, with comma).
 * - Only Title is bold; only Journal is bold-italic; other text normal weight.
 * - Notes/Abstract preserve any HTML from XML.
 * - Each summary ends with a final period if missing.
 * - Abstract expansion animates page reflow (height transition via JS).
 */

(function () {
  // ---------- XML helpers ----------
  function loadXMLDoc(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.send();
    return xhr.responseXML;
  }

  function getText(node, tag) {
    var el = node.getElementsByTagName(tag)[0];
    return el ? (el.textContent || "").trim() : "";
  }

  function htmlOrText(node, tag) {
    var el = node.getElementsByTagName(tag)[0];
    if (!el) return "";
    if (!el.children || el.children.length === 0) return (el.textContent || "").trim();
    return el.innerHTML.trim();
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function resolvePath(path, type) {
    if (!path) return "";
    // Already absolute (starts with / or http)
    if (path.startsWith("/") || path.startsWith("http")) return path;
    // Otherwise prepend default folder
    if (type === "doc") return "/assets/papers/" + path;
    if (type === "replication") return "/assets/replication/" + path;
    return path;
  }

  // ---------- Date parsing / formatting ----------
  var MONTHS = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11
  };

  function parseDateValue(s) {
    // UTC timestamp for sorting; invalid/missing => -Infinity
    if (!s) return -Infinity;
    s = s.trim();

    // YYYY or YYYY-MM or YYYY-MM-DD
    var m = s.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
    if (m) {
      var y = +m[1];
      var mo = m[2] ? (+m[2] - 1) : 0;
      var d = m[3] ? +m[3] : 1;
      return Date.UTC(y, mo, d);
    }

    // Month YYYY or Mon YYYY
    var m2 = s.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
    if (m2) {
      var key = m2[1].toLowerCase();
      var y2 = +m2[2];
      if (MONTHS.hasOwnProperty(key)) {
        return Date.UTC(y2, MONTHS[key], 1);
      }
    }

    // Fallback
    var t = Date.parse(s);
    return isNaN(t) ? -Infinity : t;
  }

  function monthYearFull(s) {
    if (!s) return "";
    var ts = parseDateValue(s);
    if (ts === -Infinity) return s; // unknown format, leave as-is
    var d = new Date(ts);
    var mon = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ][d.getUTCMonth()];
    return mon + " " + d.getUTCFullYear();
  }

  // ---------- Summary line formatters ----------
  function ensureFinalPeriod(str) {
    return /\.\s*$/.test(str) ? str : (str + ".");
  }

  function linePub(it) {
    // **Title** (with Coauthors). **_Journal_** vol(issue), pages, Month Year.
    var title = getText(it, "title") || "(Untitled)";
    var co    = getText(it, "coauthors");
    var jrnl  = getText(it, "journal");
    var voli  = getText(it, "vol_issue");
    var date  = monthYearFull(getText(it, "date"));
    var pages = getText(it, "pages");
    var notes = htmlOrText(it, "notes");

    var s = "<strong>" + escapeHTML(title) + "</strong>";
    if (co) s += " (with " + escapeHTML(co) + ")";

    var parts = [];
    if (jrnl) parts.push("<strong><em>" + escapeHTML(jrnl) + "</em></strong>");

    // Build "vol(issue), pages" as one block, then append date with a comma
    var volIssuePages = "";
    if (voli) volIssuePages += escapeHTML(voli);
    if (pages) {
      if (volIssuePages) volIssuePages += ", ";
      volIssuePages += escapeHTML(pages);
    }
    if (volIssuePages) parts.push(volIssuePages);

    // Append date at the very end, with a comma before it
    if (date) {
      if (parts.length > 0) {
        parts[parts.length - 1] += ", " + escapeHTML(date);
      } else {
        parts.push(escapeHTML(date));
      }
    }

    if (parts.length) s += ". " + parts.join(" ") + ".";
    if (notes) s += " " + notes;

    return ensureFinalPeriod(s.trim());
  }

  function lineWP(it) {
    // **Title** (with X). Month Year. NOTES
    var title = getText(it, "title") || "(Untitled)";
    var co    = getText(it, "coauthors");
    var date  = monthYearFull(getText(it, "date"));
    var notes = htmlOrText(it, "notes");

    var s = "<strong>" + escapeHTML(title) + "</strong>";
    if (co) s += " (with " + escapeHTML(co) + ")";
    if (date) s += ". " + escapeHTML(date) + ".";
    if (notes) s += " " + notes;

    return ensureFinalPeriod(s.trim());
  }

  function lineWIP(it) {
    // **Title** (with X). NOTES
    var title = getText(it, "title") || "(Untitled)";
    var co    = getText(it, "coauthors");
    var notes = htmlOrText(it, "notes");

    var s = "<strong>" + escapeHTML(title) + "</strong>";
    if (co) s += " (with " + escapeHTML(co) + ")";
    if (notes) s += " " + notes;

    return ensureFinalPeriod(s.trim());
  }

  function buttons(it) {
    var doc = getText(it, "doc");
    var rep = getText(it, "replication");
    if (!doc && !rep) return "";
    var out = '<div class="abs-actions">';
    if (doc) {
      const docPath = resolvePath(doc, "doc");
      out += '<a class="btn btn-abs btn-doc" href="' + encodeURI(docPath) + '" target="_blank" rel="noopener">' +
            /* '<i class="ai ai-doi" aria-hidden="true"></i><span>Paper</span>' + */
            /* '<i class="fa-regular fa-file-pdf" aria-hidden="true"></i><span>Paper</span>' + */
            featherPdfSVG() + '<span>Paper</span>' +
            '</a>';
    }
    if (rep) {
      const repPath = resolvePath(rep, "replication");
      out += '<a class="btn btn-abs btn-rep" href="' + encodeURI(repPath) + '" target="_blank" rel="noopener">' +
            /* '<i class="fa-solid fa-code-compare" aria-hidden="true"></i><span>Replication package</span>' + */
            featherCodeCompareSVG() + '<span>Replication package</span>' +
            '</a>';
    }
    out += '</div>';
    return out;
  }

  // ---------- Sorting + rendering ----------
  function collectSorted(xml, tag) {
    var list = Array.from(xml.getElementsByTagName(tag) || []);
    return list
      .map(function (node) { return { node: node, key: parseDateValue(getText(node, "date")) }; })
      .sort(function (a, b) {
        if (a.key === b.key) {
          var ta = (getText(a.node, "title") || "").toLowerCase();
          var tb = (getText(b.node, "title") || "").toLowerCase();
          return tb.localeCompare(ta);
        }
        return b.key - a.key; // newest first; undated last
      })
      .map(function (x) { return x.node; });
  }

  function renderList(xml, tag, mountId, formatter) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const items = collectSorted(xml, tag);
    let html = "";

    for (const it of items) {
      const summary = formatter(it);
      const abs = htmlOrText(it, "abstract");

      if (abs) {
        // Toggleable entry (has abstract)
        html += `<details class="paper">
          <summary class="paper-toggle" role="button" tabindex="0" aria-expanded="false">
            <span class="paper-title-inline">${summary}</span>
            <span class="chev2" aria-hidden="true"></span>
          </summary>
          <div class="abstract-wrap">
            <div class="abstract-card">
              <div class="abstract-body">${abs}</div>
              ${buttons(it)}
            </div>
          </div>
        </details>`;
      } else {
        // Static entry (no abstract) — no <details>, no chevron, no click
        html += `<div class="paper no-abstract">
          <div class="paper-toggle">
            <span class="paper-title-inline">${summary}</span>
          </div>
        </div>`;
      }
    }

    mount.innerHTML = html;

    // Enable animations only for toggleable entries
    wireAnimations(mount);
  }

  // ---------- Animated height (page reflow) ----------
  function wireAnimations(root) {
    root.querySelectorAll('details.paper').forEach((details) => {
      const summary = details.querySelector('summary.paper-toggle');
      const wrap = details.querySelector('.abstract-wrap');
      if (!summary || !wrap) return;

      // Baseline state
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
          // settle to auto
          wrap.style.height = 'auto';
          state = 'open';
        } else if (state === 'closing') {
          // finished closing
          details.removeAttribute('open');
          state = 'closed';
        }
      };

      const openAnim = () => {
        state = 'opening';
        details.setAttribute('open', ''); // so [open] CSS (chevron) applies immediately
        // measure end height
        wrap.style.height = 'auto';
        const end = wrap.scrollHeight;
        wrap.style.height = '0px';
        wrap.style.opacity = '0';
        wrap.style.transform = 'translateY(-2px)';
        // force layout
        void wrap.offsetWidth;
        // animate
        wrap.addEventListener('transitionend', onEnd);
        wrap.style.height = end + 'px';
        wrap.style.opacity = '1';
        wrap.style.transform = 'translateY(0)';
        // fallback if transitionend is missed
        animTimer = setTimeout(onEnd, 400);
      };

      const closeAnim = () => {
        state = 'closing';
        // lock current height (auto -> px)
        const start = wrap.scrollHeight;
        wrap.style.height = start + 'px';
        // force layout
        void wrap.offsetWidth;
        // animate to 0
        wrap.addEventListener('transitionend', onEnd);
        wrap.style.height = '0px';
        wrap.style.opacity = '0';
        wrap.style.transform = 'translateY(-2px)';
        // fallback
        animTimer = setTimeout(onEnd, 400);
      };

      // Keyboard activation (Enter/Space)
      summary.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          summary.click();
        }
      });

      summary.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (state === 'opening' || state === 'closing') return; // ignore while animating
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

  // ---------- Feather icons ---------- 

  function featherCodeCompareSVG() {
  return `
    <svg class="icon-feather" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>`;
  }

  function featherPdfSVG() {
  return `
    <svg class="icon-feather" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
      <line x1="9" y1="11" x2="11.5" y2="11"/>
      <line x1="13" y1="11" x2="15" y2="11"/>
    </svg>`;
  }

  // ---------- Hero + headings ----------
  function ensureHero() {
    // var hero = document.querySelector(".hero");
    // if (!hero) return;
    // hero.innerHTML =
    //   '<div class="hero-overlay">' +
    //     '<div class="hero-title">RESEARCH</div>' +
    //     '<div class="hero-subtitle"><em>Please click on the titles for more information</em></div>' +
    //   '</div>';
    // No-op: hero title/subtitle are rendered by base.njk from front matter.
  }

  function ensureHeadings() {
    var container = document.querySelector(".container");
    if (!container) return;

    var sections = [
      ["pubs", "Publications"],
      ["wp", "Working papers"],
      ["wip", "Work in progress"],
      ["other_pubs", "Other publications"],
      ["rip", "Permanent Working Papers (RIP)"]
    ];

    var root = document.createElement("div");
    root.className = "research-root";
    sections.forEach(function (pair) {
      var id = pair[0], title = pair[1];
      var sec = document.createElement("section");
      sec.className = "research-section";
      sec.innerHTML =
        '<section class="research-section" aria-labelledby="' + id + '-heading">' +
        '<h2 id="' + id + '-heading" class="section-title-lg">' + title + '</h2>' +
        '<div class="section-underline"></div>' +
        '<div id="' + id + '" class="section-list"></div>' +
      '</section>';
      // sec.innerHTML =
      //   '<h2 class="section-title-lg">' + title + '</h2>' +
      //   '<div class="section-underline"></div>' +
      //   '<div id="' + id + '" class="section-list"></div>';
      root.appendChild(sec);
    });

    container.innerHTML = "";
    container.appendChild(root);
  }

  // ---------- Init ----------
  function init() {
    document.body.classList.add("is-research");
    // ensureHero();
    ensureHeadings();

    var xml = loadXMLDoc("/assets/xml/research.xml");

    renderList(xml, "pub",        "pubs",       linePub);
    renderList(xml, "wp",         "wp",         lineWP);
    renderList(xml, "wip",        "wip",        lineWIP);
    renderList(xml, "other_pub",  "other_pubs", linePub);
    renderList(xml, "rip",        "rip",        lineWP);

    // Trigger fade-in animations after content is injected
    requestAnimationFrame(() => {
      document.querySelectorAll('#pubs, #wp, #wip, #other_pubs, #rip').forEach(el => {
        el.classList.add('fade-in');
      });
    });
  }

  window.addEventListener("load", init);
})();