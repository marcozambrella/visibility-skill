# Measurement: proving it, or admitting you cannot

Set up the instruments before you change anything. A change made without a
baseline cannot be evaluated, and "traffic went up" without a control is a
seasonal effect with extra steps.

## The instruments

**Google Search Console.** Free, first-party, and the only source of truth for
Google. Verify by DNS so it survives hosting changes. What to use it for:

- *Performance → Queries*: which queries produce impressions and clicks. The
  starting point for `02-keywords.md`.
- *Performance → Pages*: which pages perform. Filter by query to see the mapping
  between them, and to find cannibalization (two pages, one query).
- *Performance → Search appearance*: AI Overview and AI Mode impressions and CTR,
  broken out. This is the closest thing to an "AI ranking" metric that exists,
  and it is first-party. Google added a generative AI performance report in 2026.
- *Pages (Indexing)*: why URLs are excluded. See `01-diagnose.md`.
- *Core Web Vitals*: field data grouped by URL pattern.
- *Links*: who links to you, according to Google.

Data is capped at 16 months. **Export monthly to CSV** or you will lose the
baseline you need in a year. This is the single most valuable five minutes of
setup in this file.

**Bing Webmaster Tools.** Free, gives absolute keyword volumes, and covers the
surface Copilot draws on. Verify it and forget it.

**GA4.** For behavior after the click. Note that GA4 added a native *AI Assistant*
channel in May 2026, which groups recognized assistant referrers.

**Server logs.** The only place you can see what crawlers actually did. If you
can get them, they answer questions nothing else can: is Googlebot crawling this
section at all, is `OAI-SearchBot` fetching us, is the WAF returning 403 to
someone important.

## The KPIs, in the right order

Report these, in this order, because it mirrors the funnel:

1. **Indexed pages** vs pages that should be indexed. A ratio, not a count.
2. **Impressions** for the target query clusters. This is the retrieval signal
   and it moves first.
3. **Average position** for those clusters. Segment by cluster; a site-wide
   average is meaningless.
4. **Clicks and CTR.** CTR at a fixed position is a title and description
   problem, not a ranking problem.
5. **Local pack visibility** for the target queries, measured from the target
   geography.
6. **AI surface citations**, per engine, with the methodology below.
7. **Conversions.** Calls, forms, WhatsApp clicks, directions requests. This is
   the only number the business owner actually cares about.

Vanity metrics to refuse: domain authority scores from third-party tools (nobody
ranks by them), total keyword count (mostly noise), and "visibility index"
composites (they hide per-surface results, see `00-model.md`).

## Tracking conversions on a site without a form

Most small business sites convert by phone or messaging. Instrument those or you
are measuring nothing.

```html
<!-- Each of these is a conversion. Track the click. -->
<a href="tel:+390612345678" data-conversione="telefono">…</a>
<a href="https://wa.me/39…" data-conversione="whatsapp">…</a>
<a href="mailto:info@…" data-conversione="email">…</a>
```

With GA4, send an event on click of any element carrying that attribute. Without
GA4, a single small first-party script writing to your own endpoint is enough and
avoids consent complications. Also count, from the Google Business Profile
insights: calls, direction requests, website clicks, and messages. Those are
conversions that never touch your site.

## Tracking AI traffic

Assistant referrals are partially invisible, and you should say so rather than
pretending the number is complete.

**What works:** GA4's AI Assistant channel captures recognized referrers
(`chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`
and similar). Add a custom channel group to catch the ones it misses.

**What breaks:** many assistant clicks arrive with no referrer at all and land in
Direct. Some arrive through a redirect that strips it. There is no reliable way
to attribute all of it.

**The workaround worth doing:** watch Direct traffic to deep pages. Nobody types
`/servizi/impianti-elettrici-roma/` from memory. A rise in Direct traffic to
internal pages, with no campaign running, is usually assistant or messaging-app
traffic.

**Search Console covers the Google side properly.** AI Overview and AI Mode
impressions are reported there, first-party. Use it rather than a third-party
"AI visibility" tool for anything Google.

## Measuring AI citations without fooling yourself

The design constraints from `06-ai-search.md`, restated as a procedure. This
matters because AI answers are unstable enough that a naive before/after test
will produce a confident wrong conclusion.

**Build a prompt panel** — the fixed set of questions you will re-run forever:

- 10-20 information needs, drawn from the mapped clusters.
- **3-5 paraphrases each.** People ask differently.
- Include unbranded discovery prompts ("chi può rifare un impianto elettrico a
  Roma"), branded prompts ("cosa fa Edil D'Amico"), and comparison prompts.

**Run it properly:**

- **7-8 repetitions per prompt.** Below this you cannot distinguish a change from
  generation noise.
- Fresh session each time, logged out, location set explicitly.
- Record the engine, the mode (search on or off), the model if visible, and the
  date.
- Log: were we mentioned, were we cited with a link, where in the answer, who
  else appeared, and **was what it said about us correct**.
- Keep the nulls. Prompts where nobody was cited are the denominator.

**Report it as a rate with an interval**, not as a screenshot. "Mentioned in 12
of 40 runs (30%) for the electrical cluster on Perplexity, up from 3 of 40 (7.5%)
in January" is a finding. One screenshot of a good answer is an anecdote.

## Experiment design

If you want to claim causation rather than correlation:

- **Change one thing at a time**, or accept that you cannot attribute the result.
- **Use a control group.** Comparable pages you did not touch. Seasonal and
  algorithmic effects hit both; the difference between them is your effect.
- **Wait long enough.** Indexing days, ranking weeks, authority months.
- **Note the confounds.** Google runs core updates continuously; a ranking change
  in the same week as a core update is not attributable to your work.
- **Log every change with its date**, in a file in the repository. The change log
  is what lets you explain a drop six months later. Nothing else will.

## The monthly report

One page. This structure:

1. **What changed this month** — the work, dated.
2. **The funnel numbers** — indexed, impressions, position, clicks, conversions,
   each against last month and last year.
3. **Per-surface** — organic, local pack, Google AI surfaces, assistants.
   Separately. Never blended.
4. **What we learned** — including what did not work.
5. **Next month** — three things, prioritized.

Do not include: a graph of keyword count, a domain authority score, a list of
tasks completed with no outcome attached, or a screenshot of a single good AI
answer.

## The honest sentence

Some of this is not measurable with the tools that exist. Assistant referral
attribution is incomplete, AI citation rates are noisy, and the link between an
AI citation and revenue has one suggestive quasi-experiment behind it whose
placebo test was not significant.

Say that. A client who is told the limits trusts the numbers you do report. A
client who is given a confident number for something unmeasurable eventually
finds out.
