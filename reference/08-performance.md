# Performance: Core Web Vitals and what causes them

Performance is a tiebreaker in ranking and a direct multiplier on conversion. It
will not make a worse page beat a better one. It will decide between two
comparable ones, and it will decide whether the visitor who arrives stays.

Do not spend a week here while the site has no page for the query. Do spend the
afternoon it takes to fix the obvious causes.

## The metrics and the thresholds

Measured at the **75th percentile of real users**, over a 28-day rolling window,
from the Chrome User Experience Report. Not from your laptop.

| Metric | Good | Needs work | Poor | What it measures |
|---|---|---|---|---|
| **LCP** Largest Contentful Paint | ≤ 2.5s | ≤ 4.0s | > 4.0s | When the main content appeared |
| **INP** Interaction to Next Paint | ≤ 200ms | ≤ 500ms | > 500ms | How fast the page responds to input |
| **CLS** Cumulative Layout Shift | ≤ 0.1 | ≤ 0.25 | > 0.25 | How much things jumped around |

INP replaced FID and is the one most sites fail: around 43% of sites miss the
200ms threshold, and only about 48% of mobile sites pass all three.

**Lab tools lie in both directions.** Lighthouse on a fast machine flatters you;
Lighthouse throttled punishes you for things real users do not experience. Use
lab tools to find *causes* and field data (CrUX, Search Console's Core Web Vitals
report, or your own `web-vitals` collection) to decide whether you have a
*problem*.

## LCP: what is actually slow

LCP has four sub-parts. Measure which one dominates before optimizing, or you
will optimize the wrong one.

```
TTFB → Resource load delay → Resource load time → Element render delay
```

**Time to first byte.** Server or hosting problem. Static generation, a CDN, and
caching fix most of it. If TTFB is 800ms you cannot reach a 2.5s LCP no matter
what you do to the images.

**Resource load delay** — the browser did not know it needed the LCP resource
until late. Causes and fixes:

- The hero image is set in CSS as a `background-image`: the browser only
  discovers it after CSSOM is built. Use a real `<img>`.
- The image is behind JavaScript. Put it in the HTML.
- No preload for a critical font or image: `<link rel="preload">`, but only for
  the one LCP resource. Preloading everything preloads nothing.
- `fetchpriority="high"` on the LCP image.

**Resource load time** — the file is too big.

- Serve AVIF or WebP with a JPEG fallback. Modern build tools do this for free.
- Serve responsive sizes with `srcset` and `sizes`. A 2400px hero on a 390px
  phone is the most common single waste on the web.
- Never `loading="lazy"` on the LCP element. This is the most common own goal in
  this whole file: someone adds lazy loading site-wide and LCP doubles.
- Compress. Quality 75-82 is visually indistinguishable for photographs.

**Element render delay** — the resource arrived but nothing painted.

- Render-blocking CSS and synchronous scripts in `<head>`.
- Web fonts blocking text: `font-display: swap`, self-host, preload the one
  weight above the fold, and subset to the characters you use.
- A full-screen splash, intro animation, or interstitial that covers the content:
  the LCP element becomes the overlay, and if the real content only appears after
  a click, LCP is measured on the overlay while the actual experience is worse.
  Intros are a design choice with a measurable cost. Measure it, state the number,
  let the owner decide.

## INP: what is actually janky

INP measures the worst realistic interaction latency, not the average. One bad
handler ruins the metric.

**The causes, in order of frequency:**

1. **Long tasks on the main thread.** Anything over 50ms blocks input. Break work
   up with `scheduler.yield()` where available, or `setTimeout` chunks.
2. **Too much JavaScript, period.** A 400KB bundle on a mid-range Android phone
   costs seconds of parse and execute. The fastest script is the one you did not
   ship. Audit dependencies before optimizing them.
3. **Third-party tags.** Chat widgets, consent managers, tag managers, heatmaps,
   ad scripts. These are frequently the entire INP problem. Load them `async` or
   `defer`, after interaction where possible, and measure each one's cost by
   removing it.
4. **Expensive event handlers.** Work done synchronously on `input`, `scroll`, or
   `resize`. Debounce, throttle, or move to `requestAnimationFrame`.
5. **Large DOM.** Thousands of nodes make every style recalculation expensive.
   Virtualize long lists.
6. **Layout thrashing.** Reading a layout property then writing one in a loop
   forces synchronous reflow each iteration. Batch reads, then writes.

**The framework note:** hydration is a common INP cost. A page that is fully
static HTML has essentially no INP problem. Islands architecture, partial
hydration, or simply shipping less JavaScript solves more than micro-optimizing
handlers.

## CLS: what is actually jumping

Almost always one of five things.

1. **Images without dimensions.** Set `width` and `height` attributes on every
   image, always, even when CSS resizes them. The attributes give the browser the
   aspect ratio to reserve space. This is free and it fixes most CLS.
2. **Ads, embeds, iframes** with no reserved space. Wrap in a container with a
   fixed `min-height` or `aspect-ratio`.
3. **Web fonts.** The fallback font has different metrics, so text reflows on
   swap. Fix with `size-adjust`, `ascent-override` and friends on the
   `@font-face`, or by choosing a fallback with similar metrics.
4. **Content injected above existing content.** Cookie banners, promo bars,
   "you have 1 new message" strips. Reserve the space, or overlay rather than
   push.
5. **Animating layout properties.** Animate `transform` and `opacity`, never
   `top`, `left`, `width`, `height`, or `margin`.

## Per-stack quick wins

**Astro** — `astro:assets` `<Image>` and `<Picture>` handle format, `srcset`, and
dimensions automatically, but **only for images imported from `src/`**. Files in
`public/` are copied verbatim and get none of it. Moving images from `public/` to
`src/assets/` and importing them is often the single biggest performance change
available on an Astro site. Use `loading="eager"` and `fetchpriority="high"` on
the one LCP image and let everything else lazy-load.

**Next.js** — `next/image` with correct `sizes`, `priority` on the LCP image
only, `next/font` for self-hosted fonts with automatic `size-adjust`. Watch for
client components that did not need to be client components.

**WordPress** — most performance problems are plugin count and theme bloat, not
configuration. Audit the plugin list first. A caching plugin plus an image
optimization plugin fixes the rest for most sites.

**Plain HTML** — you already win. Do not add a framework to a brochure site.

## Measuring honestly

```bash
# Field data for a URL or origin, free, no key needed for basic use
curl -s "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=YOUR_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com/"}'
```

Or simply: Search Console → Core Web Vitals, which groups URLs by pattern and
tells you how many real users are affected. That last part is what matters. A
poor LCP on a page nobody visits is not a priority.

For a before/after claim, use the same tool, the same device class, the same
network profile, and report the metric that changed, with the number. "It feels
faster" is not a finding.

## What performance will not do

It will not rank a thin page. It will not get you into AI Overviews. It will not
fix a site with no page for the query. It is the last 10%, and it is worth having,
and it is not the story.

The exception, and it is a real one: performance is a **conversion** factor
independent of ranking. If the site gets traffic and loses it at the door, this
file is where the money is, regardless of what it does for rankings.
