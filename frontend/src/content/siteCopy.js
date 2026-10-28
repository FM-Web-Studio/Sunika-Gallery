const BRAND_FIELDS = [
  { key: 'brandName', label: 'Name in the header', type: 'text', default: 'Sunika' },
  { key: 'footerCta', label: 'Footer headline', type: 'text', default: 'Found a piece you cannot stop thinking about?' },
  { key: 'footerButton', label: 'Footer button', type: 'text', default: 'Ask about it' },
  { key: 'footerLine', label: 'Footer line', type: 'textarea', default: 'Original paintings, drawings and mixed pieces, each one made by hand.' },
  { key: 'portfolioUrl', label: 'Portfolio link address', type: 'text', default: 'https://sunika-studio.web.app' },
  { key: 'portfolioLabel', label: 'Portfolio link text', type: 'text', default: 'See my design portfolio' },
];

const GALLERY_FIELDS = [
  { key: 'heroCta', label: 'Hero button', type: 'text', default: 'View this piece' },
  { key: 'marquee', label: 'Moving ribbon, separate items with commas', type: 'text', default: 'Original paintings, Drawings, Mosaics, Made by hand, One of a kind, Sculpture and beadwork' },
  { key: 'heading', label: 'Introduction title', type: 'text', default: 'Original work by Sunika' },
  { key: 'intro', label: 'Introduction', type: 'textarea', default: 'Paintings, drawings and mixed pieces, each one made by hand and waiting for the right wall. Take your time, leave a heart on the ones you love, and ask about any piece that speaks to you.' },
  { key: 'stats', label: 'Count line, {total} and {available} fill in', type: 'text', default: '{total} works in the collection, {available} available now' },
  { key: 'collectionHeading', label: 'Collection title', type: 'text', default: 'The collection' },
  { key: 'empty', label: 'When a filter shows nothing', type: 'text', default: 'Nothing matches that filter right now. Try another one.' },
  { key: 'error', label: 'When the gallery cannot load', type: 'text', default: 'The gallery could not load. Check your connection and refresh the page.' },
];

const VIEWER_FIELDS = [
  { key: 'enquire', label: 'Ask button', type: 'text', default: 'Ask about this piece' },
  { key: 'soldNote', label: 'Note on sold pieces', type: 'textarea', default: 'This piece has found a home. Ask about something similar or a commission of your own.' },
  { key: 'rateLabel', label: 'Rating prompt', type: 'text', default: 'How does it make you feel?' },
];

const CONTACT_FIELDS = [
  { key: 'heading', label: 'Page title', type: 'text', default: "Let's talk about art" },
  { key: 'intro', label: 'Introduction', type: 'textarea', default: 'Ask about a piece on the wall, a commission, or anything else. Every message comes straight to me.' },
  { key: 'formHeading', label: 'Form title', type: 'text', default: 'Send a message' },
  { key: 'detailsHeading', label: 'Details title', type: 'text', default: 'Other ways to reach me' },
  { key: 'pieceMessage', label: 'Prefilled message, {title} fills in', type: 'textarea', default: 'Hi Sunika, I would love to know more about "{title}".' },
  { key: 'sent', label: 'After sending', type: 'text', default: 'Thank you, your message is on its way.' },
];

const NOT_FOUND_FIELDS = [
  { key: 'heading', label: 'Title', type: 'text', default: 'This wall is empty' },
  { key: 'body', label: 'Text', type: 'textarea', default: 'The page you followed does not exist. The gallery is right where you left it.' },
  { key: 'cta', label: 'Button', type: 'text', default: 'Back to the gallery' },
];

export const COPY_SCHEMA = [
  { key: 'brand', label: 'Header and footer', fields: BRAND_FIELDS },
  { key: 'gallery', label: 'Gallery', fields: GALLERY_FIELDS },
  { key: 'viewer', label: 'Artwork view', fields: VIEWER_FIELDS },
  { key: 'contactPage', label: 'Contact', fields: CONTACT_FIELDS },
  { key: 'notFound', label: 'Missing page', fields: NOT_FOUND_FIELDS },
];

export const GROUP_FIELDS = Object.fromEntries(COPY_SCHEMA.map((g) => [g.key, g.fields]));

export const resolveGroup = (fields = [], overrides = {}) => {
  const out = {};
  for (const f of fields) {
    const ov = overrides?.[f.key];
    out[f.key] = typeof ov === 'string' && ov.trim() !== '' ? ov : f.default;
  }
  return out;
};

export const overridesFor = (draft = {}) => {
  const out = {};
  for (const group of COPY_SCHEMA) {
    const g = {};
    for (const f of group.fields) {
      const val = (draft[group.key]?.[f.key] ?? '').trim();
      if (val !== '' && val !== f.default) g[f.key] = val;
    }
    if (Object.keys(g).length) out[group.key] = g;
  }
  return out;
};
