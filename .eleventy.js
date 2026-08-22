const { execSync } = require("child_process");

// "Last updated" = the later of the last commits touching these files.
// Needs full git history (fetch-depth: 0 in the deploy workflow); falls back
// to the build date if git is unavailable.
const CONTENT_FILES = ["src/assets/xml/research.xml", "src/assets/CV/CV.pdf"];

function lastContentUpdate() {
  let latest = 0;
  for (const p of CONTENT_FILES) {
    try {
      const out = execSync(`git log -1 --format=%ct -- "${p}"`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"]
      }).trim();
      if (out) latest = Math.max(latest, Number(out) * 1000);
    } catch (e) {
      // not a git checkout, or git missing
    }
  }
  return latest ? new Date(latest) : new Date();
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/CV/CV.pdf": "docs/CV.pdf" });

  eleventyConfig.addPassthroughCopy({ "src/apple-touch-icon.png": "apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-16x16.png": "favicon-16x16.png" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-32x32.png": "favicon-32x32.png" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });

  // research.xml is parsed at build time by src/_data/research.js
  eleventyConfig.addWatchTarget("src/assets/xml/research.xml");

  eleventyConfig.addShortcode("lastUpdated", function() {
    // Month Year (e.g., "August 2025")
    return new Intl.DateTimeFormat("en", {
      month: "long", year: "numeric", timeZone: "Europe/Copenhagen"
    }).format(lastContentUpdate());
  });
  
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
