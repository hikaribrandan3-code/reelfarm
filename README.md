# ReelFarm

A mobile-first video production portfolio, built around nine studio-supplied films. White surfaces, restrained glass, local SVG artwork, real video posters, a moving carousel, and a floating mobile navigation. English, Spanish, and Brazilian Portuguese have their own crawlable pages.

## Run locally

Requires Node 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:4173. `npm run dev` builds and starts the included server. After editing, run `npm run build` and refresh the browser. The server continues serving the rebuilt files. Change `PORT` to use another port.

```sh
npm run build
npm test
npm start
```

The server supports MP4 byte-range streaming, proper 404s, safe path resolution, and HEAD requests. There is no database, account infrastructure, or paid service dependency.

## Packages

Starter: $50 USD for 5 standard videos ($10 per standard video in this pack). Content: $140 USD for 12 standard videos. These are one-time packs. Growth: $300 USD monthly, with production volume agreed in the quote. Creator / Custom is priced per project. Premium 3D, advanced animation, extensive editing, and specialized projects are quoted separately. All four options prefill the existing quote form.

## Quotes and email

The form deliberately uses **manual email handoff**, as requested. It validates the contact details, formats the complete brief, and opens the visitor's email app addressed to **hikaristudioai@gmail.com**. The visitor reviews and presses Send. It never claims the request was delivered. A copy button and selectable complete brief provide a fallback when no email app is available.

The brief includes brand details, formats, plan, frequency, languages, notes, timestamp, source URL, and selected video references. Selected styles persist in session storage. Personal form fields remain in memory. No email API key is required. The recipient is defined in `src/lead.js`.

## Video library

Edit `src/content.js`. Each item has ID, slug, localized title and description, category, industry, tags, content language, media, poster, duration, aspect ratio, featured/published flags, and display order.

Add assets under `public/media/`:

- `your-slug.mp4`: H.264/AAC with fast start; keep at or below 720px wide. Never upscale originals.
- `your-slug.webp`: 600px wide poster.
- `your-slug.small.webp`: 300px wide poster.
- `your-slug.preview.mp4`: a silent 5-second preview, 288px wide, 15fps.

Then add a manifest item, translate its copy, and rebuild. The larger Brazil export is excluded; its phone export was used as the source. All nine videos were recompressed. `media-optimization.json` records the size changes: 239 MB to 45.7 MB, an 80.9% reduction. The full films retain audio; previews are silent. Original supplied files outside this repo were preserved.

Posters load first. Video files on detail pages use `preload="none"`. Only visible moving previews load; reduced-motion and data-saver preferences disable them. Initial JavaScript does not include the Remotion player.

## Motion

- `motion/remotion/BrandMotion.jsx`: deterministic 8-second React composition. The contact page lazy-loads `@remotion/player`. No video generation interface is exposed.
- `motion/remotion/index.jsx`: entry for Remotion tooling; the optional Remotion CLI is not a website dependency.
- `motion/hyperframes/index.html`: editable 400×400, 8-second HyperFrames brand composition, with a paused GSAP timeline and local assets.
- `public/motion/brand-preview.html`: website playback wrapper. It loops the finite composition separately and respects reduced motion. The homepage banner uses this asset.

GSAP's distributed license notice is retained in its vendor file. Review the applicable Remotion license before commercial production use: https://www.remotion.dev/license. The project does not accept licensing agreements on your behalf.

## SEO, GEO, and AEO

`src/seo.js` is shared by prerendering and client navigation. The build emits 45 HTML pages with localized titles, descriptions, Open Graph data, language alternates, canonicals, Organization/Service metadata, visible FAQs with matching FAQPage data, and VideoObject data for detail pages. There are no fabricated reviews, customer metrics, prices, addresses, or guarantees. `public/llms.txt` gives a concise factual service overview.

Before deploying, set the real canonical origin:

```sh
SITE_URL=https://your-real-domain.example npm run build
```

This is an illustrative value; replace it with your actual domain. When SITE_URL is omitted, the included Node server fills the origin into HTML, robots, and sitemap responses using the current host. For static-only hosting, SITE_URL must be set at build time. Never publish `{{ORIGIN}}` placeholders to a static host.

The default server serves the built site; any static host supporting directory indexes can serve `dist/` after the origin is configured. Vercel production deploys from `main` using `vercel.json`, Node 22, and the `dist/` output. SITE_URL is configured on Vercel as https://reelfarms.vercel.app. The feature branch remains available for development.

## Verification

`npm test` checks the complete video manifest, asset budgets, filters, duration formatting, translation parity, brief validation/encoding, selected references, and all 45 prerendered pages. Browser QA additionally covers mobile widths, desktop, search, style selection, package preselection, globe switching, validation, and playback.

## Production credit and tools

The header links to Montaj using its public brand mark from https://montaj.ag/montaj-logo.png. The footer's compact linked credit uses the owner-requested wording “Sponsored & Created with Montaj.ag”. The homepage production-tools section replaces the repeated delivery sample and describes the owner's paid studio workflow, current AI models, and human creative direction. Copy lives in `src/studio.js` in all three languages. Four FAQs show initially; the remaining questions are available through a native expandable control and remain in the rendered HTML and structured data.

## Homepage commercial

The hero uses the owner-supplied “I gotta make content” ReelFarm commercial (84.16 seconds). `reelfarm-commercial.mp4` is a 720p H.264/AAC web copy compressed from 75.1 MB to approximately 7.6 MB. The selected second concept uses a large reel with a POV headline, a caption at the bottom, and Get a Quote followed by Explore Videos directly below. The commercial plays muted when visible, respecting reduced motion and data saver; tapping the small sound icon starts the film with audio. Tapping the reel pauses or resumes playback. A 6-second preview file remains available as a media asset. The nine-video Explore library is unchanged.
