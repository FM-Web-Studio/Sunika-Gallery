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

```
frontend/src
  admin/       the admin: artworks, messages, contact details, wording
  components/  header, footer, artwork frame, viewer, stars, hearts, forms, modal, toasts
  content/     siteCopy.js, every visitor-facing string with its default
  context/     SiteContext, wording and contact details for the whole app
  firebase/    data access, one module per concern
  hooks/       theme and motion preferences, momentum scroll, auth
  lib/         small pure helpers, unit tested
  pages/       Gallery, Contact, NotFound
  styles/      tokens.css (colours, type, spacing) and base.css
```

Animations respect the visitor's reduced motion setting, and the lightning button
in the header turns them off for anyone who prefers a still page.

## Deploys

Every push to `main` installs, runs the tests, builds and deploys the gallery
hosting target.

## Requirements on the Firebase project

- Anonymous sign-in enabled. Ratings and hearts are one per visitor, and the rules
  can only hold that line with a uid the server issued.
- The Blaze plan, for the contact form email function.
