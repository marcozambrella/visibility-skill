# Structured data: what Google actually consumes

Structured data does two different jobs, and conflating them is why most schema
work is wasted effort.

**Job one: rich results.** A small, shrinking list of types produces a visual
enhancement in Google's results. This list is defined by Google's Search Central
documentation, not by schema.org, and it changes faster than the vocabulary does.

**Job two: entity disambiguation.** Telling machines unambiguously what this
page is about, which real-world thing the business is, and how it relates to
other things. No visual payoff, but it is how you become a resolvable entity
rather than a string.

Job two is the reason to write schema in 2026. Do not sell job one on types that
no longer produce anything.

## What produces a rich result, and what does not

**Currently produces a visible enhancement** (verify against Google's docs before
you promise it, this list moves):

Article and NewsArticle, BreadcrumbList, Product and ProductGroup, Review
snippets on eligible types, LocalBusiness and its subtypes, Organization, Event,
JobPosting, Recipe, VideoObject, Course, Book, Dataset, SoftwareApplication,
Q&A pages, discussion forum and profile pages, vehicle listings.

**Removed, and no longer produces anything:**

- **HowTo** — deprecated on desktop in September 2023, gone everywhere since. Do
  not add it, do not bill for it.
- **FAQPage** — restricted to government and health sites in August 2023, and
  that last exception ended in 2026. **No FAQ rich result exists for a normal
  business.** The claim that FAQ schema improves AI Overview appearance is
  **Unsupported**; Google states no special schema is needed for AI features.
- **Practice Problem** — removed in January 2026.
- **Sitelinks Searchbox** — removed in 2023. `WebSite` with `potentialAction` no
  longer does anything visible.

FAQPage markup is still legitimate as entity description if the questions and
answers are genuinely on the page and useful. Just do not expect a SERP change,
and never add FAQ markup for content that is not visibly on the page — that is a
guidelines violation regardless of its uselessness.

## The rules that get sites in trouble

1. **Markup must match visible content.** Rating stars in the JSON that are not
   on the page, prices that differ from the page, review text that does not
   exist: structured data spam, and it triggers manual actions.
2. **No self-serving reviews.** Google's LocalBusiness documentation states
   `aggregateRating` and `review` are "only recommended for sites that capture
   reviews about other local businesses." Marking up your own five-star average
   on your own site does not produce stars and can produce a penalty. Reviews
   belong on the Google Business Profile.
3. **One primary entity per page.** A page is about one thing. Nesting five
   `LocalBusiness` blocks on the homepage confuses more than it clarifies.
4. **Use the most specific type available.** `HomeAndConstructionBusiness` or
   `GeneralContractor` rather than `LocalBusiness`; `Plumber`, `Electrician`,
   `RoofingContractor` where they exist and fit.
5. **JSON-LD, in the head or the body.** Microdata and RDFa still work; JSON-LD
   is what Google recommends and what is maintainable.
6. **`@id` everywhere, and reuse it.** This is what turns separate blocks into
   one connected graph. Without stable `@id` values you have described three
   unrelated things.

## The graph pattern

Do not scatter independent blocks. Emit one `@graph` per page, with `@id`
references linking the nodes. This is the single biggest quality difference
between amateur and competent structured data.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Business Name",
      "url": "https://example.com/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://example.com/#logo",
        "url": "https://example.com/logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://www.google.com/maps/place/?q=place_id:CHIJ...",
        "https://www.facebook.com/business",
        "https://www.instagram.com/business"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com/",
      "name": "Business Name",
      "publisher": { "@id": "https://example.com/#organization" },
      "inLanguage": "it-IT"
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/servizi/x/#webpage",
      "url": "https://example.com/servizi/x/",
      "name": "Page title",
      "isPartOf": { "@id": "https://example.com/#website" },
      "about": { "@id": "https://example.com/#organization" },
      "primaryImageOfPage": { "@id": "https://example.com/servizi/x/#primaryimage" },
      "breadcrumb": { "@id": "https://example.com/servizi/x/#breadcrumb" },
      "inLanguage": "it-IT"
    }
  ]
}
```

Every page emits the `WebPage` node; the `Organization` and `WebSite` nodes are
identical site-wide and get referenced by `@id`.

## LocalBusiness: the properties that matter

Required by Google: `name`, `address`.

Recommended, and worth filling every one for a local business:

| Property | Why it matters |
|---|---|
| `@id` | Stable identity across pages. Use `https://site/#business`. |
| `url` | The canonical homepage. |
| `image` | **Absolute URL.** A relative path silently fails. |
| `logo` | Separate from image; used for the knowledge panel. |
| `telephone` | With country code, matching the profile exactly. |
| `email` | |
| `address` | `PostalAddress` with `streetAddress`, `addressLocality`, `postalCode`, `addressRegion`, `addressCountry`. |
| `geo` | `GeoCoordinates`, at least five decimal places. |
| `areaServed` | For businesses that travel to the customer. |
| `openingHoursSpecification` | Array of day ranges with `opens`/`closes` in `hh:mm`. "Open at time of search" entered the top five local ranking factors in 2026. |
| `priceRange` | Under 100 characters. `"€€"` or a real range. |
| `vatID` / `taxID` | Verifiable identity. Strong trust signal in the EU. |
| `foundingDate` | Supports the "fifteen years" claim on the page. |
| `sameAs` | Google Business Profile, social profiles, directory listings. This is the property that links your website entity to your Maps entity. |
| `hasOfferCatalog` | The services you offer, as a structured list. |
| `knowsAbout` | Topics of competence. Cheap, plausible, no downside. |

### Service-area businesses

A plumber with no walk-in office is a service-area business. Getting this wrong
is common and it hurts.

- If customers **cannot** visit you, do not publish a street address as if they
  can. Use `areaServed` and hide the address on the Google Business Profile.
- If you have a real office customers can visit, publish it, and make it
  identical everywhere.
- Never invent an address, never use a virtual office, never use a mailbox
  service. Address verification failures suspend profiles.

```json
{
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://example.com/#business",
  "name": "Business Name",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Roma",
    "addressRegion": "RM",
    "addressCountry": "IT"
  },
  "areaServed": [
    { "@type": "City", "name": "Roma" },
    { "@type": "AdministrativeArea", "name": "Città metropolitana di Roma Capitale" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Servizi",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Rifacimento impianti elettrici",
          "url": "https://example.com/servizi/impianti-elettrici-roma/",
          "areaServed": { "@type": "City", "name": "Roma" }
        }
      }
    ]
  }
}
```

The `url` inside each `Service` is what connects the service entity to the page
that describes it. Most implementations omit it and lose the link.

## Breadcrumbs

Still produce a real rich result, still cheap. One per page, matching the visible
breadcrumb trail.

```json
{
  "@type": "BreadcrumbList",
  "@id": "https://example.com/servizi/x/#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Servizi", "item": "https://example.com/servizi/" },
    { "@type": "ListItem", "position": 3, "name": "Impianti elettrici" }
  ]
}
```

The last item has no `item` property. This is correct and frequently done wrong.

## Validation

Three tools, three different jobs:

- **Google's Rich Results Test** — tells you whether Google will produce an
  enhancement. The only one that answers that question.
- **Schema Markup Validator** (validator.schema.org) — tells you whether the
  markup is valid schema.org. Catches typos in property names, which the Rich
  Results Test ignores for types it does not enhance.
- **Search Console → Enhancements** — tells you what Google actually parsed on
  the live site, at scale, over time. The only one that reflects reality.

`scripts/structured-data.mjs` generates the graph from a `business.json` and
validates the required-property set locally, so you catch errors before deploy.

## What structured data will not do

It is not a ranking factor in itself. It does not create eligibility for AI
Overviews — Google states plainly that "there's no special schema.org structured
data that you need to add" for AI features. It will not rescue a thin page.

What it does: make the enhancement possible where one exists, and make your
business unambiguously resolvable as an entity, which is a precondition for
appearing in knowledge panels and for being named correctly by an assistant that
has decided to mention you. That is worth the hour it takes. It is not worth
three days.
