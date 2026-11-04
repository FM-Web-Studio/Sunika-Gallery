// The title, description and link preview for every page.
// vite.config.js writes one HTML file per page from this list, so WhatsApp, LinkedIn,
// Facebook and search engines see the right preview without running the app.
// usePageMeta keeps the same title and canonical link after in-app navigation.

// The address search engines should credit. The same pages are also served on
// sunika-studio-gallery.firebaseapp.com, and the canonical link keeps them from counting twice.
export const SITE_URL = 'https://sunika-studio-gallery.web.app';
export const SITE_NAME = 'Sunika Gallery';

// Hosting caches images for a year, so a changed preview image needs a NEW file name.
export const SHARE_IMAGE = '/og/share.jpg';
export const SHARE_ALT = 'The Eye Candy Design logo beside the words Sunika Gallery, original paintings, drawings and mixed pieces';

export const titleFor = (title) => (title ? `${title} | ${SITE_NAME}` : SITE_NAME);

export const PAGE_META = [
  {
    path: '/',
    file: 'index.html',
    title: SITE_NAME,
    description: 'Original paintings, drawings and mixed pieces by Sunika, each one made by hand and available to own.',
  },
  {
    path: '/contact',
    file: 'contact.html',
    title: titleFor('Contact'),
    description: 'Ask Sunika about a piece in the gallery, a commission, or anything else.',
  },
  {
    path: '/policy',
    file: 'policy.html',
    title: titleFor('Sales policy'),
    description: 'What to expect when you buy an original piece: returns, damage, colours, delivery, commissions and copyright.',
  },
  {
    path: '/privacy',
    file: 'privacy.html',
    title: titleFor('Privacy policy'),
    description: 'What this gallery collects, why, how long it is kept, and your rights under POPIA and the GDPR.',
  },
  {
    path: '/terms',
    file: 'terms.html',
    title: titleFor('Terms of use'),
    description: 'The terms for using this gallery: ownership of the work, acceptable use, liability and governing law.',
  },
];

// Pages that must never be indexed. They still get their own file so the noindex is in the HTML.
export const PRIVATE_META = [
  { path: '/admin', file: 'admin.html', title: 'Gallery admin', noindex: true },
];

export const NOT_FOUND_META = { file: '404.html', title: titleFor('Page not found'), noindex: true };

export const absoluteUrl = (path) => new URL(path, SITE_URL).href;

export const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sunika Lombard',
  url: SITE_URL,
  image: absoluteUrl('/brand-wordmark.png'),
  jobTitle: 'Artist',
  address: { '@type': 'PostalAddress', addressCountry: 'ZA' },
};
