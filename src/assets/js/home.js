/**
 * home.js — Render featured publications and working papers on the home page.
 *
 * Reads /assets/xml/research.xml and pulls any <pub> or <wp> entry that contains
 * a <featured> child element (any truthy value or even just <featured/>).
 *
 * Mount points (in index.njk):
 *   <div id="featured-pubs"></div>
 *   <div id="featured-wp"></div>
 *
 * Sort: by date descending (same convention as research.js).
 * If a section has no featured items, its column is hidden.
 */

(function () {
  // ---------- Config ----------
  // Maximum number of featured working papers to show. Set to null/Infinity for no cap.
  // Featured publications are not capped (they tend to be a curated short list anyway).
  var MAX_WP = 3;

  // ---------- XML helpers ----------
  function getText(node, tag) {
    var el = node.getElementsByTagName(tag)[0];
    return el ? (el.textContent || "").trim() : "";
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function isFeatured(node) {
    var el = node.getElementsByTagName("featured")[0];
    if (!el) return false;
    var txt = (el.textContent || "").trim().toLowerCase();
    // Treat any of: <featured/>, <featured>true</featured>, <featured>yes</featured>,
    // <featured>1</featured> as featured. Explicit "false"/"no"/"0" excludes.
    if (txt === "false" || txt === "no" || txt === "0") return false;
    return true;
  }

  // ---------- Date parsing ----------
  var MONTHS = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, sept: 8, september: 8,
    oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
  };

  function parseDateValue(s) {
    if (!s) return -Infinity;
    s = s.trim();
    var m = s.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
    if (m) return Date.UTC(+m[1], m[2] ? +m[2] - 1 : 0, m[3] ? +m[3] : 1);
    var m2 = s.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
    if (m2) {
      var key = m2[1].toLowerCase();
      if (MONTHS.hasOwnProperty(key)) return Date.UTC(+m2[2], MONTHS[key], 1);
    }
    var t = Date.parse(s);
    return isNaN(t) ? -Infinity : t;
  }

  function yearOnly(s) {
    if (!s) return "";
    var m = s.match(/(\d{4})/);
    return m ? m[1] : "";
  }

  function monthYearFull(s) {
    if (!s) return "";
    var ts = parseDateValue(s);
    if (ts === -Infinity) return s;
    var d = new Date(ts);
    var mon = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ][d.getUTCMonth()];
    return mon + " " + d.getUTCFullYear();
  }

  // ---------- Formatters ----------
  function formatPub(it) {
    var title = getText(it, "title") || "(Untitled)";
    var co    = getText(it, "coauthors");
    var jrnl  = getText(it, "journal");
    var year  = yearOnly(getText(it, "date"));

    var s = "<strong>" + escapeHTML(title) + "</strong>";
    if (co) s += " (with " + escapeHTML(co) + ")";
    s += ".";
    if (jrnl) {
      s += " <em>" + escapeHTML(jrnl) + "</em>";
      if (year) s += ", " + year;
      s += ".";
    } else if (year) {
      s += " " + year + ".";
    }
    return s;
  }

  function formatWp(it) {
    var title = getText(it, "title") || "(Untitled)";
    var co    = getText(it, "coauthors");
    var date  = monthYearFull(getText(it, "date"));

    var s = "<strong>" + escapeHTML(title) + "</strong>";
    if (co) s += " (with " + escapeHTML(co) + ")";
    s += ".";
    if (date) s += " " + escapeHTML(date) + ".";
    return s;
  }

  // ---------- Render ----------
  function renderFeatured(xml, tag, mountId, formatter, max) {
    var mount = document.getElementById(mountId);
    if (!mount) return;

    var items = Array.from(xml.getElementsByTagName(tag) || [])
      .filter(isFeatured)
      .map(function (node) { return { node: node, key: parseDateValue(getText(node, "date")) }; })
      .sort(function (a, b) { return b.key - a.key; })
      .map(function (x) { return x.node; });

    if (typeof max === "number" && isFinite(max) && max >= 0) {
      items = items.slice(0, max);
    }

    if (items.length === 0) {
      // Hide this whole column if nothing is featured.
      var col = mount.closest(".featured-col");
      if (col) col.style.display = "none";
      return;
    }

    var html = "";
    items.forEach(function (it) {
      html += '<div class="featured-item">' + formatter(it) + "</div>";
    });
    mount.innerHTML = html;
  }

  // ---------- Init ----------
  async function init() {
    if (!document.getElementById("featured-pubs") &&
        !document.getElementById("featured-wp")) {
      return; // not on the home page
    }
    try {
      var resp = await fetch("/assets/xml/research.xml", { cache: "no-cache" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      var text = await resp.text();
      var xml = new DOMParser().parseFromString(text, "application/xml");
      if (xml.getElementsByTagName("parsererror").length) {
        throw new Error("XML parse error");
      }
      renderFeatured(xml, "pub", "featured-pubs", formatPub);
      renderFeatured(xml, "wp", "featured-wp", formatWp, MAX_WP);

      // If both columns end up empty, hide the whole featured section
      // so the page doesn't show empty section headings.
      var section = document.querySelector(".featured-section");
      if (section) {
        var anyVisible = section.querySelectorAll(".featured-col:not([style*='display: none'])").length > 0;
        if (!anyVisible) section.style.display = "none";
      }
    } catch (err) {
      console.error("Failed to load featured items:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();