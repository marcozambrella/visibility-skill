# Architecture: URLs, hierarchy, and internal links

The mapping table from `02-keywords.md` is a site architecture in disguise. This
file turns it into URLs and links.

Architecture does two jobs. It tells crawlers which pages exist and how important
each is, and it tells retrieval systems what this site is *about* as a whole. A
site with eight related pages tightly linked reads as an authority on that topic;
the same eight pages floating unlinked read as eight unrelated documents.

## URL design

**One URL per cluster. One cluster per URL.** That is the whole rule; everything
below is detail.

**Readable, in the site's language, lowercase, hyphen-separated.** A URL is shown
in results, read aloud by assistants, and pasted into messages. `/servizi/
impianti-elettrici-roma/` communicates; `/p?id=4471` does not.

**Short and shallow.** Directory depth should reflect real hierarchy, not
organizational charts. Three levels is plenty for most sites:

```
/                                   home
/servizi/                           hub
/servizi/impianti-elettrici-roma/   leaf
```

**Include the differentiating term, once.** For a local service business, the
city belongs in the URL of a service page, because it is the differentiator
between your page and the ten thousand other pages about that service. Once. Not
`/roma/servizi-roma/impianti-elettrici-roma-roma/`. That is stuffing and it is a
**Harmful** tier tactic.

**Never change a URL without a 301.** Changing URLs for cosmetic reasons is one
of the most reliable ways to lose traffic. If you must, redirect every old URL to
its closest new equivalent, one hop, and update every internal link to point at
the new address.

**Decide the trailing-slash policy once**, apply it in links, canonicals, and the
sitemap. See `01-diagnose.md`.

**Do not put dates in URLs** unless the content is genuinely time-bound news.
`/2024/guide-to-x/` looks stale in 2026 and cannot be updated without a redirect.

## The hub and spoke pattern

The structure that works for almost every service business, e-commerce category,
and documentation set.

```
        ┌─────────────┐
        │    Home     │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │  Services   │  ← hub: what we do, links to every leaf
        └──┬───┬───┬──┘
           │   │   │
     ┌─────▼┐ ┌▼───▼─┐ ...   ← leaves: one per cluster, one intent each
     │Elec. │ │Roofs │
     └──┬───┘ └───┬──┘
        └─────────┘             ← leaves link to each other where relevant
```

Rules that make it work:

1. **The hub links to every leaf.** Always. This is how crawl discovery and
   authority flow reach them.
2. **Every leaf links back to the hub**, with the hub's target phrase as anchor.
3. **Leaves link to each other when the relationship is real.** Electrical work
   and bathroom renovation genuinely co-occur; electrical work and roof
   insulation mostly do not. Fake cross-links dilute the signal and annoy readers.
4. **The home page links to the hub, not to all fifty leaves.** A homepage with
   fifty links passes a fiftieth of its weight to each.

For a local business add a second axis when, and only when, you have genuinely
distinct content per area:

```
/servizi/impianti-elettrici-roma/          the service
/zone/roma-nord/                           the area, if you have real content
```

Location pages with nothing but the city name swapped are doorway pages, a named
violation of Google's spam policies, and they get the whole site demoted. Build
an area page only when you have real jobs, real photographs, and real specifics
for that area. Ten cities with nothing to say each is worse than one city with
something to say.

## Internal linking

The most undervalued lever in this whole skill, and the only one you can pull
without anyone's permission.

**Anchor text is a relevance signal you control.** Link to the electrical page
with the words *"rifacimento dell'impianto elettrico"*, not with *"click here"*
or the bare URL. Vary it naturally across links; do not use the identical exact
phrase forty times, which reads as manipulation.

**Link from strong pages to pages that need help.** Your homepage and your most
linked-to article have authority. A new page linked from them is discovered and
weighted faster than one linked from the footer.

**Contextual links beat navigational links.** A link inside a sentence in the
body carries more weight than the same URL in a nav bar repeated site-wide,
because it is a specific editorial choice about relevance.

**Fix orphans first.** A page with zero internal links is invisible regardless of
its sitemap status. `scripts/audit-page.mjs` reports orphans when run against a
directory.

**Three clicks from the homepage.** Not a law, but a good forcing function: if
something takes six clicks to reach, the hierarchy is wrong.

**Breadcrumbs.** Cheap, help users, produce a real rich result in Google, and
reinforce hierarchy. Add `BreadcrumbList` structured data. See
`05-structured-data.md`.

## Pagination and filters

Where large sites leak crawl budget.

- **Paginated series:** every page gets a self-referencing canonical. Do not
  canonical page 2 to page 1; that hides page 2's items. `rel=next`/`rel=prev` is
  no longer used by Google, so just link them clearly in the HTML.
- **Filters and facets:** most produce near-duplicate pages. Pick the handful of
  filter combinations that have real search demand, give them clean indexable
  URLs, and `noindex` the rest. `?colour=red&size=m&sort=price_asc` should not be
  in the index.
- **Search results pages:** `noindex` them. Google's guidelines name internal
  search results as low value.
- **Infinite scroll:** must have paginated URLs behind it, or only the first
  batch will ever exist.

## Multilingual and multiregional

Only if you actually serve multiple languages or countries.

- Separate URLs per language. `hreflang` annotations, reciprocal, including a
  self-reference and an `x-default`.
- Do not auto-redirect by IP. It traps crawlers in one locale and frustrates
  users. Offer a switch.
- Machine-translated content with no review is scaled content abuse. Translate
  properly or do not translate.

## Consolidation

When an audit finds five thin pages competing for one cluster, merging beats
improving each. Method:

1. Pick the strongest URL as the destination — usually the one with the most
   links and impressions, not the newest.
2. Move the genuinely unique content from the others into it, organized under
   headings.
3. 301 the others to it.
4. Update every internal link to point at the destination directly.
5. Update the sitemap.

Expect a dip for a few weeks. Consolidation is one of the few interventions with
a well-documented positive effect on both classic and AI surfaces, because it
turns five partial answers into one complete one. See the coverage argument in
`02-keywords.md`.

## The architecture deliverable

A tree, and a table of redirects if anything moved:

```
/                                  home            [exists]
/servizi/                          hub             [create]
/servizi/impianti-elettrici-roma/  leaf            [create]
/servizi/tetti-roma/               leaf            [create]
...
```

Plus, for every leaf: which pages link to it, and with what anchor. If you cannot
name at least two internal links pointing at a new page, it will be an orphan on
the day it ships.
