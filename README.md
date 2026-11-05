# Sunika Gallery

The gallery site: original paintings, drawings and mixed pieces, hung salon style on
a mint plaster wall. Each piece has a wall label with its title, kind, size and price,
and a red dot once it has sold. Visitors can open any piece in a dark viewing room,
leave it a heart and a star rating, and ask about it straight from the contact form.
Everything is managed from `/admin`.

Live at https://sunika-studio-gallery.web.app

The portfolio site is a separate repo and deploy:
[`Sunika-Portfolio`](https://github.com/FM-Web-Studio/Sunika-Portfolio).

## Using the admin

Go to `/admin` and sign in with Google. Only the emails in the rules files and
`ADMIN_EMAILS` get in.

| Section | What it changes |
| --- | --- |
| Artworks | Add, edit, sell, reorder and delete pieces. The order here is the order on the wall |
| Messages | Contact form messages from this site. Open one to mark it read, reply or delete |
| Contact details | Email, phone, location and social links, shared with the portfolio site |
| Wording | Every heading and sentence visitors read, with a reset per field |

Images: every upload is stored twice, the original and a web copy (WebP, at most
1800 px) in a `web/` folder beside it. The wall and the viewer show the web copy.
Replacing an image uploads the new one first, saves the artwork, and only then
deletes the old original and its web copy, so a failed upload never leaves an
artwork without a picture. Deleting an artwork removes its images, ratings and hearts.

Shareable links: opening a piece adds `?piece=<id>` to the address, and filters add
`category`, `status` and `sort`, so any view can be copied and sent to someone.

## One Firebase project, two sites

| | Gallery (this repo) | Portfolio |
| --- | --- | --- |
| Hosting target | `gallery`, site `sunika-studio-gallery` | `portfolio`, site `sunika-studio` |
| Firestore | `artworks` (+ `raters`, `likers`) | `projects`, `education`, `experience`, `profile`, `accomplishments` |
| Contact inbox | `galleryMessages` | `portfolioMessages` |
| Editable wording | `settings/galleryContent` | `settings/portfolioContent` |
| Storage | `artworks/` | `projects/`, `profile/`, `accomplishments/` |

**Shared by both:** `settings/contact`.

`firestore.rules`, `storage.rules` and the Cloud Functions are project wide and are
owned by the Sunika-Portfolio repo. This repo deploys only `hosting:gallery`. A new
collection or Storage folder here needs its rule added there first.

## Local development

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm test         # vitest
npm run build    # writes frontend/build
```

`frontend/.env` holds the Firebase web config and `ADMIN_EMAILS`. It is gitignored
and mirrored as GitHub Actions secrets. The values end up in the client bundle and
are not secret; the rules do the real enforcement.

`FIREBASE_APPCHECK_SITE_KEY` (a reCAPTCHA v3 site key) turns on Firebase App Check.
Leave it unset and App Check stays off. For local work with enforcement on, also set
`FIREBASE_APPCHECK_DEBUG_TOKEN` to a debug token registered in the console.

```
frontend/src
  components/  shared UI, one folder each: Viewer/Viewer.js, Viewer.module.css and an index.js barrel
  content/     siteCopy.js, every visitor-facing string with its default; legal.js, privacy and terms;
               seo.js, each page's title, description and link preview
  context/     SiteContext, wording and contact details for the whole app
  firebase/    data access, one module per concern
  hooks/       theme and motion preferences, on-screen checks, intro, interactions, auth, page meta
  lib/         small pure helpers, unit tested
  pages/       one folder per page, lazy loaded through pages/index.js
    Admin/     the admin: sections/ (artworks, messages, contact details, wording), parts/ (form, sorting)
  styles/      tokens.css (colours, type, spacing) and base.css
```

Import a component through its folder (`../components/Modal`), not the file inside it.

## Link previews and search

Link preview bots (WhatsApp, LinkedIn, Facebook, Slack) do not run JavaScript, so the
build writes one HTML file per page with its title, description and preview image
already in the head, plus `sitemap.xml` and `robots.txt`. All of it comes from
`src/content/seo.js`; add a page there and a matching rewrite in `firebase.json`.
The preview image is `frontend/public/og/share.jpg` (1200 x 630). A changed image
needs a new file name, or apps keep showing the cached one. A shared `?piece=` link
shows the gallery's preview, not the piece itself: that would need a server.

The opening animation is the portfolio's, in the gallery's colours. It lives in
`frontend/index.html` so it shows before the app has loaded, and `src/hooks/useIntro.js`
lifts it once the first featured image has loaded (at least 2.3 s, at most 5 s, or
straight away on a click, key or scroll). It plays at most once every 12 hours per
browser (`sunika.intro` in localStorage) and never on `/admin`. Its logo is
`public/intro-wordmark.webp`, the same file as the portfolio's.

"Throw some paint" (`components/PaintSplat`, shapes in `lib/splat.js`) is a small canvas
visitors click to splash paint on. It only draws while a splash is landing, so it costs
nothing when idle. Cards and buttons share one spring driven tilt and pull (`src/hooks/useInteractions.js`).
Under the hero, the wave ribbon (`components/WaveRibbon`, curve maths in `lib/wave.js`)
carries the words set in Wording along a pink wave, with a stitched teal ribbon flowing
the other way behind it. Both only slide sideways, so the browser moves them cheaply,
and they pause when off screen.

The watermark (`lib/watermark.js`) is tiled over every picture on screen. It is a layer
in the page, not part of the image file, so it deters casual copying but a determined
person who finds the file address gets a clean copy.

Animations respect the visitor's reduced motion setting, and the lightning button
in the header turns them off for anyone who prefers a still page.

## Deploys

Every push to `main` installs, runs the tests, builds and deploys the gallery
hosting target. The contact form posts to the `sendMessage` function, which checks
for spam and is deployed from the portfolio repo; the workflow stops if it is not live.

## Requirements on the Firebase project

- Anonymous sign-in enabled. Ratings and hearts are one per visitor, and the rules
  can only hold that line with a uid the server issued.
- The Blaze plan, for the contact form functions.
