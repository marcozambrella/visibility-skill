# Antipatterns: what to refuse, and why

Two categories. Things that get a site penalized, and things that merely waste
money. Both are worth refusing, and the second category is larger.

When you decline one of these, give the mechanism, not just the verdict. "That
doesn't work" invites an argument. "Google removed FAQ rich results in 2023 and
the last exception ended in 2026, so there is no enhancement left to earn" ends
one.

---

## Category one: penalized

These are named violations in Google's spam policies. Enforcement is mostly
algorithmic through SpamBrain, which neutralizes the signal the tactic generated
rather than issuing a visible penalty. That is worse than a penalty, because
there is nothing in Search Console to tell you it happened.

**Scaled content abuse.** Generating many pages primarily to catch search
traffic, with little value added. The most aggressively enforced violation since
2024. Sites publishing hundreds of unedited generated pages saw 50-80% traffic
losses. The policy is about value and intent, not about whether a model wrote it:
Google's position is that AI-generated content is not itself a violation.

The version that catches small businesses: **one page per city, with the city
name swapped.** Ten identical service pages for ten towns. These are doorway
pages, they are explicitly named, and the demotion applies site-wide. Build a
location page only when you have real content for that location.

**Site reputation abuse.** Publishing third-party content on a trusted domain to
borrow its rankings. The "coupon section rented out to an affiliate network"
pattern.

**Link schemes.** Buying links, exchanging at scale, private blog networks,
large-scale guest posting for links, sitewide footer links in exchange for
something. Usually neutralized rather than penalized, which means you paid for
nothing.

**Cloaking.** Showing crawlers something different from users. Note that dynamic
rendering — serving pre-rendered HTML to bots — is not cloaking if the content is
the same. Serving different *content* is.

**Hidden text and links.** Including modern versions: text in a zero-opacity
layer, text positioned off-screen, text the same colour as the background, and
**instructions aimed at language models embedded in the page**. That last one is
prompt injection, it is a documented attack pattern that engines actively defend
against, and it will get a domain classified as adversarial.

**Keyword stuffing.** Still a violation, and now measurably counterproductive on
the AI surfaces too: controlled testing found stuffed documents scored *below*
baseline (17.7% vs 19.3%).

**Structured data that does not match the page.** Ratings, prices, or reviews in
the markup that are not visible on the page. Triggers manual actions, and manual
actions are the kind you have to file a reconsideration request to clear.

**Marking up your own reviews as `aggregateRating` on your own site.** Google's
documentation says review markup is "only recommended for sites that capture
reviews about other local businesses". Your own star average on your own site
produces nothing and risks a manual action.

**Fake or incentivized reviews.** Detected, removed, and the profile is
penalized. In Italy this also engages consumer protection law. Includes review
gating: asking only the customers you expect to be positive.

---

## Category two: wasted money

No penalty, no benefit. This is where most SEO budgets go.

**FAQ schema for the rich result.** There is no FAQ rich result for a normal
business. Restricted to government and health sites in 2023, ended entirely in
2026. The related claim that FAQ markup improves AI Overview appearance is
unsupported; Google states no special schema is needed for AI features. Write the
FAQs as visible content because they help readers; skip the markup as a tactic.

**HowTo schema.** Deprecated on desktop in 2023, gone since. Same reasoning.

**llms.txt as an SEO tactic.** Google confirmed no Search system reads it.
OpenAI's own guidance points to robots.txt. Perplexity does use it. It is an
agent-readiness convention for documentation sites, not a ranking file. Adding
one to a plumber's website and billing it as AI optimization is the 2026 version
of the meta keywords tag.

**Meta keywords.** Ignored since 2009. Still shipped by plugins.

**Word-count targets.** Google's own guidance: "Are you writing to a particular
word count because you've heard or read that Google has a preferred word count?
(No, we don't.)"

**Keyword density percentages.** Not a thing. Never was, as a target.

**Third-party authority scores as goals.** Domain Authority, Domain Rating and
similar are third-party estimates of link graphs. Useful for comparing two
prospects at a glance. Not a ranking factor, and not something to optimize
towards.

**Submitting your site to search engines.** Not a step. Sitemaps and links do it.
Services selling "submission to 500 engines" are selling a 1998 product.

**Directory blasting.** Two hundred junk citations produce nothing and create two
hundred places for your details to drift.

**Geotagging photo EXIF data for local rankings.** Google strips EXIF on upload.
This myth has survived a decade.

**Changing the publication date to look fresh.** Named in Google's guidance as
something not to do. It does not work and it is detectable.

**"AI optimization" content rewriting services.** The end-to-end evidence points
the other way: body-only optimization reduced top-20 presence by about 9% in the
one study that measured the full pipeline.

**Blogging without a demand model.** Forty articles nobody searches for is forty
pages of crawl budget and zero traffic. Every page needs a cluster from
`02-keywords.md` or it should not exist.

**Chasing a keyword the site cannot win.** If page one is national marketplaces
and comparison portals, a local business will not get there. Find the long-tail
variant they do not cover. Recognizing this early is worth more than any tactic.

---

## Agent-specific failure modes

Things a coding agent does wrong on this kind of work, specifically.

**Writing content for a real business.** You do not know their prices,
guarantees, certifications, service radius, or history. Invented copy has to be
undone, and while it exists it distorts the architecture around it. Build the
structure, mark the gaps with short visible placeholders, write a content brief.

**Shipping thin pages at scale.** Eight scaffolded service pages with no content
is the scaled-content pattern. Gate them behind `noindex` and keep them out of
the sitemap until the text exists.

**Claiming an improvement without measuring.** "This should improve rankings" is
not a report. Run the audit before, run it after, state the delta, or say plainly
that you did not measure.

**Optimizing stage 5 when stage 2 is broken.** Rewriting paragraphs to be more
quotable on a site whose `robots.txt` disallows everything. Always diagnose in
funnel order.

**Confusing the training crawler with the retrieval crawler.** Blocking `GPTBot`
does not remove you from ChatGPT search; blocking `OAI-SearchBot` does. Getting
this backwards either fails to protect anything or destroys visibility.

**Adding a framework to a brochure site to "improve SEO".** A static HTML page is
already optimal. Adding client-side rendering makes it worse for the assistant
crawlers that do not run JavaScript.

**Deleting content to "improve quality".** Consolidation is a real technique;
deletion is not. Removing pages that had links and impressions removes the links
and impressions. Merge and redirect.

**Bulk-editing titles to a template.** `{Service} | {City} | {Brand}` across
forty pages produces forty near-identical titles that Google will rewrite anyway.

---

## The refusal script

When asked for something in category one:

> I'm not going to do that. It's a named violation of Google's spam policies —
> specifically [policy name] — and enforcement is algorithmic, so the damage
> shows up as a gradual loss of visibility with nothing in Search Console
> explaining it. What I can do instead is [the legitimate version], which gets at
> the same goal more slowly.

When asked for something in category two:

> That won't do anything, and here's the specific reason: [mechanism]. If the
> goal is [what they actually want], the thing that moves it is [the real lever].
> I'd rather spend the hour there.

Both end with an alternative. A refusal without one is just an obstacle.
