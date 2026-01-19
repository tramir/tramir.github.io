module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addShortcode("buildDate", function() {
    const d = new Date();
    // Month Year (e.g., "August 2025")
    return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(d);
  });
  
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
