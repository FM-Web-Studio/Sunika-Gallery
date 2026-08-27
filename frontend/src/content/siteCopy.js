/**
 * Editable site copy. Every visitor-facing string lives here with its `default`, and
 * only values an admin changes are stored in Firestore (settings/galleryContent), so
 * code stays the source of truth for anything untouched.
 *
 * DECORATION BELONGS IN THESE STRINGS, never beside them in the JSX, or an admin can
 * edit the words but not the glyph next to them. The defaults are plain text on
 * purpose. Keep them that way.
 */

// Brand / footer
export const BRAND_FIELDS = [
  { key: 'brandName',     label: 'Brand name',     type: 'text',     default: 'Sunika' },
  { key: 'footerTagline', label: 'Footer tagline', type: 'textarea', default: 'Original paintings, drawings and artistic mixes.' },
  { key: 'footerNote',    label: 'Footer note',    type: 'text',     default: 'Made with love' },

  /* The portfolio site. A copy field rather than a constant so moving that site does
     not need a redeploy of this one. Blank means the link does not render. */
  { key: 'portfolioUrl',   label: 'Portfolio site: URL',   type: 'text', default: '' },
  { key: 'portfolioLabel', label: 'Portfolio site: label', type: 'text', default: 'Portfolio' },
];

// Gallery page (original artworks). This is the site's landing page.
export const GALLERY_FIELDS = [
  { key: 'overline',      label: 'Header: overline',   type: 'text',     default: 'Sunika · Original Works' },
  { key: 'heading',       label: 'Header: title',      type: 'text',     default: 'The Gallery' },
  { key: 'subtitle',      label: 'Header: subtitle',   type: 'textarea', default: 'A curated collection of original paintings, drawings and artistic mixes, each one available to view and to own.' },
  { key: 'filtersLabel',  label: 'Filters button',     type: 'text',     default: 'Filters' },
  { key: 'emptyFiltered', label: 'No results message', type: 'text',     default: 'No pieces match this filter.' },
  { key: 'errorText',     label: 'Load error message', type: 'text',     default: 'Something went wrong loading the gallery.' },
];

// Contact page copy
export const CONTACT_PAGE_FIELDS = [
  { key: 'kicker',      label: 'Header: kicker',    type: 'text',     default: 'Say hello' },
  { key: 'heading',     label: 'Header: title',     type: 'text',     default: 'Enquire about a piece' },
  { key: 'subtitle',    label: 'Header: subtitle',  type: 'textarea', default: 'Interested in a painting, or after something made to order? Drop a message below or find me online.' },
  { key: 'formLabel',   label: 'Form: label',       type: 'text',     default: 'Send a message' },
  { key: 'socialLabel', label: 'Socials: label',    type: 'text',     default: 'Find me online' },
];

// Tabs in the admin "Site Copy" editor. Contact details and social links are edited
// separately, backed by settings/contact.
export const COPY_SCHEMA = [
  { key: 'brand',       label: 'Brand & Footer', fields: BRAND_FIELDS },
  { key: 'gallery',     label: 'Gallery',        fields: GALLERY_FIELDS },
  { key: 'contactPage', label: 'Contact page',   fields: CONTACT_PAGE_FIELDS },
];

// Every group's field list, keyed by group. Used by pages to resolve copy.
export const GROUP_FIELDS = {
  brand:       BRAND_FIELDS,
  gallery:     GALLERY_FIELDS,
  contactPage: CONTACT_PAGE_FIELDS,
};

/**
 * Overlay saved overrides onto the in-code defaults. An empty or whitespace-only
 * override falls back to the default so the page never renders blank.
 */
export const resolveGroup = (fields = [], overrides = {}) => {
  const out = {};
  for (const f of fields) {
    const ov = overrides?.[f.key];
    out[f.key] = (typeof ov === 'string' && ov.trim() !== '') ? ov : f.default;
  }
  return out;
};
