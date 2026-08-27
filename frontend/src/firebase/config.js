// Static configuration shared across the data layer.
//
// The gallery and the portfolio are two separate sites sharing ONE Firebase
// project, so every name here is picked so that it has exactly one owner.
//
// A collection only this site touches keeps its plain name (`artworks`, and the
// `artworks/` folder in Storage). Anything both sites would otherwise have wanted
// to call the same thing, the contact details, the editable copy, the contact-form
// inbox, carries a `gallery` prefix, because the portfolio holds its own copy of
// each of those and the two must never overwrite one another.
//
// The portfolio's own names are `portfolioMessages`, `settings/portfolioContent`
// and `settings/portfolioContact`. Nothing in this repo should ever read them.

export const COLLECTIONS = {
  artworks: 'artworks',         // the pieces in the gallery grid
  messages: 'galleryMessages',  // contact-form submissions from THIS site
};

// Per-visitor vote records, kept as subcollections of the artwork they belong to
// and keyed by the visitor's anonymous auth uid. They are what makes one-vote-
// per-visitor enforceable in firestore.rules rather than a localStorage promise.
export const ARTWORK_VOTES = {
  raters: 'raters',
  likers: 'likers',
};

// Single documents in the `settings` collection, this site's half of it.
export const SETTINGS_DOCS = {
  content: 'galleryContent',   // editable site copy, one group per page
  contact: 'galleryContact',   // email / phone / location + social links
};

// Storage folders, one per collection that owns files. Matched by prefix in
// storage.rules, so a new folder needs a matching rule.
export const STORAGE_FOLDERS = {
  artworks: 'artworks',
};

// Comma-separated allowlist of admin Google account emails (client-side UX gate).
// Real enforcement lives in firestore.rules / storage.rules, which are deployed
// from the Sunika-Portfolio repo, see README.md.
export const ADMIN_EMAILS = (import.meta.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Known social platform keys → used to pick an icon in SocialLinks.
export const SOCIAL_KEYS = ['instagram', 'linkedin', 'facebook', 'behance', 'dribbble', 'tiktok', 'whatsapp', 'website', 'email'];

// ── Defaults ─────────────────────────────────────────────────────────────────
// Used as a fallback when settings/galleryContact is missing, and to seed the
// admin form.
export const DEFAULT_CONTACT = {
  email:    '',
  phone:    '',
  location: '',
};

// ── Gallery ──────────────────────────────────────────────────────────────────
export const CATEGORIES = ['Paintings', 'Drawings', 'Artistic Mix'];

export const CURRENCY_SYMBOL = 'R';

export const formatPrice = (price) => {
  const n = Number(price);
  if (!price || Number.isNaN(n) || n === 0) return 'Price on request';
  return `${CURRENCY_SYMBOL}${n.toLocaleString()}`;
};
