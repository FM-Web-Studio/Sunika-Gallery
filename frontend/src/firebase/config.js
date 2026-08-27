// Static configuration for the data layer.
//
// The gallery and the portfolio are two sites in one Firebase project. The prefix
// marks ownership: `gallery` means this site owns it, no prefix means shared.
//
//   shared     settings/contact, one email / phone / set of socials for both sites
//   gallery    artworks, galleryMessages, settings/galleryContent
//   portfolio  projects, education, experience, profile, accomplishments,
//              portfolioMessages, settings/portfolioContent, never read here

export const COLLECTIONS = {
  artworks: 'artworks',         // the pieces in the gallery grid
  messages: 'galleryMessages',  // contact-form submissions from THIS site
};

// Per-visitor vote records, subcollections of their artwork and keyed by the
// visitor's anonymous auth uid. That uid is what makes one-vote-per-visitor
// enforceable in firestore.rules rather than a localStorage promise.
export const ARTWORK_VOTES = {
  raters: 'raters',
  likers: 'likers',
};

// Single documents in the `settings` collection, this site's half of it.
export const SETTINGS_DOCS = {
  content: 'galleryContent',   // editable site copy, one group per page
  contact: 'contact',          // SHARED with the portfolio, see the note above
};

// Matched by prefix in storage.rules, so a new folder needs a matching rule.
export const STORAGE_FOLDERS = {
  artworks: 'artworks',
};

// Client-side UX gate only. Real enforcement is in firestore.rules / storage.rules,
// which are deployed from the Sunika-Portfolio repo, see README.md.
export const ADMIN_EMAILS = (import.meta.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

// Known social platform keys -> used to pick an icon in SocialLinks.
export const SOCIAL_KEYS = ['instagram', 'linkedin', 'facebook', 'behance', 'dribbble', 'tiktok', 'whatsapp', 'website', 'email'];

// Fallback when settings/contact is missing, and a seed for the admin form.
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
