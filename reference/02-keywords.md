# Demand research: what people actually type

Stage 3 of the funnel. The purpose of this work is not a spreadsheet of keywords.
It is a decision about **which pages exist**, and what each one is for. Every
keyword you find must end up mapped to exactly one URL or deleted.

The most common finding in a real audit is not "your keywords are wrong". It is
"there is no page for this". A site with one page and eight services is competing
for nothing, because it has one title tag, one H1, and one topic.

## The method

```
Seeds → Expansion → Intent labelling → Clustering → Page mapping → Fan-out coverage
```

Do not skip intent labelling. Two phrases with the same words and different
intent need different pages, and putting them on one page loses both.

### 1. Seeds

Start from what the business actually does and how customers name it, which are
usually not the same. Get seeds from:

- **The business owner's own words.** Ask: "when a customer calls, what do they
  say they need?" Customers say *"the boiler's leaking"*, the industry says
  *"hydronic system remediation"*. Rank the customer's phrasing first.
- **Existing Search Console data.** Free, real, and about your actual site.
  Performance → Queries, last 16 months, export. This is the single best source
  you have and most people never open it.
- **Your competitors' page titles.** Not their meta keywords, their `<h1>` and
  `<title>`. Those encode which queries they decided to target and paid to test.
- **Sales objections and support tickets.** Every recurring question is a query.
- **Product and service names, plus the problem each solves.** Both are searched,
  by different people at different stages.

### 2. Expansion

Free sources, in order of usefulness:

**Google Search Console, the "hidden gems" pass.** In the Performance report,
filter for queries with impressions above some threshold and position between 8
and 25. These are queries where Google already thinks you are relevant but no
page is dedicated to them. Each one is a page waiting to be written. This is the
highest-yield twenty minutes in keyword research and it costs nothing.

**Google Autocomplete.** Type the seed and cycle the alphabet after it, and
before it. `a [seed]`, `b [seed]`, … Prefixes surface different intent than
suffixes. Also try the seed plus `per`, `senza`, `vs`, `costo`, `come`, `quanto`,
or the equivalents in the target language.

**People Also Ask.** Expand two levels deep. Each expansion regenerates the list,
so a few clicks yields dozens of real question phrasings. These are gold for
stage 5 extractability and for AI Mode fan-out coverage.

**Related searches** at the bottom of the results page.

**Google Trends.** For seasonality and for settling "which of these two phrasings
is bigger" arguments. Set the country and a 5-year window; short windows are
noise.

**Google Ads Keyword Planner.** Free with an account. Volumes are bucketed unless
you spend, but the *relative* ordering and the CPC are both useful — CPC is the
best free proxy for commercial intent you will find. A query with a €6 cost per
click has buyers behind it.

**Bing Webmaster Tools keyword research.** Free, gives absolute numbers, and
correlates well enough with Google for prioritization.

**Reddit, forums, Facebook groups in the trade.** Where the real phrasing lives,
and increasingly where the models look: Reddit is the most-cited domain across
major AI engines, around 40% frequency.

### 3. Intent labelling

Label every query with one of these. The label determines page type, and getting
it wrong is why pages fail to convert even when they rank.

| Intent | The searcher wants | Page type | Signal in the SERP |
|---|---|---|---|
| **Informational** | To understand | Guide, explainer, FAQ | AI Overview, People Also Ask, Wikipedia |
| **Investigational** | To compare options before buying | Comparison, buying guide, pricing | Listicles, review sites, "best X" |
| **Transactional** | To buy or hire now | Service page, product page, contact | Ads, shopping, local pack |
| **Navigational** | A specific brand or page | Homepage, brand page | Sitelinks, the brand's own domain |
| **Local** | Something nearby | Service-area or location page | Map pack, "near me", Maps |

Read the actual results page for the query before you decide. Google has already
run the experiment on what intent it thinks the query has, and the result layout
is the answer. If the page-one results are all comparison articles, a service
page will not rank there no matter how good it is.

The 2026 refinement worth knowing: the modern rater guidelines split further
into short-fact, comparison, instruction, and consequence queries. In practice
that matters for *how you format the answer*, not for which page it belongs on.
See `04-content.md`.

### 4. Clustering

Group queries that share an intent **and** a results page. The operational test:

> If the same page could rank for both queries without contradicting itself,
> they belong to the same cluster.

The cheap and reliable way to verify: search both queries and compare the top ten
URLs. Three or more shared URLs means Google treats them as the same need, and
one page should serve both. Fewer than three means two pages.

Do not cluster by string similarity. "Impianto elettrico casa" and "impianto
elettrico costo" share words and have different intents; the first wants a
service, the second wants a number.

### 5. Page mapping

Every cluster gets exactly one URL. Write it down as a table, because this table
is the site architecture:

| Cluster | Primary query | Supporting queries | URL | Intent | Exists? |
|---|---|---|---|---|---|
| Electrical rewiring | rifacimento impianto elettrico roma | costo, tempi, a norma | /servizi/impianti-elettrici-roma/ | Transactional + local | No |

Two failure modes this table prevents:

**Cannibalization.** Two pages targeting one cluster. Google picks one, usually
the wrong one, and both underperform. Fix by merging, or by clearly
differentiating intent and cross-linking.

**Orphan clusters.** A cluster with no URL. This is the finding that produces
actual growth. Write it in the report as *"there is no page for this"*, not as
*"the keyword is not optimized"*.

### 6. Fan-out coverage

Google's AI Mode decomposes one query into roughly 8-12 synthetic sub-queries,
runs them in parallel, and synthesizes one answer. The sub-queries cover
comparisons, specifications, how-to steps, pricing, locations, and edge cases
around the original intent.

The practical implication is not a new tactic. It is a coverage test:

> For the primary query of this cluster, write down the ten sub-questions a
> thorough person would need answered. Does the page answer all ten, each under
> its own descriptive heading?

Generate the sub-question list from People Also Ask plus autocomplete plus your
own knowledge of the trade. If the page answers three of ten, it will lose to a
page that answers nine, on both the classic and the AI surfaces, for the same
reason: it is less complete.

**Evidence tier: Supported.** Coverage breadth correlates with citation. The
specific claim circulating that "FAQ schema makes you 60% more likely to appear
in AI answers" is **Unsupported** — Google removed FAQ rich results for almost
everyone in 2023 and states no schema is needed for AI features. Cover the
questions in visible prose. The markup is not what does the work.

## Prioritization

Rank clusters by expected value, not by volume. Volume without intent is vanity.

```
score = intent_value × achievability × business_value
```

- **intent_value** — transactional and local at the top, informational at the
  bottom, unless the informational query is how buyers start their journey in
  this market.
- **achievability** — can you plausibly compete? Look at who ranks. If page one
  is national marketplaces and comparison portals, a small local business will
  not get there; find the long-tail variant they do not cover.
- **business_value** — margin, and whether this service is one you want more of.
  Ask the owner. The highest-volume service is often the least profitable.

For a local business, the highest-value clusters are almost always
`[service] + [city]` and `[service] + [neighbourhood]`, transactional, low
competition against national sites, and directly monetizable. Start there, not
with a blog.

## What to hand over

Two artifacts:

1. **The mapping table**, one row per cluster, with the URL column filled in and
   an "exists / to create" flag. This is the work plan.
2. **A per-page brief** for every "to create" row: the primary query, the ten
   sub-questions to answer, the intent, and what the page must let a visitor do.

If the business is a real client, the brief is where you stop. You do not know
their prices, their guarantees, or their process. Write the questions; let them
write the answers. See `12-antipatterns.md` on invented copy.
