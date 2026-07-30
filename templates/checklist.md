# Visibility checklist

One page. Print it. Work down it in order — a failure at any stage makes
everything below it pointless.

## Stage 1 — Eligible

- [ ] `robots.txt` on production does not disallow the site
- [ ] CSS and JavaScript are not blocked in `robots.txt`
- [ ] No accidental `noindex` (check the HTTP header too, not just the meta tag)
- [ ] Every important page returns 200, not a soft 404
- [ ] One canonical host: HTTP → HTTPS, www or non-www, one trailing-slash policy
- [ ] Canonical tag present, absolute, self-referencing
- [ ] Main content is in the served HTML, not injected by JavaScript
- [ ] `sitemap.xml` exists, lists only canonical indexable pages, referenced from `robots.txt`
- [ ] Search Console verified, sitemap submitted, Indexing report read
- [ ] Bing Webmaster Tools verified

## Stage 2 — A page per intent

- [ ] Every service, product, or topic people search for has its own URL
- [ ] Each URL targets exactly one cluster, and each cluster has exactly one URL
- [ ] No two pages compete for the same query
- [ ] Every page is reachable within three clicks of the homepage
- [ ] No orphans: every page has at least two internal links pointing at it
- [ ] URLs are readable, lowercase, hyphenated, and stable

## Stage 3 — The page deserves the query

- [ ] Title leads with what people type, 50-60 characters, unique
- [ ] Meta description written, unique, 120-160 characters
- [ ] Exactly one H1, matching the intent
- [ ] H2s phrased as the sub-questions people actually ask
- [ ] First two sentences under each heading contain the answer
- [ ] Every section makes sense if lifted out on its own
- [ ] At least one thing on the page is not on any competitor's page
- [ ] Real numbers, dates, and units, not vague adjectives
- [ ] Who wrote it and why they should be believed is visible on the page
- [ ] Contact details on every page, as text

## Stage 4 — Machine-readable

- [ ] `Organization` + `WebSite` + page-type JSON-LD, as one `@graph` with `@id`s
- [ ] All URLs in the structured data are absolute
- [ ] Markup matches what is visible on the page
- [ ] No self-serving `aggregateRating` or `review` on your own site
- [ ] `BreadcrumbList` where there is a hierarchy
- [ ] Open Graph title, description, and **absolute** image URL
- [ ] `lang` attribute set

## Stage 5 — Local (skip if not location-based)

- [ ] Google Business Profile claimed and verified
- [ ] Most specific primary category, plus real secondary categories
- [ ] Address published, or hidden with a service area set
- [ ] Hours accurate, including holidays
- [ ] Twenty or more real photographs, no stock
- [ ] Ten or more reviews, arriving steadily, all responded to
- [ ] Identical name, address, phone across every listing
- [ ] Listed on Bing Places, Apple Business Connect, and the main national directory
- [ ] Trade association and supplier installer-directory listings claimed
- [ ] `LocalBusiness` schema on the site matches the profile exactly

## Stage 6 — Fast

- [ ] LCP under 2.5s at the 75th percentile of real users
- [ ] INP under 200ms
- [ ] CLS under 0.1
- [ ] The LCP image is not lazy-loaded
- [ ] Every image has `width` and `height`
- [ ] Images served as AVIF or WebP, at the size actually displayed
- [ ] Fonts self-hosted with `font-display: swap`
- [ ] Third-party scripts audited: each one earns its cost

## Stage 7 — Known

- [ ] Trade association and chamber of commerce listings claimed
- [ ] Supplier and manufacturer installer directories claimed
- [ ] Partner businesses cross-referring
- [ ] Unlinked mentions found and converted, quarterly
- [ ] One outreach action per month, done and logged
- [ ] Nothing bought: no links, no reviews, no directory blasts

## Stage 8 — Measured

- [ ] Search Console exported to CSV monthly (data expires at 16 months)
- [ ] Phone, WhatsApp, and email clicks tracked as conversions
- [ ] Google Business Profile insights recorded monthly
- [ ] Local pack position checked monthly from the same location
- [ ] AI prompt panel run quarterly: 3-5 paraphrases, 7-8 repetitions each
- [ ] Fidelity checked: what assistants say about the business is correct
- [ ] A dated change log exists in the repository
