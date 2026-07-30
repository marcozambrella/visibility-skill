#!/usr/bin/env node
/**
 * audit-page.mjs — static visibility audit for built HTML.
 *
 * Usage:
 *   node audit-page.mjs ./dist                 audit every .html file in a directory
 *   node audit-page.mjs https://example.com/   audit one live page
 *   node audit-page.mjs ./dist --json          machine-readable output
 *   node audit-page.mjs ./dist --quiet         only errors and warnings
 *   node audit-page.mjs ./dist --ignore=noindex
 *
 * `--ignore` takes a comma-separated list of finding codes and downgrades them
 * to info. Use it for findings that are deliberate on this site — most often
 * `noindex` on pages gated until their content exists. The count of downgraded
 * findings is always reported, so nothing disappears silently.
 *
 * Exits 1 when any error-level finding is present, so it works as a deploy gate.
 * Node 22+, zero dependencies.
 *
 * Deliberate limitation: this parses HTML with regular expressions rather than a
 * DOM. That is adequate for the structural signals audited here and it keeps the
 * script dependency-free, but it will misread deliberately malformed markup. It
 * checks what is in the served HTML, which is exactly what non-JavaScript
 * crawlers see.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SEVERITY = { error: 0, warning: 1, info: 2 };
const LABEL = { error: "ERROR ", warning: "WARN  ", info: "INFO  " };

// Anchor text that tells a search engine nothing about the destination.
const VAGUE_ANCHORS = new Set([
  "click here", "here", "read more", "more", "link", "this", "learn more",
  "clicca qui", "qui", "leggi di più", "leggi di piu", "scopri di più",
  "scopri di piu", "vai", "continua", "maggiori informazioni",
  "cliquez ici", "en savoir plus", "hier klicken", "mehr erfahren",
  "haz clic aquí", "leer más",
]);

// Question openers across the languages this is most likely to be used on.
const QUESTION_WORDS = /^(how|what|why|when|where|which|who|can|do|does|is|are|should|come|cosa|che cosa|perch[ée]|quando|dove|quale|quali|chi|quanto|quanta|quanti|quante|si pu[òo]|conviene|qu[ée]|c[óo]mo|por qu[ée]|cu[áa]nto|comment|pourquoi|combien|wie|was|warum|wann|wo)\b/i;

/* ------------------------------------------------------------------ *
 * HTML helpers
 * ------------------------------------------------------------------ */

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

function parseAttrs(raw) {
  const attrs = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    attrs[name] = value;
  }
  return attrs;
}

/** Void or self-closing elements: returns [{ attrs }]. */
function findVoid(html, tag) {
  const out = [];
  const re = new RegExp(`<${tag}\\b([^>]*)>`, "gi");
  let m;
  while ((m = re.exec(html)) !== null) out.push({ attrs: parseAttrs(m[1]) });
  return out;
}

/** Paired elements: returns [{ attrs, inner }]. Not nesting-aware by design. */
function findPaired(html, tag) {
  const out = [];
  const re = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, "gi");
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ attrs: parseAttrs(m[1]), inner: m[2] });
  }
  return out;
}

function findHeadings(html) {
  const out = [];
  const re = /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ level: Number(m[1]), text: toText(m[3]) });
  }
  return out;
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

function toText(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Visible body text, with script, style, noscript and template removed. */
function bodyText(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i);
  const source = body ? body[1] : html;
  return toText(
    source.replace(/<(script|style|noscript|template|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
  );
}

function isAbsoluteUrl(u) {
  return /^https?:\/\//i.test(u);
}

/* ------------------------------------------------------------------ *
 * Page audit
 * ------------------------------------------------------------------ */

function auditPage(rawHtml, ctx) {
  const findings = [];
  const add = (severity, code, message, detail) =>
    findings.push({ severity, code, message, detail });

  const html = stripComments(rawHtml);
  const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const head = headMatch ? headMatch[1] : html;

  const metas = findVoid(head, "meta");
  const links = findVoid(head, "link");
  const metaBy = (key, attr = "name") => {
    const found = metas.find(
      (m) => (m.attrs[attr] || "").toLowerCase() === key.toLowerCase()
    );
    return found ? (found.attrs.content ?? "") : null;
  };

  /* --- document basics --- */

  const htmlTag = html.match(/<html\b([^>]*)>/i);
  const lang = htmlTag ? parseAttrs(htmlTag[1]).lang : undefined;
  if (!lang) {
    add("error", "lang", "No lang attribute on <html>", "Search engines and screen readers use it to pick language rules.");
  }

  if (!metas.some((m) => "charset" in m.attrs) && !/charset=/i.test(head)) {
    add("warning", "charset", "No character encoding declared", "Add <meta charset=\"utf-8\"> as the first element of <head>.");
  }

  if (!metaBy("viewport")) {
    add("error", "viewport", "No viewport meta tag", "The page cannot be mobile-friendly without it, and mobile is the indexing baseline.");
  }

  /* --- title --- */

  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? toText(titleMatch[1]) : null;
  if (!title) {
    add("error", "title-missing", "No <title>", "The single highest-leverage element on the page.");
  } else {
    ctx.titles.push({ title, url: ctx.url });
    if (title.length < 15) {
      add("warning", "title-short", `Title is only ${title.length} characters`, title);
    } else if (title.length > 65) {
      add("info", "title-long", `Title is ${title.length} characters and will be truncated`, title);
    }
  }

  /* --- description --- */

  const description = metaBy("description");
  if (!description) {
    add("warning", "description-missing", "No meta description", "Google will write one from the page. Controlling it controls the click-through rate.");
  } else {
    ctx.descriptions.push({ description, url: ctx.url });
    if (description.length < 50) {
      add("info", "description-short", `Meta description is only ${description.length} characters`, description);
    } else if (description.length > 165) {
      add("info", "description-long", `Meta description is ${description.length} characters and will be truncated`, description);
    }
  }

  /* --- canonical --- */

  const canonical = links.find((l) => (l.attrs.rel || "").toLowerCase() === "canonical");
  if (!canonical) {
    add("warning", "canonical-missing", "No canonical link", "Without it, parameters and variants create duplicate URLs.");
  } else if (!isAbsoluteUrl(canonical.attrs.href || "")) {
    add("error", "canonical-relative", "Canonical URL is not absolute", canonical.attrs.href || "(empty)");
  }

  /* --- indexability --- */

  const robots = metaBy("robots");
  if (robots && /\bnoindex\b/i.test(robots)) {
    add("error", "noindex", "Page is set to noindex", `meta robots = "${robots}". Intentional on a gated page; catastrophic if not.`);
  }
  if (robots && /\bnofollow\b/i.test(robots)) {
    add("warning", "nofollow", "Page is set to nofollow", `meta robots = "${robots}".`);
  }

  /* --- headings --- */

  const headings = findHeadings(html);
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    add("error", "h1-missing", "No H1 on the page");
  } else if (h1s.length > 1) {
    add("warning", "h1-multiple", `${h1s.length} H1 elements`, h1s.map((h) => h.text).join(" | "));
  }

  let previous = 0;
  for (const h of headings) {
    if (previous && h.level > previous + 1) {
      add("warning", "heading-skip", `Heading level jumps from H${previous} to H${h.level}`, h.text);
    }
    previous = h.level;
  }

  const questionHeadings = headings.filter(
    (h) => h.level >= 2 && (h.text.includes("?") || QUESTION_WORDS.test(h.text))
  );

  /* --- images --- */

  const images = findVoid(html, "img");
  let missingAlt = 0, missingDims = 0;
  images.forEach((img, index) => {
    if (!("alt" in img.attrs)) {
      missingAlt++;
      if (missingAlt <= 3) {
        add("error", "img-alt", "Image with no alt attribute", img.attrs.src || "(no src)");
      }
    }
    if (!("width" in img.attrs) || !("height" in img.attrs)) {
      missingDims++;
      if (missingDims <= 3) {
        add("warning", "img-dimensions", "Image without width and height", img.attrs.src || "(no src)");
      }
    }
    if (index === 0 && (img.attrs.loading || "").toLowerCase() === "lazy") {
      add("warning", "img-lazy-lcp", "The first image is lazy-loaded", `${img.attrs.src || "(no src)"} — if this is the LCP element, lazy loading delays it directly.`);
    }
  });
  if (missingAlt > 3) add("error", "img-alt", `${missingAlt - 3} further images with no alt attribute`);
  if (missingDims > 3) add("warning", "img-dimensions", `${missingDims - 3} further images without dimensions`);

  /* --- Open Graph --- */

  const ogTitle = metaBy("og:title", "property") ?? metaBy("og:title");
  const ogDesc = metaBy("og:description", "property") ?? metaBy("og:description");
  const ogImage = metaBy("og:image", "property") ?? metaBy("og:image");
  if (!ogTitle || !ogDesc) {
    add("info", "og-missing", "Incomplete Open Graph tags", "Shared links fall back to whatever the platform can scrape.");
  }
  if (!ogImage) {
    add("info", "og-image-missing", "No og:image", "Shared links will have no preview image.");
  } else if (!isAbsoluteUrl(ogImage)) {
    add("error", "og-image-relative", "og:image is a relative path", `${ogImage} — social platforms and messaging apps require an absolute URL and will show no preview.`);
  }

  /* --- structured data --- */

  const ldBlocks = [];
  const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ld;
  while ((ld = ldRe.exec(html)) !== null) ldBlocks.push(ld[1]);

  if (ldBlocks.length === 0) {
    add("info", "jsonld-missing", "No JSON-LD structured data");
  }
  const types = new Set();
  for (const block of ldBlocks) {
    let parsed;
    try {
      parsed = JSON.parse(block);
    } catch (error) {
      add("error", "jsonld-invalid", "JSON-LD block is not valid JSON", error.message);
      continue;
    }
    const nodes = [];
    const collect = (node) => {
      if (Array.isArray(node)) return node.forEach(collect);
      if (!node || typeof node !== "object") return;
      nodes.push(node);
      if (node["@graph"]) collect(node["@graph"]);
    };
    collect(parsed);

    if (!nodes.some((n) => n["@context"])) {
      add("warning", "jsonld-context", "JSON-LD block has no @context");
    }
    for (const node of nodes) {
      const t = node["@type"];
      if (t) [].concat(t).forEach((x) => types.add(x));
      for (const key of ["image", "logo", "url"]) {
        const value = node[key];
        if (typeof value === "string" && value.startsWith("/")) {
          add("warning", "jsonld-relative", `JSON-LD "${key}" is a relative path`, `${value} — structured data requires absolute URLs.`);
        }
      }
      if (node.aggregateRating || node.review) {
        const isBusiness = [].concat(t || []).some((x) => /Business|Organization|Store|Contractor|Restaurant/i.test(x));
        if (isBusiness) {
          add("warning", "jsonld-self-review", "Self-serving review markup", "Google recommends aggregateRating and review only for sites capturing reviews about OTHER businesses. This produces no stars and risks a manual action.");
        }
      }
    }
  }

  /* --- links --- */

  const anchors = findPaired(html, "a");
  let internal = 0, external = 0, vague = 0;
  for (const a of anchors) {
    const href = a.attrs.href || "";
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) continue;
    if (isAbsoluteUrl(href)) {
      if (ctx.origin && href.startsWith(ctx.origin)) internal++;
      else external++;
    } else if (!/^(mailto:|tel:|sms:|whatsapp:)/i.test(href)) {
      internal++;
      ctx.linkTargets.add(normalizeUrlPath(href, ctx.url));
    }
    const text = toText(a.inner).toLowerCase();
    if (text && VAGUE_ANCHORS.has(text)) vague++;
  }
  if (vague > 0) {
    add("info", "anchor-vague", `${vague} link${vague > 1 ? "s" : ""} with uninformative anchor text`, "Anchor text is a relevance signal you control. Describe the destination.");
  }

  /* --- content volume and extractability --- */

  const text = bodyText(html);
  const words = text ? text.split(/\s+/).length : 0;
  if (words < 150) {
    add("warning", "thin", `Only ${words} words of visible text`, "Thin pages rarely rank and, published at scale, match Google's scaled content abuse pattern.");
  }

  const numbers = (text.match(/\b\d[\d.,]*\s?(%|€|\$|£|m²|mq|km|kg|cm|mm|ore|giorni|anni|years|days|hours)\b/gi) || []).length;
  const hasDate = /\b(20[0-9]{2})\b/.test(text);

  return {
    findings,
    stats: {
      url: ctx.url,
      title,
      words,
      headings: headings.length,
      questionHeadings: questionHeadings.length,
      images: images.length,
      internalLinks: internal,
      externalLinks: external,
      jsonLdTypes: [...types],
      quotableFacts: numbers,
      hasDate,
    },
  };
}

/* ------------------------------------------------------------------ *
 * Site-level helpers
 * ------------------------------------------------------------------ */

function normalizeUrlPath(href, fromUrl) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return fromUrl;
  if (clean.startsWith("/")) return clean;
  const base = fromUrl.endsWith("/") ? fromUrl : fromUrl.replace(/\/[^/]*$/, "/");
  return path.posix.normalize(base + clean);
}

function fileToUrlPath(file, root) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel;
}

async function collectHtmlFiles(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collectHtmlFiles(full, acc);
    else if (entry.name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

function auditRobots(content) {
  const findings = [];
  const lines = content.split(/\r?\n/).map((l) => l.trim());
  let agent = null;
  let blanketBlock = false;
  for (const line of lines) {
    if (/^user-agent:/i.test(line)) agent = line.split(":")[1].trim();
    if (/^disallow:\s*\/\s*$/i.test(line) && (agent === "*" || agent === "Googlebot")) {
      blanketBlock = true;
    }
  }
  if (blanketBlock) {
    findings.push({
      severity: "error",
      code: "robots-blocks-all",
      message: "robots.txt disallows the whole site",
      detail: "Nothing on this site can rank until this is removed. Every other finding is moot.",
    });
  }
  if (!/^sitemap:/im.test(content)) {
    findings.push({
      severity: "warning",
      code: "robots-no-sitemap",
      message: "robots.txt has no Sitemap: line",
      detail: "Add an absolute URL to the sitemap.",
    });
  }
  const retrievalAgents = ["OAI-SearchBot", "PerplexityBot", "Claude-User", "ClaudeBot", "Bingbot"];
  const blocked = retrievalAgents.filter((a) => {
    const re = new RegExp(`user-agent:\\s*${a}[\\s\\S]*?disallow:\\s*/\\s*$`, "im");
    return re.test(content);
  });
  if (blocked.length) {
    findings.push({
      severity: "warning",
      code: "robots-blocks-ai",
      message: `robots.txt blocks AI retrieval agents: ${blocked.join(", ")}`,
      detail: "These fetch pages to answer user questions. Blocking them removes the site from those assistants. Blocking training crawlers (GPTBot, Google-Extended) is a different decision.",
    });
  }
  return findings;
}

/* ------------------------------------------------------------------ *
 * Reporting
 * ------------------------------------------------------------------ */

function report(pages, siteFindings, options) {
  /* Deliberate findings get downgraded to info rather than dropped: the
     report still shows them, it just stops them failing the build. */
  let downgraded = 0;
  const downgrade = (f) => {
    if (!options.ignore.has(f.code) || f.severity === "info") return f;
    downgraded++;
    return { ...f, severity: "info", detail: `${f.detail ?? ""} [declared deliberate via --ignore]`.trim() };
  };
  for (const page of pages) page.findings = page.findings.map(downgrade);
  siteFindings = siteFindings.map(downgrade);

  const all = [
    ...siteFindings.map((f) => ({ ...f, url: "(site)" })),
    ...pages.flatMap((p) => p.findings.map((f) => ({ ...f, url: p.stats.url }))),
  ];
  const counts = { error: 0, warning: 0, info: 0, downgraded };
  all.forEach((f) => counts[f.severity]++);

  if (options.json) {
    console.log(JSON.stringify({ counts, findings: all, pages: pages.map((p) => p.stats) }, null, 2));
    return counts;
  }

  const line = "─".repeat(72);
  console.log(`\n${line}\nVISIBILITY AUDIT — ${pages.length} page${pages.length === 1 ? "" : "s"}\n${line}`);

  if (siteFindings.length) {
    console.log("\nSITE\n");
    for (const f of sortFindings(siteFindings)) printFinding(f);
  }

  for (const page of pages) {
    const shown = sortFindings(page.findings).filter(
      (f) => !options.quiet || f.severity !== "info"
    );
    if (!shown.length && options.quiet) continue;
    console.log(`\n${page.stats.url}`);
    const s = page.stats;
    console.log(
      `  ${s.words} words · ${s.headings} headings (${s.questionHeadings} question-shaped) · ` +
      `${s.images} images · ${s.internalLinks} internal links · ` +
      `${s.quotableFacts} quotable facts` +
      (s.jsonLdTypes.length ? ` · schema: ${s.jsonLdTypes.join(", ")}` : " · no schema")
    );
    if (!shown.length) console.log("  nothing to report");
    for (const f of shown) printFinding(f);
  }

  console.log(`\n${line}`);
  console.log(
    `${counts.error} error, ${counts.warning} warning, ${counts.info} info` +
    (downgraded ? ` (${downgraded} declared deliberate)` : "")
  );
  console.log(line + "\n");
  return counts;
}

function sortFindings(findings) {
  return [...findings].sort((a, b) => SEVERITY[a.severity] - SEVERITY[b.severity]);
}

function printFinding(f) {
  console.log(`  ${LABEL[f.severity]} ${f.message}`);
  if (f.detail) console.log(`          ${f.detail}`);
}

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */

async function main() {
  const args = process.argv.slice(2);
  const ignoreArg = args.find((a) => a.startsWith("--ignore="));
  const options = {
    json: args.includes("--json"),
    quiet: args.includes("--quiet"),
    ignore: new Set(
      ignoreArg ? ignoreArg.slice("--ignore=".length).split(",").map((c) => c.trim()).filter(Boolean) : []
    ),
  };
  const target = args.find((a) => !a.startsWith("--"));

  if (!target) {
    console.error("Usage: node audit-page.mjs <directory|url> [--json] [--quiet] [--ignore=code,code]");
    process.exit(2);
  }

  const pages = [];
  const siteFindings = [];
  const ctxShared = { titles: [], descriptions: [], linkTargets: new Set() };

  if (isAbsoluteUrl(target)) {
    const response = await fetch(target, {
      headers: { "user-agent": "visibility-audit/1.0 (+https://github.com/marcozambrella/visibility-skill)" },
      redirect: "follow",
    });
    if (!response.ok) {
      console.error(`Fetch failed: HTTP ${response.status} for ${target}`);
      process.exit(2);
    }
    const html = await response.text();
    const origin = new URL(target).origin;
    pages.push(auditPage(html, { ...ctxShared, url: target, origin }));

    /* The two site-level files. Both are looked for at the origin root, and
       then in the audited page's own directory — a project page on GitHub
       Pages, a docs subfolder, or any site served under a path puts them
       there. Where they end up changes what they do, so report the
       difference rather than a bare "missing". */
    const base = new URL(target);
    const subdir = base.pathname.replace(/[^/]*$/, "");

    for (const [file, code] of [["robots.txt", "robots"], ["sitemap.xml", "sitemap"]]) {
      const atRoot = await fetch(`${origin}/${file}`).catch(() => null);

      if (atRoot?.ok) {
        if (file === "robots.txt") siteFindings.push(...auditRobots(await atRoot.text()));
        continue;
      }

      const atPath = subdir === "/" ? null : await fetch(`${origin}${subdir}${file}`).catch(() => null);

      if (atPath?.ok && file === "robots.txt") {
        siteFindings.push({
          severity: "warning",
          code: "robots-not-at-root",
          message: `robots.txt exists at ${subdir}${file} but not at the origin root`,
          detail: "Crawlers only read robots.txt at the root of a host. At a subpath it is inert. This is normal for a GitHub Pages project site, where the root belongs to the account, not the repository — a custom domain is the only way to control it.",
        });
      } else if (atPath?.ok) {
        siteFindings.push({
          severity: "info",
          code: "sitemap-at-path",
          message: `Sitemap found at ${subdir}${file}`,
          detail: "Valid, as long as it only lists URLs under that path. Submit it by full URL in Search Console, since no root robots.txt can point at it.",
        });
      } else {
        siteFindings.push({
          severity: "warning",
          code: `${code}-missing`,
          message: `No /${file}`,
          detail: file === "robots.txt"
            ? "Crawlers assume everything is allowed, and you lose the Sitemap: pointer."
            : "Sitemaps are how new and deep pages get discovered promptly.",
        });
      }
    }
  } else {
    const root = path.resolve(target);
    if (!existsSync(root) || !(await stat(root)).isDirectory()) {
      console.error(`Not a directory: ${root}`);
      process.exit(2);
    }
    const files = await collectHtmlFiles(root);
    if (!files.length) {
      console.error(`No .html files found under ${root}`);
      process.exit(2);
    }
    for (const file of files) {
      const html = await readFile(file, "utf8");
      pages.push(auditPage(html, { ...ctxShared, url: fileToUrlPath(file, root), origin: null }));
    }

    // Site-level files on disk.
    const robotsPath = path.join(root, "robots.txt");
    if (!existsSync(robotsPath)) {
      siteFindings.push({
        severity: "warning",
        code: "robots-missing",
        message: "No robots.txt in the build output",
        detail: "You lose the Sitemap: pointer and any control over AI crawlers.",
      });
    } else {
      siteFindings.push(...auditRobots(await readFile(robotsPath, "utf8")));
    }

    const hasSitemap = (await readdir(root)).some((f) => /^sitemap.*\.xml$/i.test(f));
    if (!hasSitemap) {
      siteFindings.push({
        severity: "warning",
        code: "sitemap-missing",
        message: "No sitemap XML in the build output",
        detail: "Sitemaps are how new and deep pages get discovered promptly.",
      });
    }

    // Orphans: pages nothing links to. The homepage is never an orphan.
    const linked = ctxShared.linkTargets;
    const orphans = pages
      .map((p) => p.stats.url)
      .filter((u) => u !== "/" && !linked.has(u) && !linked.has(u.replace(/\/$/, "")));
    if (orphans.length) {
      siteFindings.push({
        severity: "warning",
        code: "orphans",
        message: `${orphans.length} page${orphans.length > 1 ? "s" : ""} with no internal links pointing at them`,
        detail: orphans.slice(0, 8).join(", ") + (orphans.length > 8 ? ` and ${orphans.length - 8} more` : ""),
      });
    }
  }

  // Duplicates across the whole set.
  for (const [field, list] of [["title", ctxShared.titles], ["description", ctxShared.descriptions]]) {
    const seen = new Map();
    for (const item of list) {
      const key = item[field];
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push(item.url);
    }
    for (const [value, urls] of seen) {
      if (urls.length > 1) {
        siteFindings.push({
          severity: "warning",
          code: `duplicate-${field}`,
          message: `${urls.length} pages share the same ${field}`,
          detail: `"${value.slice(0, 70)}${value.length > 70 ? "…" : ""}" on ${urls.join(", ")}`,
        });
      }
    }
  }

  const counts = report(pages, siteFindings, options);
  process.exit(counts.error > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
