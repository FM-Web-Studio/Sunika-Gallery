// Static configuration shared across the data layer.

// This project's Firestore + Storage are shared with the Sunika-Portfolio app,
// so every gallery resource is namespaced to avoid collisions.
export const COLLECTIONS = {
  artworks: 'gallery_artworks',
  messages: 'gallery_messages',
  settings: 'gallery_settings',
};
export const SETTINGS_DOC = 'contact';        // doc id inside gallery_settings
export const STORAGE_PREFIX = 'gallery';       // Storage folder for all gallery files

export const CATEGORIES = ['Paintings', 'Drawings', 'Artistic Mix'];

export const CURRENCY_SYMBOL = process.env.REACT_APP_CURRENCY_SYMBOL || 'R';

// Comma-separated allowlist of admin Google account emails (client-side UX gate).
// The real enforcement lives in firestore.rules / storage.rules.
export const ADMIN_EMAILS = (process.env.REACT_APP_ADMIN_EMAILS || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

export const formatPrice = (price) => {
  const n = Number(price);
  if (!price || Number.isNaN(n) || n === 0) return 'Price on request';
  return `${CURRENCY_SYMBOL}${n.toLocaleString()}`;
};

// ── Default site contact details ────────────────────────────────────────────
// Used to seed gallery_settings/contact and as a fallback if that doc is missing.
// The live values are stored in Firestore and editable from the admin panel.
// `type` maps to an icon in SocialLinks (instagram, facebook, whatsapp, tiktok, email).
export const SOCIAL_TYPES = ['instagram', 'facebook', 'whatsapp', 'tiktok', 'linkedin', 'email'];

export const DEFAULT_SETTINGS = {
  email: '',
  phone: '',
  location: '',
  socials: [],
};
