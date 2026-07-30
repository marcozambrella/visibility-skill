---
name: visibility
description: Make a web page findable across every surface people search on — Google organic, the local pack and Maps, AI Overviews and AI Mode, and assistants like ChatGPT, Perplexity, Claude and Gemini. Use for SEO audits, keyword and intent research, site architecture, structured data, local search, Core Web Vitals, AI search visibility (GEO/AEO), authority building, and measurement. Also use when the user says a site "gets no traffic", "doesn't show up on Google", "isn't in Maps", "isn't cited by ChatGPT", or asks how to rank, get found, or be recommended by AI.
---

# Visibility

Getting found is a pipeline, not a checklist. A page has to be reachable, then
indexed, then retrieved for a query, then selected over competitors, then
rendered in a way a human or a model can lift an answer from. A failure at any
stage makes every later optimization worthless. Most SEO advice — and nearly all
"GEO" advice — optimizes the last stage and ignores the first four.

This skill is organized around that pipeline, and around one discipline: every
claim carries an evidence tier. Do not spend a client's money on tier-4 tactics.

## Evidence tiers

Use these labels when you recommend anything. They appear throughout the
reference files.

| Tier | Meaning | How to treat it |
|---|---|---|
| **Confirmed** | Documented by the platform owner, or replicated end-to-end with measured outcomes | Do it. Non-negotiable. |
| **Supported** | Consistent across independent studies, but correlational or conditional on other stages | Do it, and say what the condition is. |
| **Plausible** | Mechanistically sensible, cheap, no direct evidence either way | Do it only if it costs almost nothing. Never bill it as a driver. |
| **Unsupported** | Widely repeated, no evidence, or evidence against | Say so out loud. Do not do it. |
| **Harmful** | Measured negative effect, or a policy violation | Refuse, and explain the mechanism of harm. |

The single most important correction this skill makes: the famous GEO results
(+41% from adding citations, +25% from adding statistics) were measured on
documents **already placed in the model's context window**. They say nothing
about whether your page gets retrieved in the first place. The end-to-end test
(SAGEO Arena, 2026) found body-only optimization *reduced* top-20 presence by
about 9%. Read `reference/06-ai-search.md` before you promise anyone anything
about AI search.

## Pick a mode

**Diagnose** — an existing site underperforms. Run in this order and stop at the
first stage that is broken, because fixing later stages will not help:

1. `scripts/audit-page.mjs <dir-or-url>` — run it before you read anything else.
   It gives you the machine-checkable failures in one pass.
2. `reference/01-diagnose.md` — crawl, index, render, status codes. Is the page
   even eligible?
3. `reference/08-performance.md` — if the page is eligible but slow or unstable.
4. `reference/02-keywords.md` — is the page aimed at a query anyone types?
5. `reference/03-architecture.md` — is the page reachable and supported by the
   rest of the site?
6. `reference/04-content.md` — does the page deserve to win the query?
7. `reference/05-structured-data.md`, `reference/07-local.md`,
   `reference/09-authority.md` — the amplifiers, in that order.
8. `reference/10-measurement.md` — set up the instruments before you claim a win.

**Build** — a new site or section. Read `reference/00-model.md` first, then
`02-keywords.md` → `03-architecture.md` → `04-content.md` → `05-structured-data.md`,
and treat `01-diagnose.md` as the pre-launch gate.

**Maintain** — a site that already works. `reference/10-measurement.md` for what
to watch, `reference/11-human-playbook.md` for the cadence, and
`reference/12-antipatterns.md` before any "refresh" or "consolidation" project.

**Local business** — always read `reference/07-local.md` and
`reference/11-human-playbook.md` together. For a business with a physical
service area, the profile and the reviews outweigh the entire website. Telling a
plumber to fix their heading hierarchy while they have no Google Business Profile
is malpractice.

## Rules for the agent

**Measure before and after, with the same instrument.** Run `audit-page.mjs`
before you change anything, keep the report, run it again after. State the delta.
Never write "this should improve rankings" — either you measured something or you
say plainly that you did not.

**Never invent content for a real business.** You do not know their prices, their
certifications, their service radius, or their history. Build the structure, mark
the gaps with short visible placeholders, and produce a content brief telling the
owner exactly what to write. A page of invented copy has to be undone later and
distorts the architecture in the meantime.

**Never publish thin pages at scale.** Eight empty service pages is the exact
pattern Google's scaled content abuse policy targets. Gate incomplete pages
behind `noindex` and keep them out of the sitemap until the content exists.

**Distinguish what you can do from what only a person can do.** You can write
schema, fix a canonical, restructure a URL tree. You cannot take a photo of a
finished job, ask a customer for a review, call the local paper, or verify a
business on Google. Put those in a human plan with a cadence and a time estimate,
not in a list of things you claim to have done.

**Do not promise rankings.** Nobody controls them. Promise the fixes, the
measurement, and the cadence.

## What is in the box

```
reference/
  00-model.md            The four surfaces, the seven-stage funnel, where leverage is
  01-diagnose.md         Crawl, index, render, status codes, robots, canonical
  02-keywords.md         Demand research, intent, clustering, mapping, query fan-out
  03-architecture.md     URLs, hierarchy, topic clusters, internal linking
  04-content.md          Titles, extractable passages, information gain, E-E-A-T
  05-structured-data.md  What Google actually supports, plus JSON-LD recipes
  06-ai-search.md        AI Overviews, AI Mode, assistants: evidence vs. snake oil
  07-local.md            Google Business Profile, NAP, citations, reviews, service areas
  08-performance.md      LCP, INP, CLS: causes, and fixes per stack
  09-authority.md        Links, digital PR, brand mentions, entity building
  10-measurement.md      Search Console, GA4, AI referrals, experiment design
  11-human-playbook.md   The owner's plan: what to do, weekly and monthly
  12-antipatterns.md     Penalties, cargo cult, and the never-do list

scripts/
  audit-page.mjs         Static audit of built HTML or a live URL. Zero dependencies.
  structured-data.mjs    Generates and validates a JSON-LD graph from business.json

templates/
  robots.txt             AI crawler policy, annotated
  business.json          Input for structured-data.mjs
  checklist.md           One-page checklist for a human
```

## Running the scripts

```bash
node scripts/audit-page.mjs ./dist                  # a built static site
node scripts/audit-page.mjs https://example.com     # a live page
node scripts/audit-page.mjs ./dist --json           # machine-readable output
node scripts/audit-page.mjs ./dist --quiet          # only errors and warnings

node scripts/structured-data.mjs templates/business.json
node scripts/structured-data.mjs business.json --validate-only
```

`audit-page.mjs` exits 1 when it finds an error-level problem, so it works as a
pre-deploy gate. Node 22 or newer, no npm install.
