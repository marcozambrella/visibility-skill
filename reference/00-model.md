# The model

Read this before anything else. Everything else in the skill is an intervention
at a specific stage of the pipeline described here, and interventions applied at
the wrong stage do nothing.

## Four surfaces, not one

People find a page through four mechanisms that share an index but not a
selection process. Optimizing for one does not automatically win the others.

**Google organic.** The ten blue links. Selection is a ranking function over an
inverted index plus neural retrieval, tuned by hundreds of signals and by
click-behavior feedback. Slow to move, durable once moved.

**The local pack and Maps.** A separate ranking system over the Google Business
Profile corpus, driven by relevance, distance, and prominence. Your website is an
input to it, not the substrate. A business with a strong profile and no website
routinely outranks a business with a great website and a weak profile.

**Google's AI surfaces.** AI Overviews and AI Mode. Both draw on the Search index
but select differently from organic and from each other. Two numbers matter:
about 53% of domains cited in AI Overviews do not appear in the organic top ten,
and only about 13.7% of citations overlap between AI Overviews and AI Mode. They
are three distinct selection processes over one index.

**Assistants.** ChatGPT, Perplexity, Claude, Gemini, Copilot. Each runs its own
retrieval, over its own crawl or a licensed search backend, with its own
reranker. Domain overlap between ChatGPT and Perplexity citations is around 11%.
There is no single "AI SEO" that wins all of them.

The practical consequence: report visibility per surface. A single blended
"visibility score" hides the fact that you won one surface and lost three.

## The seven-stage funnel

Adapted from the 2026 critical survey of generative engine optimization
(arXiv:2607.14035), which formalizes what happens between a query and a citation.
It applies, with small changes of vocabulary, to classic search too.

1. **Activation.** Does the system search at all? A model may answer from
   parameters without retrieving anything. AI Overview activation sits around
   13.7% of queries overall but rises to about 64.7% for queries phrased as
   questions. If the surface never activates for your query class, nothing
   downstream matters.
2. **Crawling and indexing.** Is the page fetched, rendered, and stored? Blocked
   by robots, returning 404, hidden behind JavaScript the crawler does not
   execute, or duplicated under a canonical pointing elsewhere: all terminal.
3. **Retrieval.** Is the page in the candidate set for this query? This is
   relevance plus authority plus, for local, proximity. **Most of the leverage
   lives here** and most published advice ignores it.
4. **Reranking and context allocation.** Of the candidates, which make it into
   the top slots or into the model's context window? Position in that window
   matters more than almost any rewrite you can perform.
5. **Generation and citation.** Does the answer use your page, and does it name
   you? This is the only stage the popular GEO literature measures.
6. **Absorption and fidelity.** Is what the model says about you correct? A
   citation that misrepresents your service is a liability, not a win.
7. **Attention, click, conversion.** Did anyone act? The survey found exactly one
   suggestive quasi-experiment linking AI citation to traffic, and its placebo
   test was not significant. Assume nothing here without your own measurement.

Decompose your problem before you act:

```
P(cited) = P(activation) × P(retrieved | activation) × P(cited | retrieved)
```

If you are not retrieved, work on stage 3. Rewriting your paragraphs to sound
more quotable is stage 5 work, and stage 5 work on an unretrieved page has an
expected value of zero.

## Where the leverage actually is

Ordered by expected effect per hour spent, for a typical small or mid-size site.

1. **Being eligible at all.** Indexable, canonical correct, not accidentally
   `noindex`, reachable in three clicks, in the sitemap. Binary and cheap.
2. **Having a page per intent.** One page per thing people actually search for.
   The most common cause of "we don't rank for X" is that no page targets X. A
   site with one page and eight services competes for nothing.
3. **Topical relevance of that page.** The most reproducible factor in every
   study reviewed. Explicit alignment between the query and the page's title,
   heading, and opening paragraph.
4. **For local: the Google Business Profile.** About 32% of local pack ranking
   weight, more than every on-page factor combined. Reviews add another 16-20%
   and are rising.
5. **Authority and mentions.** Links still work. For AI surfaces, brand mentions
   correlate with visibility about three times more strongly than backlinks
   (0.664 vs 0.218 across 75,000 brands). Earned media accounts for roughly 84%
   of AI citations; paid and advertorial for 0.3%.
6. **Extractability.** Self-contained sections under descriptive headings, with
   the answer in the first two sentences. Cheap, and it helps stage 5 once stages
   1-4 are solved.
7. **Performance.** A tiebreaker between comparable pages, and a real conversion
   factor regardless of ranking. Not a way to beat a better page.

Everything below this line — llms.txt, schema types Google does not consume,
keyword density, word-count targets — is noise. `12-antipatterns.md` lists them
so you can say no with a reason.

## Measure a vector, not a score

The survey's recommendation, and the right way to report to a client. Track these
separately:

- **Retrievability** — does the page appear in candidate sets? Proxy: Search
  Console impressions for the target query cluster.
- **Exposure** — does it reach the top slots or the context window? Proxy:
  average position, plus AI Overview impressions in Search Console.
- **Citation** — is it named? Proxy: manual prompt panel, run on a schedule.
- **Prominence** — where in the answer, and how much of it? Manual.
- **Absorption** — does the answer reproduce your claim correctly? Manual.
- **Fidelity** — is what it says about you true? Manual, and the one to escalate.
- **Behavior** — clicks, calls, forms. GA4 plus call tracking.

Collapsing these into one number is how agencies hide a loss. Keep them apart.

## What varies, and how much

Two facts that should change how you report results.

**AI answers are not stable.** Across four engines over 45 days, daily
source-level Jaccard similarity was about 0.34-0.42. Repeated runs at temperature
zero changed 9-28% of decisions. A single before/after comparison of one prompt
proves nothing. If you claim an AI visibility change, you need repetitions:
three to five paraphrases per information need, seven to eight repetitions each,
across at least two time windows.

**Gains erode under adoption.** The C-SEO benchmark found only 3 of 54
method-domain combinations significantly positive, and none in question
answering. When everyone applies the same rewrite, the advantage approaches zero,
because one source's gain is another's loss. Durable advantage comes from things
competitors cannot copy in an afternoon: real photographs, real reviews, real
expertise, real relationships.

## The honest summary

The stages you can most reliably influence are 2 and 3: be indexable, and be the
obviously relevant answer to a query someone types. That is classic search
engine optimization. The AI surfaces changed the shape of the results page and
the wording of the advice, but they did not change where the leverage is, because
they retrieve from the same index using the same signals of relevance and
authority.

Sell that, not the magic.
