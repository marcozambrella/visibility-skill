#!/usr/bin/env node
/**
 * structured-data.mjs — build and validate a JSON-LD graph from a business file.
 *
 * Usage:
 *   node structured-data.mjs business.json                 print the graph
 *   node structured-data.mjs business.json --validate-only report problems only
 *   node structured-data.mjs business.json --script        wrap in a <script> tag
 *
 * Produces one connected @graph (Organization + WebSite + LocalBusiness subtype)
 * with stable @id values, rather than a pile of disconnected blocks. See
 * templates/business.json for the input shape and reference/05-structured-data.md
 * for why each property is there.
 *
 * Node 22+, zero dependencies. Exits 1 when validation finds an error.
 */

import { readFile } from "node:fs/promises";

/* Google-documented LocalBusiness subtypes worth using. Anything else is passed
   through unchecked, since schema.org has hundreds and the list moves. */
const KNOWN_TYPES = new Set([
  "LocalBusiness", "HomeAndConstructionBusiness", "GeneralContractor",
  "Electrician", "Plumber", "RoofingContractor", "HVACBusiness",
  "HousePainter", "Locksmith", "MovingCompany", "ProfessionalService",
  "Store", "Restaurant", "Dentist", "Physician", "LegalService",
  "AccountingService", "RealEstateAgent", "AutoRepair", "BeautySalon",
  "ChildCare", "DaySpa", "Electrician", "EmergencyService", "Hotel",
]);

const problems = [];
const err = (message, detail) => problems.push({ severity: "error", message, detail });
const warn = (message, detail) => problems.push({ severity: "warning", message, detail });

function absolute(value, site) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  if (!site) {
    err("Cannot make a URL absolute", `"${value}" is relative and no "site" is set in the business file.`);
    return value;
  }
  return new URL(value, site).href;
}

function decimals(n) {
  const s = String(n);
  return s.includes(".") ? s.split(".")[1].length : 0;
}

function build(data) {
  const site = data.site ? data.site.replace(/\/?$/, "/") : null;
  if (!site) err("Missing \"site\"", "The canonical origin, e.g. \"https://example.com\". Every @id and absolute URL derives from it.");
  if (!data.name) err("Missing \"name\"", "Required by Google for LocalBusiness.");

  const businessType = data.type || "LocalBusiness";
  if (!KNOWN_TYPES.has(businessType)) {
    warn(`Unrecognised type "${businessType}"`, "Use the most specific documented subtype that fits. Passing it through unchecked.");
  }

  const orgId = `${site}#organization`;
  const siteId = `${site}#website`;
  const bizId = `${site}#business`;

  /* --- address --- */

  const a = data.address || {};
  if (!a.city) err("Missing address.city", "Google requires an address for LocalBusiness; addressLocality is the minimum meaningful part.");
  const address = {
    "@type": "PostalAddress",
    ...(a.street ? { streetAddress: a.street } : {}),
    ...(a.city ? { addressLocality: a.city } : {}),
    ...(a.postalCode ? { postalCode: a.postalCode } : {}),
    ...(a.region ? { addressRegion: a.region } : {}),
    addressCountry: a.country || "IT",
  };
  if (!a.street && !data.serviceArea?.length) {
    warn("No street address and no serviceArea", "A business customers cannot visit should declare a serviceArea instead. Publishing neither leaves the location ambiguous.");
  }
  if (a.street && data.hideAddress) {
    warn("Street address present but hideAddress is set", "If customers cannot visit, remove the street address here as well as on the Google Business Profile.");
  }

  /* --- geo --- */

  let geo;
  if (data.geo?.latitude != null && data.geo?.longitude != null) {
    if (decimals(data.geo.latitude) < 5 || decimals(data.geo.longitude) < 5) {
      warn("Low geo precision", "Google asks for at least five decimal places on latitude and longitude.");
    }
    geo = { "@type": "GeoCoordinates", latitude: data.geo.latitude, longitude: data.geo.longitude };
  }

  /* --- hours --- */

  let openingHoursSpecification;
  if (Array.isArray(data.openingHours) && data.openingHours.length) {
    openingHoursSpecification = data.openingHours.map((slot) => {
      if (!slot.opens || !slot.closes) err("Opening hours entry without opens/closes", JSON.stringify(slot));
      if (slot.opens && !/^\d{2}:\d{2}$/.test(slot.opens)) warn("Opening time is not hh:mm", slot.opens);
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [].concat(slot.days || []),
        opens: slot.opens,
        closes: slot.closes,
      };
    });
  } else {
    warn("No opening hours", "\"Open at the time of search\" entered the top five local ranking factors in 2026.");
  }

  /* --- service area --- */

  const areaServed = (data.serviceArea || []).map((area) =>
    typeof area === "string"
      ? { "@type": "City", name: area }
      : { "@type": area.type || "City", name: area.name }
  );

  /* --- services --- */

  let hasOfferCatalog;
  if (Array.isArray(data.services) && data.services.length) {
    hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: data.servicesLabel || "Services",
      itemListElement: data.services.map((service) => {
        if (!service.url) {
          warn(`Service "${service.name}" has no url`, "Without it the service entity is not connected to the page describing it.");
        }
        return {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            ...(service.description ? { description: service.description } : {}),
            ...(service.url ? { url: absolute(service.url, site) } : {}),
            ...(areaServed.length ? { areaServed: areaServed[0] } : {}),
            provider: { "@id": bizId },
          },
        };
      }),
    };
  }

  /* --- checks that catch penalties --- */

  if (data.aggregateRating || data.review) {
    err(
      "Self-serving review markup",
      "Google's LocalBusiness documentation recommends aggregateRating and review only for sites that capture reviews about OTHER businesses. On your own site this produces no stars and risks a manual action. Reviews belong on the Google Business Profile."
    );
  }
  if (data.sameAs && !Array.isArray(data.sameAs)) {
    err("sameAs must be an array", typeof data.sameAs);
  }
  if (!data.sameAs?.length) {
    warn("Empty sameAs", "This is the property that links your website entity to your Google Business Profile and social accounts. Fill it as soon as those exist.");
  }
  if (data.telephone && !/^\+/.test(data.telephone)) {
    warn("Telephone has no country code", `"${data.telephone}" — use the international form, identical to the Google Business Profile.`);
  }

  /* --- the graph --- */

  const logo = absolute(data.logo, site);
  const image = absolute(data.image || data.logo, site);

  const organization = {
    "@type": "Organization",
    "@id": orgId,
    name: data.name,
    ...(data.legalName ? { legalName: data.legalName } : {}),
    url: site,
    ...(logo ? { logo: { "@type": "ImageObject", "@id": `${site}#logo`, url: logo } } : {}),
    ...(data.telephone ? { telephone: data.telephone } : {}),
    ...(data.email ? { email: data.email } : {}),
    ...(data.vatID ? { vatID: data.vatID } : {}),
    ...(data.taxID ? { taxID: data.taxID } : {}),
    ...(data.foundingDate ? { foundingDate: String(data.foundingDate) } : {}),
    ...(data.sameAs?.length ? { sameAs: data.sameAs } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": siteId,
    url: site,
    name: data.name,
    ...(data.description ? { description: data.description } : {}),
    publisher: { "@id": orgId },
    inLanguage: data.language || "it-IT",
  };

  const business = {
    "@type": businessType,
    "@id": bizId,
    name: data.name,
    ...(data.description ? { description: data.description } : {}),
    url: site,
    ...(image ? { image } : {}),
    ...(logo ? { logo } : {}),
    ...(data.telephone ? { telephone: data.telephone } : {}),
    ...(data.email ? { email: data.email } : {}),
    ...(data.vatID ? { vatID: data.vatID } : {}),
    address,
    ...(geo ? { geo } : {}),
    ...(areaServed.length ? { areaServed } : {}),
    ...(openingHoursSpecification ? { openingHoursSpecification } : {}),
    ...(data.priceRange ? { priceRange: data.priceRange } : {}),
    ...(data.foundingDate ? { foundingDate: String(data.foundingDate) } : {}),
    ...(data.knowsAbout?.length ? { knowsAbout: data.knowsAbout } : {}),
    ...(hasOfferCatalog ? { hasOfferCatalog } : {}),
    parentOrganization: { "@id": orgId },
    ...(data.sameAs?.length ? { sameAs: data.sameAs } : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, business],
  };
}

async function main() {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  if (!file) {
    console.error("Usage: node structured-data.mjs <business.json> [--validate-only] [--script]");
    process.exit(2);
  }

  let data;
  try {
    data = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    console.error(`Cannot read ${file}: ${error.message}`);
    process.exit(2);
  }

  const graph = build(data);

  if (problems.length) {
    console.error("");
    for (const p of problems.sort((a, b) => (a.severity === "error" ? -1 : 1))) {
      console.error(`${p.severity === "error" ? "ERROR " : "WARN  "} ${p.message}`);
      if (p.detail) console.error(`        ${p.detail}`);
    }
    console.error("");
  } else {
    console.error("No problems found.\n");
  }

  if (!args.includes("--validate-only")) {
    const json = JSON.stringify(graph, null, 2);
    console.log(
      args.includes("--script")
        ? `<script type="application/ld+json">\n${json}\n</script>`
        : json
    );
  }

  process.exit(problems.some((p) => p.severity === "error") ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
