# Sunika Gallery

The gallery site: original paintings, drawings and artistic mixes, each with a
price and a sold flag, rated and liked by visitors, all managed from `/admin`
rather than in code.

Live at https://sunika-studio-gallery.web.app

The portfolio site (projects, about, journey) is a separate repo and a separate
deploy: [`Sunika-Portfolio`](https://github.com/FM-Web-Studio/Sunika-Portfolio).

## One Firebase project, two sites

Both sites live in the Firebase project `sunika-project`. They share the
Firestore database, the Storage bucket and the admin allowlist. They do **not**
share data.

| | Gallery (this repo) | Portfolio |
| --- | --- | --- |
| Hosting target | `gallery` → `sunika-studio-gallery` | `portfolio` → `sunika-studio` |
| Firebase web app | `…web:a057f926f8e030ea4944cf` | `…web:53e9bbc0cdc7941b4944cf` |
| Firestore | `artworks` (+ `raters`/`likers`) | `projects`, `education`, `experience`, `profile`, `accomplishments` |
| Contact inbox | `galleryMessages` | `portfolioMessages` |
| Editable copy | `settings/galleryContent` | `settings/portfolioContent` |
| Contact details + socials | `settings/galleryContact` | `settings/portfolioContact` |
| Storage | `artworks/` | `projects/`, `profile/`, `accomplishments/` |

Every name has exactly one owner, so neither site can overwrite the other's
content. Collection names are declared in one place, `src/firebase/config.js`.

### What this repo does NOT deploy

`firestore.rules`, `storage.rules` and the Cloud Functions are **project-wide**,
not per-site. They have a single owner: the `Sunika-Portfolio` repo.

Two repos deploying the same rules file would race, and the last push would win,
silently reverting the other site's rules. So `firebase.json` here declares only
`hosting`, and the workflow deploys only `hosting:gallery`.

**If you add a collection or a Storage folder to this site, the matching rule has
to be added in the Sunika-Portfolio repo and deployed from there.** Until it is,
reads and writes to the new name are denied by the default-deny rule.

## Local development

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm test         # vitest
npm run build    # -> frontend/build
```

`frontend/.env` holds the Firebase web config and the admin allowlist. It is
gitignored; the same values are set as GitHub Actions secrets for the deploy.
They are baked into the client bundle and are not secrets, the real enforcement
is in the rules.

## Requirements on the Firebase project

- **Anonymous sign-in must be enabled** (Authentication → Sign-in method →
  Anonymous). Ratings and likes are one-per-visitor, and the only way the rules
  can hold that line is a uid the server issued. With it off, every rating and
  like fails. See `src/firebase/auth.js`.
- The Blaze plan, for the contact-form email function.

## Layout

```
frontend/src
  pages/Gallery     the grid, the filters and the lightbox. This is "/"
  pages/Contact     enquiry form + contact details
  pages/Admin       artworks, social links, contact details, site copy
  components        Artwork Card / Lightbox, Star Rating, Filter Panel / Dock, …
  firebase          one module per collection, over src/firebase/config.js
  content/siteCopy  every visitor-facing string, with its in-code default
```

Visitor-facing copy is not hardcoded in the pages: `content/siteCopy.js` declares
each string with a `default`, and only admin edits that differ from the default
are stored in Firestore. A test fails the build if a copy field exists that no
page renders.
