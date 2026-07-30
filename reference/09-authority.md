# Authority: links, mentions, and being a known thing

The stage nobody can shortcut and every tool promises to. Authority is the reason
one of two identical pages ranks and the other does not, and it is the entire
explanation for the recognition-versus-discovery gap in AI answers: models
describe you accurately when asked (99.4% recognition for named products) and
almost never bring you up unprompted (3.32% in organic discovery queries). The
gap is not a markup problem. It is a fame problem.

## Two currencies

**Links** still work for classic ranking. A link is a vote that carries context
through its anchor text and its surrounding page.

**Mentions** — your name in text, with or without a link — are the currency of AI
visibility. Across 75,000 brands, brand mentions correlated with AI visibility at
0.664 against 0.218 for backlinks: about three times stronger. Brands with dense,
consistent unlinked mentions across authoritative domains were about 3.4 times
more likely to be surfaced in AI answers. Earned media accounts for roughly 84%
of AI citations; paid and advertorial content, 0.3%.

Practical reading: **pursue coverage, not links.** The link is a bonus on top of
the mention. Chasing links directly leads to the tactics that no longer work and
sometimes get penalized; chasing coverage produces both.

## What actually earns coverage for a small business

Ordered by realistic yield for a business with no marketing department. None of
this is agent work; it is in `11-human-playbook.md` as a schedule.

**Trade associations and chambers of commerce.** Membership usually includes a
directory listing with a link, from a domain with real authority and topical
relevance. Cheap, permanent, and almost nobody claims theirs.

**Suppliers and manufacturers.** Every significant manufacturer runs a "find an
approved installer" page. If you install their products, you probably qualify and
have never asked. These are the highest relevance links available to a trade
business.

**Local press and neighbourhood outlets.** They need stories and have no staff.
Give them one with a fact in it: a project with an unusual constraint, a piece of
building history uncovered during works, a piece of practical advice ahead of a
seasonal problem. Not a press release about your rebrand.

**Local institutions.** Schools, parishes, sports clubs, charities. Sponsorship
and pro bono work produce genuine mentions on genuine local domains, and they are
mentions in exactly the geographic context you want to rank in.

**Partner businesses.** Architects, estate agents, interior designers, property
managers. Mutual referrals become mutual mentions. This is the highest-converting
channel in the list and its SEO value is a side effect.

**Communities where the topic is discussed.** Reddit is the single most-cited
domain across major AI engines, around 40% frequency, and specialist forums feed
the same corpora. Participate as a knowledgeable person answering questions.
Posting promotional links is spam, gets removed, and achieves nothing. Answering
forty questions well over a year builds a footprint no competitor can buy.

**Your own original data.** The one asset that reliably attracts links without
asking: publish something only you know. A tradesperson has job records. "Cosa
abbiamo trovato dietro i muri in 200 ristrutturazioni a Roma" is a story a local
paper runs and other sites cite. It is also, not coincidentally, the definition
of information gain from `04-content.md`.

## Converting unlinked mentions

Someone wrote your name without linking. This is the cheapest link acquisition
that exists and almost nobody does it.

Find them:

```
"Business Name" -site:example.com
```

Run it monthly, plus a Google Alert on the business name and on the owner's name.
For each mention, a short polite email: thank them, and ask if they would add a
link so readers can find you. Conversion rates on this are far higher than cold
outreach because the relationship already exists.

Note that for AI visibility the mention already did its job unlinked. The link is
for classic ranking.

## What does not work

**Buying links.** A link scheme under Google's spam policies. Modern enforcement
mostly neutralizes the links rather than penalizing the site, which means you
paid for nothing. Occasionally it does penalize.

**Guest post networks and "we'll place your article on 50 sites".** Same
category. The sites are usually a private blog network, and the footprint is
detectable.

**Directory blasting.** Two hundred junk directories produce zero authority and
two hundred places for your NAP to drift out of sync. See `07-local.md`.

**Reciprocal link exchanges at scale.** "Link to me and I'll link to you" between
unrelated businesses is a named pattern.

**Comment and forum link dropping.** Nofollowed, removed, and it burns the
community access that would have actually helped.

**Press release distribution services.** Syndicated copies of one release across
hundreds of low-quality sites. Google treats these as advertorial; recall that
paid and advertorial content accounts for 0.3% of AI citations.

The common thread: anything that can be bought at volume has been priced in
already. The things that work are slow, and that is precisely why they work.

## Entity building

Beyond links and mentions there is a third thing: being a resolvable entity that
systems can identify with confidence. This is what gets you a knowledge panel and
what makes an assistant describe you correctly rather than confusing you with a
similarly named business.

The ingredients:

- **One canonical name**, used identically everywhere. Not "Edil D'Amico", "Edil
  DAmico srl", and "Edildamico" across three profiles.
- **A consistent one-sentence description** of what the business is, reused
  verbatim on the website, the Google profile, social bios, and directory
  listings. Contradictory descriptions produce contradictory answers.
- **`sameAs` links** in your `Organization` structured data pointing at every
  profile you control. This is what tells a machine that these accounts are the
  same entity. See `05-structured-data.md`.
- **A verifiable identifier**: VAT number, company registration, licence number.
  In the EU the VAT ID is public and checkable, which makes it an unusually
  strong trust signal.
- **Corroboration from independent sources.** The chamber of commerce record, a
  trade association listing, a local news mention. An entity that only asserts
  itself is weaker than one that is described by others.

Wikipedia and Wikidata matter here — Wikipedia accounts for between 26% and 48%
of ChatGPT's top-10 citation share — but do not attempt to create a Wikipedia
article for a small business. It will be deleted, and the attempt is visible.
Notability is a prerequisite, not a goal.

## Anchor text

For the links you do influence — internal links, directory listings, partner
sites:

- Descriptive and varied. The service name, the business name, the page topic.
- Never a single exact phrase repeated across dozens of external links. That
  pattern is the signature of a purchased campaign.
- Naked URLs and the brand name are fine and natural; a natural link profile
  contains plenty of both.

## The realistic timeline

Say this out loud to clients, because the alternative is being blamed at month
three:

- **Weeks 1-4:** technical fixes, profile, structured data. Effects on
  indexing appear within days; ranking effects do not.
- **Months 2-3:** new pages get indexed and start collecting impressions. Long-tail
  queries move first. This is the first real signal.
- **Months 3-6:** competitive local queries begin to move, if the profile and
  reviews work is happening in parallel.
- **Months 6-12:** authority compounds. AI surface citations, if they come,
  generally come after classic visibility, not before.

Anyone promising page one in thirty days is selling either a brand-name query
they were already going to win, or nothing.
