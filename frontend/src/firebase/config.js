export const COLLECTIONS = {
  artworks: 'artworks',
  messages: 'galleryMessages',
  settings: 'settings',
};

export const ARTWORK_VOTES = {
  raters: 'raters',
  likers: 'likers',
};

export const SETTINGS_DOCS = {
  content: 'galleryContent',
  contact: 'contact',
};

export const STORAGE_FOLDERS = {
  artworks: 'artworks',
};

export const ADMIN_EMAILS = (import.meta.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const SOCIAL_KEYS = ['instagram', 'behance', 'dribbble', 'linkedin', 'facebook', 'tiktok', 'pinterest', 'whatsapp', 'website', 'email'];

export const CATEGORIES = ['Paintings', 'Drawings', 'Artistic Mix'];
