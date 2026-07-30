# visibility

An agent skill for making a web page findable — across Google organic, the local
pack and Maps, AI Overviews and AI Mode, and assistants like ChatGPT, Perplexity,
Claude and Gemini.

It is built around two things most SEO material lacks: an explicit model of
**where in the pipeline** each intervention acts, and an **evidence tier** on
every recommendation, so you can tell what is documented from what is repeated.

Works with [Claude Code](https://claude.com/claude-code) and any agent runtime
that reads `SKILL.md` files. The reference material is plain Markdown and is
useful on its own.

## Install

```bash
git clone https://github.com/marcozambrella/visibility-skill.git \
  ~/.claude/skills/visibility
```

Then invoke it with `/visibility`, or just describe the problem — the skill
triggers on audits, keyword research, structured data, local search, Core Web
Vitals, AI search visibility, and on phrasings like "this site gets no traffic".

For project-scoped installs, clone into `.claude/skills/visibility` inside the
repository instead.

## The thesis

Getting found is a pipeline. A page has to be reachable, then indexed, then
retrieved for a query, then selected over competitors, then rendered so a human
or a model can lift an answer from it. A failure at any stage makes every later
optimization worthless.

Nearly all published "GEO" advice optimizes the last stage. The evidence for it
is weaker than the headlines suggest:

- The foundational GEO paper's famous gains (+41% from quotations, +25% from
  statistics) were measured on documents **already inside the model's context
  window**. They say nothing about whether a page gets retrieved.
- The C-SEO benchmark found **3 of 54** method-domain combinations significantly
  positive, and none in question answering.
- The one study that measured the full pipeline (SAGEO Arena, 2026) found
  body-only optimization **reduced** top-20 presence by about 9%.
- Google states directly that there are "no additional requirements to appear in
  AI Overviews or AI Mode", and that no special schema or AI text file is needed.

What does hold up: topical relevance, position in the ranking, real extractable
facts, and — for a local business — the Google Business Profile (about 32% of
local pack weight) and reviews (16-20%, rising). For AI surfaces, brand mentions
correlate with visibility about three times more strongly than backlinks.

The skill says so, with the sources, and tells you which of that you can do and
which requires a human with a phone.

## What is inside

```
SKILL.md                    Router: triage, workflow, evidence tiers
reference/
  00-model.md               Four surfaces, seven-stage funnel, where leverage is
  01-diagnose.md            Crawl, index, render, robots, canonical, AI crawlers
  02-keywords.md            Demand research, intent, clustering, query fan-out
  03-architecture.md        URLs, hub-and-spoke, internal linking, consolidation
  04-content.md             Titles, extractable passages, information gain, E-E-A-T
  05-structured-data.md     What Google still supports, plus JSON-LD recipes
  06-ai-search.md           AI Overviews, AI Mode, assistants: evidence vs. snake oil
  07-local.md               Business Profile, NAP, citations, reviews, service areas
  08-performance.md         LCP, INP, CLS: causes and per-stack fixes
  09-authority.md           Links, digital PR, mentions, entity building
  10-measurement.md         Search Console, GA4, AI referrals, experiment design
  11-human-playbook.md      The owner's plan: weekly and monthly, with time costs
  12-antipatterns.md        Penalties, cargo cult, and the never-do list
scripts/
  audit-page.mjs            Static audit of built HTML or a live URL
  structured-data.mjs       Builds and validates a JSON-LD graph
templates/
  robots.txt                Annotated AI crawler policy
  business.json             Input for the structured data script
  checklist.md              One-page checklist for a human
```

## The scripts

Zero dependencies, Node 22 or newer.

```bash
node scripts/audit-page.mjs ./dist                 # every .html in a build output
node scripts/audit-page.mjs https://example.com/   # one live page
node scripts/audit-page.mjs ./dist --json          # machine-readable
node scripts/audit-page.mjs ./dist --quiet         # errors and warnings only
```

`audit-page.mjs` checks titles and descriptions (including duplicates across the
site), canonicals, `lang`, heading structure, image alt and dimensions, lazy
loading on the LCP candidate, JSON-LD validity and relative-URL mistakes,
self-serving review markup, Open Graph absolute URLs, accidental `noindex`,
internal links and orphan pages, thin content, anchor text quality, and the
presence and contents of `robots.txt` and the sitemap. It exits 1 on any
error-level finding, so it works as a deploy gate.

```bash
node scripts/structured-data.mjs templates/business.json
node scripts/structured-data.mjs business.json --validate-only
node scripts/structured-data.mjs business.json --script    # wrapped in <script>
```

`structured-data.mjs` emits one connected `@graph` — `Organization`, `WebSite`,
and the right `LocalBusiness` subtype with `@id` cross-references — rather than a
pile of disconnected blocks, and refuses the markup patterns that trigger manual
actions.

## What this does not do

It does not promise rankings, because nobody controls them. It does not write
content for a real business, because you do not know their prices, guarantees, or
service radius — it produces the structure and a content brief instead. It does
not claim an improvement it did not measure.

And it will tell you, in writing, when something you were sold does not work.

## Sources

The research base is cited inline throughout `reference/`. The load-bearing ones:

- Aggarwal et al., *GEO: Generative Engine Optimization*, KDD 2024
- *Optimizing Visibility in Generative Engines: A Critical Survey (2023–2026)*,
  arXiv:2607.14035
- Puerto et al., *C-SEO Bench*, 2025
- Kim et al., *SAGEO Arena*, 2026
- Google Search Central: Creating Helpful Content, AI Features, Spam Policies,
  LocalBusiness structured data
- BrightLocal and aggregate local ranking factor studies, 2026

## Licence

MIT. See [LICENSE](LICENSE).

Contributions welcome, particularly corrections with a source attached. If a
claim in here is wrong, open an issue with the evidence and it gets fixed.
