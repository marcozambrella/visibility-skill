# Diagnose: eligibility before everything

Stage 2 of the funnel. This file answers one question: **can this page be found
at all?** Work through it in order. Every check here is binary and cheap, and a
failure here makes every other file in this skill irrelevant.

Run `scripts/audit-page.mjs` first. It automates the machine-checkable half of
this list. This file covers what the script cannot see.

## The order of operations

Do not skip ahead. A page that returns 404 does not need better headings.

```
Reachable → Fetchable → Indexable → Canonical → Rendered → Linked → Submitted
```

## 1. Reachable

**Does the URL resolve?** Check the actual status code, not what the browser
shows. A soft 404 (a page that says "not found" but returns 200) is worse than a
hard 404 because Google keeps trying and may index the error page.

```bash
curl -sSI https://example.com/page | head -n 1
```

**Redirect chains.** More than one hop wastes crawl budget and dilutes signals.
Fix the source link, do not add another redirect.

```bash
curl -sSIL https://example.com/page | grep -Ei '^(HTTP|location)'
```

**HTTP to HTTPS, www to non-www.** Pick one of each, 301 everything else to it,
and make sure internal links point at the destination rather than the redirect.
Four live variants of your homepage is four ways to split your signals.

**Trailing slash.** Pick a policy, apply it in links, canonicals, and the sitemap.
Mixed policies create duplicate URLs. In Astro this is `trailingSlash` in
`astro.config.mjs`; in Next.js, `trailingSlash` in `next.config.js`.

## 2. Fetchable

**robots.txt.** The most common catastrophic error in this whole skill is a
`Disallow: /` that survived from staging. Check it first, on the production
host, before anything else.

```bash
curl -sS https://example.com/robots.txt
```

Things to verify:

- No blanket `Disallow: /` for `User-agent: *`.
- CSS and JS are **not** blocked. Google renders the page; blocking assets makes
  it render broken and it will be judged on that broken render.
- The `Sitemap:` line is present and points at an absolute URL that returns 200.
- Directives for AI crawlers are deliberate, not accidental. See
  `templates/robots.txt` and the crawler table below.

**Server-side blocks.** A WAF, Cloudflare bot-fight mode, or a rate limiter can
serve 403 to crawlers while humans see the site fine. Check your server logs for
Googlebot and for the AI agents. If you cannot see Googlebot in the logs at all,
that is the finding.

**The AI crawler table.** Two families with different consequences.

| User-agent | Owner | Purpose | Blocking it means |
|---|---|---|---|
| `Googlebot` | Google | Search index | You disappear from Google, including AI Overviews |
| `Google-Extended` | Google | Gemini model training and grounding | No effect on Search ranking; may reduce Gemini app grounding |
| `GPTBot` | OpenAI | Model training | Not used for ChatGPT search results |
| `OAI-SearchBot` | OpenAI | ChatGPT search index | **You disappear from ChatGPT search** |
| `ChatGPT-User` | OpenAI | Live fetch when a user asks | Blocks on-demand retrieval of your page |
| `ClaudeBot` | Anthropic | Model training | No effect on live retrieval |
| `Claude-User` / `Claude-SearchBot` | Anthropic | Live retrieval for Claude | Blocks Claude from citing you |
| `PerplexityBot` | Perplexity | Perplexity index | You disappear from Perplexity |
| `Applebot-Extended` | Apple | Apple Intelligence training | No effect on Siri/Spotlight search |
| `Bingbot` | Microsoft | Bing index, and Copilot | You disappear from Bing and Copilot |

The default recommendation for a business that wants to be found: **allow every
retrieval agent, decide about the training agents on principle**. Blocking
`GPTBot` costs you nothing in ChatGPT search visibility; blocking
`OAI-SearchBot` costs you all of it. People conflate the two constantly.

Note that Bytespider and some Perplexity fetches have been documented ignoring
robots.txt. For non-compliant crawlers the only real control is at the WAF.

## 3. Indexable

**Meta robots and X-Robots-Tag.** Check both. The HTTP header wins over the meta
tag and is invisible in the page source.

```bash
curl -sSI https://example.com/page | grep -i x-robots-tag
```

A `noindex` that arrived through a CMS toggle, a staging environment variable, or
a framework default is the second most common catastrophic error.

**Password walls, geoblocks, cookie walls.** If the crawler gets a consent
interstitial instead of content, the interstitial is what gets indexed. Content
must be in the initial HTML response regardless of consent state; the consent
banner governs tracking, not text.

**Preview controls.** `nosnippet`, `data-nosnippet`, and `max-snippet` limit what
Google can show. Google has confirmed these same controls govern AI Overviews and
AI Mode. If a client wants out of AI answers but stays in Search, `max-snippet`
is the lever, and it costs featured snippets too. There is no separate opt-out.

## 4. Canonical

**One canonical per page, absolute, self-referencing by default.** Relative
canonicals work but break the moment the page is syndicated or mirrored.

Common failures, in the order I find them:

- Canonical pointing to the homepage from every page. Kills the whole site.
- Canonical pointing to a `noindex` page. Contradictory signal; Google picks.
- Canonical missing on paginated or filtered URLs, so parameters generate
  hundreds of near-duplicates.
- Canonical on a staging domain, shipped to production.

**Parameters.** `?utm_source=`, `?sort=`, `?page=` all create URLs. Self-canonical
on the clean URL, and do not rely on Search Console parameter handling, which no
longer exists.

## 5. Rendered

Google renders JavaScript, with a delay and a budget. Other crawlers largely do
not. Perplexity, ChatGPT-User, and most assistant fetchers take the raw HTML.

**The test that settles it:**

```bash
curl -sS https://example.com/page | grep -c "some sentence from your main content"
```

If that returns 0, your content is client-rendered. For Google this means slower
and less reliable indexing. For assistants it means you do not exist. Static
generation or server-side rendering is not a performance nicety here; it is the
difference between being readable and not.

**What breaks specifically:**

- Content behind a click (tabs, accordions) is usually indexed if it is in the
  DOM, and usually not if it is fetched on click.
- Infinite scroll without paginated URLs: only the first batch is ever seen.
- Content injected after a user interaction: never seen.
- Text baked into images or SVG paths: never seen. Use real text.

## 6. Linked

A page with no internal links pointing at it is an orphan. It may be in the
sitemap and still get almost no crawl attention, because sitemaps are a hint and
links are the signal.

**Find orphans** by comparing the sitemap against the set of URLs that appear as
`href` targets anywhere in the built site. `scripts/audit-page.mjs` does this
when you give it a directory.

**Depth.** Every page that matters should be within three clicks of the homepage.
Deeper is not fatal but it is a tax.

See `03-architecture.md` for how to fix this properly rather than by dumping
links in a footer.

## 7. Submitted

**XML sitemap.** Absolute URLs, only canonical and indexable pages, `lastmod`
that reflects real content changes and not the build timestamp. A sitemap full of
`noindex` pages or redirects is a quality signal against you.

**Search Console.** Verify the property, submit the sitemap, then read
Pages → Indexing. The report tells you exactly why URLs are excluded. The
categories worth acting on:

- *Discovered - currently not indexed*: Google knows about it and chose not to
  crawl. Usually a quality or crawl-budget signal. More internal links, better
  content.
- *Crawled - currently not indexed*: crawled and rejected. A content quality
  judgment. Do not resubmit; improve or remove.
- *Duplicate, Google chose different canonical*: your canonical was overruled.
  Check for near-identical pages.
- *Alternate page with proper canonical tag*: working as intended, ignore.

**Bing Webmaster Tools.** Free, and it feeds Copilot. Verify it. Bing supports
IndexNow, which Google does not.

**IndexNow.** Supported by Bing, Yandex, Naver, Seznam and Yep; **not by Google**
as of 2026. Bing reported that 22% of its clicked URLs came from IndexNow
submissions. Worth wiring up for a content site, pointless as a Google tactic.

## The diagnosis report

When you finish, state the verdict in one line before the details:

> The site is indexable and 41 of 43 pages are in the index. The two missing
> pages are excluded as *Crawled - currently not indexed*, which is a content
> judgment, not a technical block.

or

> Nothing on this site can rank: `robots.txt` on production disallows all
> crawlers. Everything else in this report is moot until that line is removed.

Then stop and fix that, before reading any other file in this skill.
