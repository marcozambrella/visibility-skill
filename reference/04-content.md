# Content: deserving the query

Stages 3 to 5. This is where the page earns retrieval, survives reranking, and
gets quoted. The order matters: a page that is not retrieved cannot be quoted, so
do the relevance work before the extractability work.

## The title tag

The highest-leverage 60 characters on the page. It is a ranking input, the
clickable headline in results, and the label an assistant uses when it names you.

- **Lead with the thing searched for.** `House rewiring in Manchester`
  beats `Services | Example Renovations | Excellence since 2010`.
- **50-60 characters** before truncation on desktop, less on mobile. Being cut off
  is not a ranking penalty, it is a click penalty.
- **Unique across the site.** Duplicate titles are a signal that the pages are
  duplicates. `audit-page.mjs` flags them.
- **Brand at the end, separated**, and only if the brand is worth the characters.
  For an unknown local business it usually is not; for a known one it lifts CTR.
- **No stuffing.** `Electrician Manchester | Electrician Manchester North |
  Cheap Electrician Manchester` is a **Harmful** tier pattern. Keyword stuffing measurably
  *reduced* position-adjusted visibility in controlled GEO testing (17.7% vs
  19.3% baseline), so it fails on the new surfaces too.

Google rewrites titles for roughly a third of results. It does so most often when
the title is stuffed, boilerplate, or does not match the page. A good title gets
rewritten less.

## The meta description

Not a ranking factor. It is ad copy that controls the click.

- 120-160 characters, one sentence of what the page delivers, one of why to click.
- Include the query phrasing, because matched terms are bolded and bolding drives
  clicks.
- Unique per page. A missing description means Google writes one from the page,
  which is often fine; a duplicated one across 40 pages is a quality signal
  against you.

## Headings

Headings are the retrieval unit. Modern retrieval works over passages, not whole
documents, and the heading is what tells the system what the passage under it is
about. This is the single most useful structural change you can make.

- **One H1**, matching the page's primary intent, usually close to the title but
  written for a human reading the page.
- **H2 per sub-question**, phrased the way the question is asked. A heading of
  `How much does it cost to rewire a house?` is retrievable for that query. A
  heading of `Investment` is not retrievable for anything.
- **No level skips.** H2 → H4 confuses the outline for both parsers and screen
  readers.
- **Headings are not decoration.** Do not use a heading tag to make text big; use
  CSS. Do not skip heading tags because the design has no visible heading; if a
  section needs no heading, it is probably not a section.

## Answer-first passages

Under each heading, the first two sentences must contain the answer. Then the
nuance, then the detail.

```
## How much does it cost to rewire a three-bedroom house?

A full rewire of a 90 m² house to current wiring regulations costs
between £X and £Y, survey and certificate included. The price depends
on three things: [...]
```

This works for three independent reasons, which is rare:

1. Humans scan; the answer is where they look.
2. Featured snippets are extracted from exactly this shape.
3. A model retrieving a passage gets a self-contained answer rather than a
   fragment that needs the rest of the page to make sense.

**Evidence tier: Supported.** Extractable evidence — statistics, definitions,
dates, direct quotations — improved citation in controlled settings, with
quotations around +41% and statistics around +25% relative to baseline. The
caveat that matters: **those measurements assume the document is already in the
model's context.** They do not create retrieval. Do the relevance work first.

Around 44% of LLM citations come from the first 30% of a document, so front-load.

## Self-contained sections

Write each section so it survives being lifted out of the page. That means:

- No pronouns referring back across headings. "It costs less" is useless out of
  context; "a partial rewire costs less" is not.
- No "as mentioned above". The reader of that passage did not read above.
- Name the entity in each major section: the business name, the service, the
  city. Not stuffed — named, once, where a human would naturally repeat it.
- Units, currencies, and dates spelled out. "£3,500 (updated January 2026)"
  survives extraction; "around three and a half thousand" and "this year" do not.

## Information gain

The concept behind Google's helpful-content guidance and the thing that actually
separates a page that ranks from a page that does not, now that competent prose
is free.

> What does this page contain that no other page in the results already contains?

Sources of genuine information gain, roughly in order of cost:

- **Your own numbers.** Prices, timelines, measured results, failure rates. A
  contractor who publishes "rewiring a one-bedroom flat takes 9 to 12 working
  days" has said something no competitor's generic page says.
- **Photographs of your own work.** Not stock. Before, during, after, with
  captions naming what was done. Impossible to copy, and a direct E-E-A-T signal.
- **Named constraints and edge cases.** "In a 1960s block you cannot chase
  cables into a load-bearing wall, so it runs in surface trunking instead."
  Only someone who has done the work knows this.
- **Original data.** A survey, an analysis of your own job records, a comparison
  you actually ran.
- **A clear negative.** "We do not do X" is information, and it is trusted
  because it costs you something to say.

What is *not* information gain: rewording the top three results, adding a
paragraph of definitions, "in conclusion" summaries, and an FAQ that restates the
body. Google's own self-assessment asks directly whether the content is "mainly
summarizing what others have to say without adding much value."

## E-E-A-T in practice

Experience, Expertise, Authoritativeness, Trust. Trust is the one Google names as
most important. These are not markup; they are page facts.

For a small business, the concrete checklist:

- **A real About page** naming real people, with a photograph, with what they
  actually do and how long they have done it.
- **Author or reviewer attribution** on anything advisory. "Reviewed by
  [name], site manager" beats an anonymous page.
- **Verifiable credentials** where they exist: VAT number, licence numbers,
  certifications, insurance, trade association membership. Put them in the footer
  and in structured data.
- **Real contact information**, on every page, not in a form-only contact page.
  A phone number that a human answers is a trust signal to people and a NAP
  signal to Google.
- **Evidence of work done.** Case notes, project photos, dated.
- **Reviews and their responses**, on the profile and quoted on the site.
- **Physical address or a clearly stated service area.** Ambiguity here reads as
  evasion.

Google's "who, how, why" framework, verbatim in intent: is it self-evident *who*
made this, *how* it was made (including disclosure of AI use), and *why* it
exists — to help someone, or to catch search traffic?

## Freshness

Freshness is a relevance signal for queries where recency matters and noise
everywhere else. Two things are true at once:

- Content under three months old is cited more often in AI answers, and pages
  untouched for long periods lose citation eligibility on time-sensitive topics.
- Changing the date without changing the content is explicitly named in Google's
  guidance as a thing not to do. It does not work and it looks like manipulation.

So: update pages when something actually changed — a price, a regulation, a
process, a new project — and say what changed. Leave evergreen pages alone.

## Length

There is no target. Google states it directly: "Are you writing to a particular
word count because you've heard or read that Google has a preferred word count?
(No, we don't.)"

The right length is the length that answers the mapped cluster's sub-questions
completely and stops. A service page for a local trade is usually 600-1200 words
of substance. If you find yourself padding, the cluster was too small for its own
page and belongs merged into the hub.

## Images and media

- **Real alt text** describing the image's content and function. Not the file
  name, not a keyword list. Empty `alt=""` is correct for purely decorative
  images, and is different from missing alt.
- **Descriptive file names.** `bagno-rifatto-prati-2025.jpg`, not `IMG_4471.jpg`.
- **Captions.** Read more than body text, and they are indexed.
- **Width and height attributes** on every image, always, to reserve space and
  avoid layout shift. See `08-performance.md`.
- **Video and audio need a transcript** to be retrievable at all. A video with no
  transcript is invisible to every text retrieval system.

## The checks before you ship

Run `scripts/audit-page.mjs`, then read the page yourself and answer:

1. Does the title contain the words someone would type?
2. Is there exactly one H1, and does it match the intent?
3. Does every H2 correspond to a real sub-question from the cluster?
4. Does the first paragraph under each H2 answer it in two sentences?
5. Can any section be lifted out and still make sense?
6. What is on this page that is not on the competitors' pages?
7. Would a person reading this know who wrote it and why they should be believed?

Seven questions. If you cannot answer number six, the page is not finished, and
no amount of structural optimization will fix that.
