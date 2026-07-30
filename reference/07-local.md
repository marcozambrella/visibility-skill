# Local: where the website is not the main asset

For a business that serves a geographic area, the ranking system that decides
whether the phone rings is not the one that ranks web pages. It ranks Google
Business Profiles. Your website is an input to it.

State this to the client before anything else, because it reorders their budget:

> A complete profile with photographs and thirty reviews will outperform a
> beautiful website with neither. If you have to choose, choose the profile.

## The weights

Local pack ranking signal groups, from the 2026 aggregate studies:

| Signal group | Weight | Who controls it |
|---|---|---|
| Google Business Profile signals | ~32% | The owner, directly |
| On-page signals | ~19% | You |
| Review signals | ~16-20%, rising | Customers, prompted by the owner |
| Link signals | ~15% | Earned |
| Behavioral signals | ~8% | Emergent |
| Citation signals | ~7% | One-time setup, then consistency |

Google's own framing is three factors: **relevance** (does the profile match the
query), **distance** (how far from the searcher), **prominence** (how well known
is this business, online and offline). Distance you cannot change. Relevance and
prominence are the whole game.

One 2026 change worth knowing: *"business is open at the time of search"* entered
the top five individual factors. Accurate opening hours, including holiday hours,
are now a ranking input, not just a courtesy.

**For AI surfaces the weights invert.** Studies of local queries in AI answers
find the Business Profile matters far less, citations matter about twice as much,
and on-page content and links carry nearly double the weight. AI Overviews now
appear on around 40% of local business queries, and about 45% of consumers report
using AI tools for local recommendations. So the website work is not wasted; it
is where the AI-surface visibility comes from while the profile carries the map
pack.

## The Google Business Profile

This is human work. An agent cannot verify a business. Put it in the human plan
with a deadline. See `11-human-playbook.md` for the step-by-step version to hand
to the owner.

**Categories are the highest-leverage field on the profile.** The primary
category does more to determine which queries you appear for than any other
single edit. Choose the most specific category that describes the main service,
not the broadest one that describes everything. A general "Contractor" competes
with every trade; "Electrician" competes with electricians and wins electrical
queries. Add secondary categories for the other real services, in order of
importance, and do not add categories for services you do not perform.

**The rest of the profile, in order of value:**

- **Name.** The real business name. Adding keywords to it ("Mario Rossi
  Elettricista Roma Economico") is a guideline violation, it is the single most
  reported spam type by competitors, and it gets profiles suspended.
- **Address or service area.** If customers cannot visit, hide the address and
  set a service area. Never publish a virtual office.
- **Hours**, including special hours for holidays.
- **Phone.** A local number, matching the website exactly.
- **Website link**, to the most relevant page, not always the homepage.
- **Services**, itemized, with descriptions. These are matched against queries.
- **Products**, if applicable.
- **Attributes** — accessibility, payment methods, languages, women-owned, and so
  on. Cheap and they surface as filters.
- **Description.** 750 characters. Write what the business does, where, and since
  when. Not a slogan.
- **Photos.** Covered below, and more important than owners believe.
- **Messaging**, if someone will actually answer it. An unanswered chat is worse
  than no chat.

**Note:** the old Q&A feature has been replaced by an AI answering layer that
generates responses from profile data, reviews, and the website. That raises the
value of having accurate, specific information in all three places, because the
answer is now synthesized rather than written by you.

**Posts** lift click-through in the panel; the evidence that they move pack
position is weak. Treat them as conversion assets, not ranking assets, and do not
promise a ranking effect.

## Reviews

The second-largest lever, the most visible one, and the one owners neglect.

**What matters, in order:**

1. **Count and velocity together.** A business with 150 reviews generally
   outranks a comparable business with 20. But a burst of 40 reviews in a week
   after two years of silence looks manufactured and gets filtered. Steady beats
   spiky.
2. **Recency.** Old reviews decay in influence. A profile whose newest review is
   from 2023 reads as a business that stopped working.
3. **Rating.** Counterintuitively, a perfect 5.0 converts worse than 4.6-4.9,
   which reads as real. Do not chase 5.0.
4. **Text content.** Reviews that name the service and the area are relevance
   signals, not just trust signals. "Hanno rifatto l'impianto elettrico nel mio
   appartamento a Monteverde" is worth more than "bravissimi".
5. **Owner responses.** Respond to all of them, positive and negative, within a
   few days. It is a visible engagement signal and the response is read by future
   customers far more than the review.

**How to ask, legally and effectively:**

- Ask in person at handover, when satisfaction peaks, then follow with the link.
- Use the profile's short review link. Do not send people hunting.
- Ask every customer, not only the happy ones. Selective solicitation ("review
  gating") violates Google's policy and, in several jurisdictions, consumer law.
- Never pay for reviews, never offer a discount for one, never write them
  yourself, never trade them with another business. Detection is good, penalties
  are profile-level, and recovery is slow.
- A QR code on the invoice and on the van works better than an email.

**Negative reviews.** Respond factually, briefly, publicly, and offer to
continue offline. Never argue, never disclose customer details. A well-handled
one-star review does less damage than a defensive reply to a three-star one. Only
flag reviews that actually violate policy (fake, off-topic, abusive), and expect
most flags to fail.

## Photographs

Underestimated, and the one thing a competitor cannot copy.

- Google's systems can identify stock photography, and authentic photos correlate
  with better engagement. Use real ones.
- Cover the categories Google exposes: exterior, interior, at-work, team,
  identity. For a trade, "at work" and "finished job" are the ones customers open.
- Upload steadily rather than fifty at once.
- Geotagging photo EXIF data does **not** affect rankings. This is a persistent
  myth. Google strips EXIF on upload. Do not sell it.
- Name the files descriptively for the website copies. That does matter on the
  site, not on the profile.

## NAP and citations

**NAP** is Name, Address, Phone. The requirement is boring and absolute:
**byte-identical everywhere.** "Via Roma 12" and "Via Roma, 12" and "V. Roma 12"
are three different businesses to a matching algorithm.

Write the canonical NAP block once, in a file, and copy-paste it everywhere:

```
Name:    Exact Legal or Trading Name
Address: Via Example 12, 00100 Roma RM, Italia
Phone:   +39 06 1234567
Website: https://example.com/
```

**Where to list, for Italy**, in order of value:

1. **Google Business Profile** — the one that matters.
2. **Bing Places** — Bing holds around 10% of Italian search and feeds Copilot.
3. **Apple Business Connect** — every iPhone user asking Siri or Maps.
4. **PagineGialle.it** — still the most authoritative Italian directory.
5. **Virgilio / TuttoCittà** — high authority, still consulted.
6. **Facebook page** — a citation and a `sameAs` target even if you never post.
7. **Trade-specific directories** — for construction: chamber of commerce
   listings, trade association member directories, and any supplier or
   manufacturer "find an installer" page. These are the highest-quality citations
   available to a trade business and almost nobody claims them.
8. **The chamber of commerce (Camera di Commercio) record**, which is public and
   authoritative, and should match.

Do not buy a citation-blasting service. A hundred junk directories add nothing
and create a hundred places where your NAP will drift out of sync. Twenty
accurate listings beat two hundred sloppy ones.

**Audit citations** by searching for the exact phone number in quotes, and for
the business name plus the city. Inconsistencies show up immediately.

## On-site local signals

The 19% you control directly.

- **NAP in the HTML on every page**, as real text, in the footer. Not in an
  image. Marked up with `LocalBusiness` structured data. See
  `05-structured-data.md`.
- **A contact page** with the address, an embedded map, hours, and parking or
  access notes.
- **The city in the title and H1 of service pages.** Once, naturally.
- **Real local specifics in the content.** Neighbourhoods you work in, building
  types typical of the area, local regulations, travel time. This is what
  separates a real local page from a template.
- **Service-area or location pages only where you have something to say.** Ten
  identical pages with the city name swapped are doorway pages, an explicitly
  named spam violation, and the penalty applies to the whole site. One good page
  about the city you actually work in beats ten fake ones.
- **Embedded Google Map** of the profile location. Plausible tier, cheap, and it
  helps users.

## The order of work

For a local business starting from nothing, this is the sequence, and deviating
from it wastes money:

1. Create and verify the Google Business Profile. Nothing else matters until this
   exists.
2. Complete every field, choose categories carefully, upload twenty real photos.
3. Get the first ten reviews from recent customers.
4. Fix NAP consistency across the six or seven listings that matter.
5. Put accurate NAP and `LocalBusiness` schema on the website.
6. Build one service page per real service, with local specifics.
7. Then, and only then, worry about content marketing, links, and AI visibility.

An agent can do steps 5 and 6. Steps 1 through 4 are the owner's, and they are
the ones that move the needle. Say so plainly rather than delivering step 5 and
implying the job is done.
