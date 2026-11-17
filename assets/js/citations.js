'use strict';

// Publications page: h-index and citation count from INSPIRE-HEP.
// The numbers in the HTML are a fallback; on load they are refreshed from
// INSPIRE's citation summary, using the "all" figures so preprints count.
// When the Publications page is shown, the counters count up to their values.

(function () {
  const section = document.querySelector("[data-citation-stats]");
  const page = document.querySelector('[data-page="publications"]');
  if (!section || !page) return;

  const AUTHOR = "Jose.Ricardo.Correia.1";
  const URL = "https://inspirehep.net/api/literature/facets?facet_name=citation-summary&q=" +
    encodeURIComponent("a " + AUTHOR);

  const fields = {
    "h-index": section.querySelector('[data-stat="h-index"]'),
    "citations": section.querySelector('[data-stat="citations"]')
  };
  const updated = section.querySelector("[data-stat-updated]");
  const values = {};
  Object.keys(fields).forEach(function (k) { values[k] = Number(fields[k].textContent) || 0; });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const countUp = function () {
    Object.keys(fields).forEach(function (k) {
      const el = fields[k];
      const target = values[k];
      if (reduceMotion || !target) { el.textContent = target; return; }
      el.textContent = 0;
      const start = performance.now();
      const duration = 1200;
      const step = function (now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      // Make sure the final value lands even if animation frames are paused.
      setTimeout(function () { el.textContent = values[k]; }, duration + 100);
    });
  };

  // Count up each time the Publications page is opened.
  new MutationObserver(function () {
    if (page.classList.contains("active")) countUp();
  }).observe(page, { attributes: true, attributeFilter: ["class"] });

  fetch(URL, { headers: { Accept: "application/json" } })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      const summary = data.aggregations.citation_summary;
      const h = summary["h-index"].value.all;
      const c = summary.citations.buckets.all.citations_count.value;
      if (typeof h !== "number" || typeof c !== "number") return;
      values["h-index"] = h;
      values["citations"] = Math.round(c);
      fields["h-index"].textContent = values["h-index"];
      fields["citations"].textContent = values["citations"];
      if (updated) updated.textContent = ", updated " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      if (page.classList.contains("active")) countUp();
    })
    .catch(function () { /* keep the fallback numbers */ });
})();
