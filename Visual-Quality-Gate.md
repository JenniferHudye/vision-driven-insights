# Visual Quality Gate

## Purpose

Your AEO/GEO site should not look like a plain AI-generated template. It should look credible, professional, and aligned with your brand before you ever show it to anyone.

## Inputs that produce better design

The brief should capture:

- Logo file, ideally SVG or transparent PNG
- Professional headshot
- Team photos, if applicable
- Owned photos you have the rights to, if available
- Primary, secondary, accent, and neutral hex colors
- Font names, if known
- 2 to 3 websites you like visually
- 1 to 2 websites you dislike visually
- Preferred brand feel: modern, warm, luxury, bold, editorial, minimal, or other
- Design restrictions: colors, fonts, layouts, or styles to avoid
- First-impression goal: what a visitor should feel when they land on the site

## Builder rules

The builder should:

1. Use your real brand assets when legally usable.
2. Validate color contrast before using brand colors on text.
3. Avoid flat, generic, one-color template pages.
4. Create visual hierarchy: strong hero, clear sections, good spacing, readable typography, and obvious calls to action.
5. Use only owned, approved, or properly generated images (see `IMAGE-SOURCING-RULE.md`).
6. Never use copyrighted photos or photos scraped from another website.
7. If brand assets are weak or missing, create a clean professional fallback using your colors and generated/original graphics.
8. Make article pages feel intentionally designed, not just long text pasted into a template.
9. Run mobile and desktop visual review before declaring the site ready.

## Pre-delivery visual QA

Before the site is called done, check:

- Homepage first viewport looks professional and credible
- Logo is readable and not tiny
- Headshot or hero visual is not distorted
- Colors have enough contrast
- CTA buttons are obvious
- Mobile view has no overlapping text
- Article pages are readable and not visually bland
- Testimonials/reviews are presented cleanly
- Proof is visible above the fold where it matters
- Every image is owned, approved, generated, or original
- The site feels specific to you, not interchangeable

## Minimum custom-code standard

Every generated site should include these code-level design safeguards:

- A theme config that derives background, surface, border, text, muted text, primary, secondary, accent, and CTA colors from your palette.
- A contrast helper that chooses readable foreground text for each brand color.
- At least 3 hero layout variants: headshot-led, photo-led, and editorial/text-led.
- Reusable proof blocks: testimonials, awards, review summary, media/features, and case-study cards.
- Article components beyond plain text: key-takeaway box, FAQ block, related articles, CTA band, author box, and image-with-caption.
- A branded placeholder image generator for missing hero/article images.
- Responsive screenshot review for the homepage, one article page, and one proof/about page before delivery.

If the site can't meet this standard because assets are missing, the builder must still ship a clean professional fallback and record the missing assets in `BUILD-DECISIONS.md`.
