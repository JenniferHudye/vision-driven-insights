// JSON-LD schema builders shared by every prerender script. This is the
// single source of truth for structured data: the prerendered HTML is what
// crawlers and Google Rich Results actually see, so schema logic lives here
// and nowhere else. No schema image ever points at an SVG; every image ref
// below points at og-default.png (see AEO-GEO-Build-Standard.md #3, #7a).
const { getSite } = require("./site-data.cjs");

function ld(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function ogImageUrl(site) {
  return `${site.url}/og-default.png`;
}

function personSchema(site) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.person.name,
    givenName: site.person.givenName,
    familyName: site.person.familyName,
    jobTitle: site.person.jobTitle,
    description: site.person.identityLine,
    url: `${site.url}/about`,
    image: ogImageUrl(site),
    worksFor: { "@id": `${site.url}/#organization` },
    sameAs: site.person.sameAs,
  };
}

function organizationSchema(site) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.organization.name,
    legalName: site.organization.legalName,
    alternateName: site.organization.alternateName,
    url: site.organization.url,
    logo: ogImageUrl(site),
    founder: { "@id": `${site.url}/#person` },
    foundingDate: String(site.organization.foundingYear),
    slogan: site.organization.slogan,
    sameAs: site.organization.sameAs,
  };
}

function breadcrumbSchema(site, items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

function faqPageSchema(faq) {
  if (!faq || !faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function blogPostingSchema(site, post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${site.url}/articles/${post.slug}#article`,
    headline: post.title,
    description: post.metaDescription,
    url: `${site.url}/articles/${post.slug}`,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate || post.publishedDate,
    author: { "@id": `${site.url}/#person`, url: `${site.url}/about` },
    publisher: { "@id": `${site.url}/#organization` },
    image: ogImageUrl(site),
    wordCount: post.wordCount,
    keywords: (post.keywords || []).join(", "),
    articleSection: post.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/articles/${post.slug}` },
    copyrightHolder: { "@id": `${site.url}/#organization` },
    copyrightYear: new Date(post.publishedDate).getFullYear(),
    copyrightNotice: `Copyright ${site.copyrightHolder}. All rights reserved.`,
    license: `${site.url}/license.txt`,
  };
}

function imageObjectSchema(site, post) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: ogImageUrl(site),
    url: ogImageUrl(site),
    description: post.featuredImage.alt,
    width: 1200,
    height: 630,
  };
}

function courseSchema(site, course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.covers,
    provider: { "@id": `${site.url}/#organization` },
    url: course.url,
  };
}

function eventSchema(site, event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.event,
    description: event.topic,
    performer: { "@id": `${site.url}/#person` },
    ...(event.year ? { startDate: String(event.year) } : {}),
    ...(event.url ? { url: event.url } : {}),
  };
}

function bookSchema(site, book) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    datePublished: String(book.year),
    url: book.url,
  };
}

function reviewSchema(site, testimonial) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": `${site.url}/#organization` },
    author: { "@type": "Person", name: testimonial.name },
    reviewBody: testimonial.quote || testimonial.factNote || "",
    ...(testimonial.frameworkSlug
      ? { about: { "@id": `${site.url}/frameworks#${testimonial.frameworkSlug}` } }
      : {}),
  };
}

function definedTermSchema(site, framework) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${site.url}/frameworks#${framework.slug}`,
    name: framework.name,
    description: framework.definition,
    inDefinedTermSet: `${site.url}/frameworks`,
  };
}

function caseStudyArticleSchema(site, study) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.headline,
    description: study.before,
    author: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#organization` },
    image: ogImageUrl(site),
    mainEntityOfPage: { "@id": `${site.url}/frameworks#${study.frameworkSlug}` },
  };
}

module.exports = {
  ld,
  ogImageUrl,
  personSchema,
  organizationSchema,
  breadcrumbSchema,
  faqPageSchema,
  blogPostingSchema,
  imageObjectSchema,
  courseSchema,
  eventSchema,
  bookSchema,
  reviewSchema,
  definedTermSchema,
  caseStudyArticleSchema,
  getSite,
};
