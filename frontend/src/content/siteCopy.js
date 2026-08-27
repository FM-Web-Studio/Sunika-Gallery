/**
 * Editable site copy for the Sunika gallery.
 *
 * Every visitor-facing heading, tagline and label that used to be hardcoded in
 * a page lives here as a field with a `default`. The default is the exact
 * string the page shipped with, so the site renders identically until an admin
 * edits it. Only values that differ from the default are stored in Firestore
 * (settings/galleryContent). Code stays the single source of truth for
 * anything untouched.
 *
 * `resolveGroup(fields, overrides)` overlays saved overrides onto the defaults.
 *
 * DECORATION BELONGS IN THESE STRINGS, never beside them in the JSX. Several
 * headings used to render their text from a field with a decorative glyph hardcoded
 * next to it, so an admin could edit the words but could not remove or change the
 * glyph. Anything a visitor reads as part of the title is part of the field.
 *
 * The defaults are deliberately plain text. Keep them that way.
 */

// Brand / footer
export const BRAND_FIELDS = [
  { key: 'brandName',     label: 'Brand name',     type: 'text',     default: 'Sunika' },
  { key: 'footerTagline', label: 'Footer tagline', type: 'textarea', default: 'Original paintings, drawings and artistic mixes.' },
  { key: 'footerNote',    label: 'Footer note',    type: 'text',     default: 'Made with love' },

  /*
   * The link across to the portfolio site.
   *
   * It is a copy field rather than a constant because the two sites are deployed
   * separately and from separate repos: hardcoding the portfolio's URL here would
   * mean a code change and a redeploy of THIS site every time that one moved. Left
   * blank, the link simply does not render, which is also the right behaviour
   * before the portfolio is live.
   */
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

// Tabs shown in the admin "Site Copy" editor. `key` matches the group name
// pages read from the settings/galleryContent document. Contact details and
// social links are edited separately (Contact / Social Links sections), backed by
// settings/galleryContact.
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
