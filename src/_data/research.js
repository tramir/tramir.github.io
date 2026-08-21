/**
 * research.js — Eleventy global data: parses src/assets/xml/research.xml at
 * build time and exposes ready-to-render lists.
 *
 * Exposed as `research` in templates:
 *   research.sections  — [{ id, title, items }] in display order
 *                        (wp, wip, pubs, other_pubs)
 *   research.featured  — { pubs: [...], wp: [...] } for the home page
 *
 * Each item: { id, citation, short, abstract, doc, replication, doi, featured }
 *   citation — full HTML line for the research page (title bold, journal
 *              bold-italic, "vol(issue), pages, Month Year", notes)
 *   short    — compact HTML line for the home page (year only)
 *   abstract — HTML (from CDATA); empty string if none
 *
 * Conventions (same as the previous client-side renderer):
 * - Each section is sorted by <date> descending; undated entries go last;
 *   ties broken by title A-Z.
 * - <date> accepts "YYYY", "YYYY-MM", "YYYY-MM-DD", "Month YYYY", or
 *   "D Month YYYY". Year-only and day-level dates display as written.
 * - Any HTML inside <notes> or <abstract> must be wrapped in CDATA.
 * - <doc> is a file name in src/assets/papers/ (or an absolute URL);
 *   <replication> is a file name in src/assets/replication/ (or a URL).
 * - <featured/> or <featured>true</featured> marks a <pub>/<wp> for the
 *   home page. Featured working papers are capped at MAX_FEATURED_WP.
 */

const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");

const XML_PATH = path.join(__dirname, "..", "assets", "xml", "research.xml");
const MAX_FEATURED_WP = 3;

// ---------- Helpers ----------
function text(v) {
  return v == null ? "" : String(v).trim();
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resolvePath(p, type) {
  if (!p) return "";
  if (p.startsWith("/") || p.startsWith("http")) return p;
  if (type === "doc") return "/assets/papers/" + p;
  if (type === "replication") return "/assets/replication/" + p;
  return p;
}

// ---------- Dates ----------
const MONTHS = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
  apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
  aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11
};
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function parseDateValue(s) {
  if (!s) return -Infinity;
  s = s.trim();

  // YYYY, YYYY-MM, YYYY-MM-DD
  let m = s.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
  if (m) return Date.UTC(+m[1], m[2] ? +m[2] - 1 : 0, m[3] ? +m[3] : 1);

  // Month YYYY
  m = s.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (m && MONTHS.hasOwnProperty(m[1].toLowerCase())) {
    return Date.UTC(+m[2], MONTHS[m[1].toLowerCase()], 1);
  }

  // D Month YYYY (day-level, e.g. dailies)
  m = s.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/);
  if (m && MONTHS.hasOwnProperty(m[2].toLowerCase())) {
    return Date.UTC(+m[3], MONTHS[m[2].toLowerCase()], +m[1]);
  }

  const t = Date.parse(s);
  return isNaN(t) ? -Infinity : t;
}

function monthYearFull(s) {
  if (!s) return "";
  s = s.trim();
  if (/^\d{4}$/.test(s)) return s; // year-only: don't invent a month
  if (/^\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}$/.test(s)) return s; // day-level: as written
  const ts = parseDateValue(s);
  if (ts === -Infinity) return s;
  const d = new Date(ts);
  return MONTH_NAMES[d.getUTCMonth()] + " " + d.getUTCFullYear();
}

function yearOnly(s) {
  const m = (s || "").match(/(\d{4})/);
  return m ? m[1] : "";
}

// ---------- Citation formatters ----------
function ensureFinalPeriod(str) {
  // Ignore trailing closing tags so "...text.</span>" counts as terminated.
  const stripped = str.replace(/(?:\s*<\/?[a-zA-Z][^>]*>)+\s*$/, "");
  return /[.!?]\s*$/.test(stripped) ? str : str + ".";
}

function titleAndCoauthors(it) {
  let s = "<strong>" + escapeHTML(it.title || "(Untitled)") + "</strong>";
  if (it.coauthors) s += " (with " + escapeHTML(it.coauthors) + ")";
  return s;
}

// **Title** (with Coauthors). **_Journal_** vol(issue), pages, Month Year. Notes.
function linePub(it) {
  let s = titleAndCoauthors(it);
  const parts = [];
  if (it.journal) parts.push("<strong><em>" + escapeHTML(it.journal) + "</em></strong>");

  let volIssuePages = "";
  if (it.vol_issue) volIssuePages += escapeHTML(it.vol_issue);
  if (it.pages) volIssuePages += (volIssuePages ? ", " : "") + escapeHTML(it.pages);
  if (volIssuePages) parts.push(volIssuePages);

  const date = monthYearFull(it.date);
  if (date) {
    if (parts.length) parts[parts.length - 1] += ", " + escapeHTML(date);
    else parts.push(escapeHTML(date));
  }

  if (parts.length) s += ". " + parts.join(" ") + ".";
  if (it.notes) s += " " + it.notes;
  return ensureFinalPeriod(s.trim());
}

// **Title** (with Coauthors). Month Year. Notes.
function lineWP(it) {
  let s = titleAndCoauthors(it);
  const date = monthYearFull(it.date);
  if (date) s += ". " + escapeHTML(date) + ".";
  if (it.notes) s += " " + it.notes;
  return ensureFinalPeriod(s.trim());
}

// **Title** (with Coauthors). Notes.
function lineWIP(it) {
  let s = titleAndCoauthors(it);
  if (it.notes) s += " " + it.notes;
  return ensureFinalPeriod(s.trim());
}

// Home page: **Title** (with Coauthors). _Journal_, Year.
function shortPub(it) {
  let s = titleAndCoauthors(it) + ".";
  const year = yearOnly(it.date);
  if (it.journal) {
    s += " <em>" + escapeHTML(it.journal) + "</em>";
    if (year) s += ", " + year;
    s += ".";
  } else if (year) {
    s += " " + year + ".";
  }
  return s;
}

// Home page: **Title** (with Coauthors). Month Year.
function shortWP(it) {
  let s = titleAndCoauthors(it) + ".";
  const date = monthYearFull(it.date);
  if (date) s += " " + escapeHTML(date) + ".";
  return s;
}

// ---------- Normalization ----------
function isFeatured(node) {
  if (!("featured" in node)) return false;
  const v = text(node.featured).toLowerCase();
  return !(v === "false" || v === "no" || v === "0");
}

function normalize(node, kind) {
  const it = {
    id: text(node.id),
    title: text(node.title),
    coauthors: text(node.coauthors),
    journal: text(node.journal),
    vol_issue: text(node.vol_issue),
    pages: text(node.pages),
    date: text(node.date),
    notes: text(node.notes),
    abstract: text(node.abstract),
    doc: resolvePath(text(node.doc), "doc"),
    replication: resolvePath(text(node.replication), "replication"),
    doi: text(node.doi),
    featured: isFeatured(node)
  };
  it.sortKey = parseDateValue(it.date);
  it.citation = kind === "wip" ? lineWIP(it) : kind === "wp" ? lineWP(it) : linePub(it);
  it.short = kind === "wp" ? shortWP(it) : shortPub(it);
  return it;
}

function sorted(items) {
  return items.slice().sort((a, b) => {
    if (a.sortKey === b.sortKey) {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    return b.sortKey - a.sortKey;
  });
}

// ---------- Build ----------
module.exports = function () {
  const parser = new XMLParser({
    ignoreAttributes: true,
    parseTagValue: false, // keep "2011", "64" etc. as strings
    trimValues: true,
    isArray: (name) => ["pub", "wp", "wip", "other_pub"].includes(name)
  });

  const raw = parser.parse(fs.readFileSync(XML_PATH, "utf8")).research_info || {};
  const lists = {
    wp: sorted((raw.wp || []).map((n) => normalize(n, "wp"))),
    wip: sorted((raw.wip || []).map((n) => normalize(n, "wip"))),
    pubs: sorted((raw.pub || []).map((n) => normalize(n, "pub"))),
    other_pubs: sorted((raw.other_pub || []).map((n) => normalize(n, "pub")))
  };

  return {
    sections: [
      { id: "wp", title: "Working papers", items: lists.wp },
      { id: "wip", title: "Work in progress", items: lists.wip },
      { id: "pubs", title: "Publications", items: lists.pubs },
      { id: "other_pubs", title: "Other publications", items: lists.other_pubs }
    ],
    featured: {
      pubs: lists.pubs.filter((it) => it.featured),
      wp: lists.wp.filter((it) => it.featured).slice(0, MAX_FEATURED_WP)
    }
  };
};
