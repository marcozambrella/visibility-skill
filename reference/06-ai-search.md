# AI search: the evidence, and the snake oil

This is the file to read before you tell anyone anything about ChatGPT, AI
Overviews, or "GEO". The field is two years old, most of what is published about
it is inference dressed as research, and the one rigorous survey of it concludes
that almost none of the popular advice has been shown to work end to end.

That does not mean there is nothing to do. It means the things to do are mostly
the things that were already worth doing, and the honest version of this advice
is more useful to a client than the exciting version.

## The surfaces, and how they differ

**Google AI Overviews.** A generated summary above the results. Draws on the
Search index. Activates for roughly 13.7% of queries overall, rising to about
64.7% for queries phrased as questions. Roughly 53% of the domains it cites do
not appear in the organic top ten for the same query.

**Google AI Mode.** A conversational search surface. Uses *query fan-out*: it
decomposes one query into roughly 8-12 synthetic sub-queries, retrieves for all
of them in parallel, and synthesizes one answer. Citation overlap with AI
Overviews is about 13.7% — they are not the same system and you cannot optimize
for both by optimizing for one.

**ChatGPT.** Answers from parameters when it can, retrieves when it decides to.
Retrieval goes through its own index (`OAI-SearchBot`) and a search partnership.
Heavily weighted toward a small set of reference domains.

**Perplexity.** Retrieval-first by design. Cites nearly three times more sources
per answer than ChatGPT. Confirmed to fetch and use `llms.txt` for page
prioritization. Domain overlap with ChatGPT citations is about 11%.

**Claude, Gemini, Copilot.** Each with its own retrieval path; Copilot rides on
Bing, which is why Bing Webmaster Tools is not optional.

The practical consequence: **there is no single AI optimization.** Report and
measure per surface. Anyone selling you one number for "AI visibility" is
averaging away the only information in the data.

## What the research actually found

### The famous numbers, and what they mean

The foundational GEO paper (Aggarwal et al., KDD 2024) reported large gains from
content edits: adding quotations moved a position-adjusted word-count metric from
19.3% to about 27.2%, a relative gain near 41%; adding statistics reached about
25.2%.

The condition that never makes it into the blog posts: **those documents were
already in the model's five-document context window.** The experiment measured
how a model chooses between sources it has already retrieved. It says nothing
about whether your page gets retrieved, and nothing about traffic.

Also from the same work: **keyword stuffing made things worse** (17.7% vs 19.3%
baseline). The oldest bad tactic fails on the new surface too.

### The replication problem

**C-SEO Bench** (Puerto et al., 2025) tested the published GEO methods across
domains and tasks. Of 54 method-domain combinations, **three were significantly
positive, and none in question answering.** Under broad adoption, gains approach
zero, because the setting is competitive: one source's gain is another's loss.

**SAGEO Arena** (Kim et al., 2026) ran it end to end, with real retrieval instead
of a fixed context. Body-only optimization **reduced** average top-20 presence by
about 9%, top-10 presence after reranking by 16%, and final citation by 6%.
Automated GEO rewriting performed worse still.

Read that again before you rewrite a client's page to sound more quotable. The
one study that measured the whole pipeline found the popular intervention made
things worse, because rewriting for quotability degrades the topical signals that
get you retrieved in the first place.

### What did hold up

Three things replicated across studies:

1. **Topical relevance.** Called "the most reproducible factor". Explicit
   alignment between the query and the page. This is retrieval, not rhetoric.
2. **Position in the context window.** Moving a source higher has a greater
   effect than most rewrites. You influence this through ranking and authority,
   not through prose.
3. **Extractable evidence**, *conditional on retrieval*. Statistics, definitions,
   dates, quotations. Real ones. Cheap to add, so add them, but understand you
   are optimizing stage 5 of seven.

### Google's own position

Worth quoting to any client who has been sold an AI-readiness package:

> There are no additional requirements to appear in AI Overviews or AI Mode, nor
> other special optimizations necessary.

> You don't need to create new machine readable files, AI text files, or markup
> to appear in these features. There's also no special schema.org structured data
> that you need to add.

The stated requirements are: be indexed, be eligible to appear with a snippet,
meet the standard technical requirements. That is `01-diagnose.md`.

## llms.txt: the honest answer

A proposed file listing your site's important pages in Markdown for LLM
consumption. Status as of 2026:

- **Google**: does not read it. John Mueller confirmed no Google Search system
  acts on it.
- **OpenAI**: documents `robots.txt` for crawler control, not `llms.txt`.
  Publishes its own for its developer docs; does not fetch yours meaningfully.
- **Anthropic**: recommends it in its guidance for agent-readable documentation,
  and Claude respects it in retrieval workflows.
- **Perplexity**: confirmed to retrieve it and use it to prioritize pages.

Adoption sits around 10% of sites. Crawl-log studies find the major model
crawlers do not request it in meaningful volume.

**Verdict: Plausible tier, for documentation sites and API products where agents
are the audience.** It is an agent-readiness convention, not a ranking factor.
Ship one if you have a docs site and it takes ten minutes. Do not put it on a
plumber's website and call it AI optimization.

## Where citations actually come from

Useful for calibrating expectations, and for the strategy that follows.

- **Reddit is the most-cited domain across major engines**, around 40% frequency.
- **Wikipedia dominates ChatGPT specifically**, between 26% and 48% of its top-10
  citation share depending on the study.
- **News and established publishers** account for 38-51% of citations across
  platforms.
- **The top 15 domains capture about 68% of consolidated citation share**, though
  no single domain exceeds about 5% on any one platform.
- **Earned media accounts for roughly 84% of AI citations.** Paid and advertorial:
  0.3%.

The strategic reading: models cite places where people discuss things, and
places with editorial reputation. Your own website is rarely the citation. It is
the destination the citation eventually points at, and the source that resolves
who you are when your name comes up.

Which leads to the finding that should reorganize the whole plan:

> ChatGPT recognized 99.4% of products when they were named in the prompt, but
> surfaced them in only 3.32% of organic discovery queries. Perplexity: 94.3%
> recognition, 8.29% discovery.

**Recognition is nearly solved. Discovery is the bottleneck.** Being described
correctly when someone asks about you by name is a content and structured-data
problem, and it is achievable. Being suggested when nobody has heard of you is a
brand and mentions problem, and no amount of on-page work solves it. See
`09-authority.md`.

## What to actually do

Tiered honestly.

### Confirmed

- **Be indexable and be in Google's index.** Every Google AI surface draws on it.
- **Be crawlable by the retrieval agents specifically.** `OAI-SearchBot`,
  `PerplexityBot`, `Claude-User`, `Bingbot`. Blocking these is the one guaranteed
  way to be invisible. Check `robots.txt` and the WAF. See `01-diagnose.md`.
- **Serve content in the initial HTML.** Assistant crawlers largely do not run
  JavaScript. Client-rendered content is invisible to them regardless of how
  Google handles it.
- **Register with Bing Webmaster Tools.** Copilot rides on Bing.

### Supported

- **Cover the question space, not the keyword.** Query fan-out means the system
  is testing your page against 8-12 sub-questions. Coverage breadth correlates
  with citation. Build the sub-question list from People Also Ask and
  autocomplete, and answer each under its own heading. See `02-keywords.md`.
- **Answer-first passages under question-shaped headings.** Retrieval works over
  passages; the heading tells the system what the passage answers.
- **Real, specific, attributable facts.** Numbers with units, dates, named
  standards, prices. These are what a model can safely quote.
- **Earned mentions in places models read.** Trade press, local news, industry
  associations, genuine participation in relevant communities. Brand mentions
  correlate with AI visibility about three times more than backlinks (0.664 vs
  0.218 across 75,000 brands).
- **Consistent entity description everywhere.** Same name, same description, same
  category across your site, your profiles, and directories. Contradictory
  descriptions produce contradictory answers.

### Plausible

- `llms.txt` for documentation and developer products.
- A clean, machine-readable About page stating what the business is, where, and
  since when, in plain sentences.
- Structured data as entity disambiguation. Not because it triggers AI features,
  but because it removes ambiguity about who you are.

### Unsupported

- FAQ schema as an AI visibility lever. Google says no schema is needed; the FAQ
  rich result no longer exists.
- "AI-optimized" content rewriting services. The end-to-end evidence points the
  other way.
- Word-count targets, keyword density targets, "semantic completeness scores"
  sold by tools with no published methodology.
- Submitting your site to AI engines. There is no submission.

### Harmful

- Keyword stuffing. Measured negative effect on the AI surfaces too.
- Prompt injection in page text, invisible instructions, adversarial sequences.
  These are documented attack techniques, they are detectable, and they will get
  the domain treated as adversarial. Preference-manipulation attacks are studied
  precisely so engines can defend against them.
- Mass-generated pages targeting long-tail question variants. Scaled content
  abuse, and the same policy applies whether a human or a model wrote them.

## Measuring AI visibility without fooling yourself

AI answers are unstable. Across four engines over 45 days, daily source-level
Jaccard similarity was 0.34-0.42. Repeated runs at temperature zero changed 9-28%
of decisions. One before/after prompt comparison is worthless.

The minimum design that produces a defensible claim:

- **3-5 paraphrases** per information need. People do not all phrase it the same.
- **7-8 repetitions** per prompt. This is the empirically derived baseline for
  distinguishing signal from generation noise.
- **At least two time windows**, spaced by weeks.
- **Named engine and mode, with the date.** "ChatGPT" is not a system
  description; the model, whether search was on, and the date are.
- **An untreated control.** A comparable page or competitor you did not touch.
- **Report the null results.** Prompts where nobody was cited are data.

Then report the vector from `00-model.md` — retrieval, citation, prominence,
fidelity — separately, not as one score.

Also check **fidelity**, which nobody does and which matters commercially: when
an engine describes your business, is it correct? Studies found only about 51.5%
of sentences in generated answers fully supported by their citations, and around
11% of atomic claims insufficiently supported. A confidently wrong statement
about your prices or your service area is worse than not being mentioned.

## The one-paragraph version for a client

Google says there is nothing special to do for AI Overviews beyond being indexed
and eligible for a snippet, and the independent research agrees: the interventions
sold as GEO were measured on documents already inside the model's context, and
the one study that measured the full pipeline found the popular rewrite made
things worse. What reliably helps is being crawlable by the retrieval agents,
covering the whole question rather than one keyword, giving real numbers a model
can quote, and being mentioned by other people in places models read. The last
one is the bottleneck, and it is a public-relations problem, not a markup problem.
