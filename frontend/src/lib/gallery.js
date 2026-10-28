export const ALL = 'All';

export const STATUSES = [
  { value: 'all', label: 'Everything' },
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Found a home' },
];

export const SORTS = [
  { value: 'curated', label: 'Curated by Sunika' },
  { value: 'newest', label: 'Newest first' },
  { value: 'loved', label: 'Most loved' },
  { value: 'rated', label: 'Highest rated' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
];

const seconds = (a) => a?.createdAt?.seconds ?? 0;
const average = (a) => (a.ratingCount > 0 ? a.ratingSum / a.ratingCount : 0);
const price = (a) => Number(a.price) || 0;
const unpricedLast = (fn) => (a, b) => {
  const pa = price(a);
  const pb = price(b);
  if (!pa !== !pb) return pa ? -1 : 1;
  return fn(pa, pb);
};

const COMPARE = {
  newest: (a, b) => seconds(b) - seconds(a),
  loved: (a, b) => (b.likeCount || 0) - (a.likeCount || 0),
  rated: (a, b) => average(b) - average(a) || (b.ratingCount || 0) - (a.ratingCount || 0),
  'price-asc': unpricedLast((a, b) => a - b),
  'price-desc': unpricedLast((a, b) => b - a),
};

export const filterArtworks = (list = [], { category = ALL, status = 'all', sort = 'curated' } = {}) => {
  const out = list.filter((a) => {
    if (category !== ALL && a.category !== category) return false;
    if (status === 'available' && a.sold) return false;
    if (status === 'sold' && !a.sold) return false;
    return true;
  });
  const compare = COMPARE[sort];
  return compare ? [...out].sort(compare) : out;
};

export const galleryStats = (list = []) => ({
  total: list.length,
  available: list.filter((a) => !a.sold).length,
});

export const fillTemplate = (template = '', values = {}) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));

export const formatPrice = (value) => {
  const n = Number(value);
  if (!n || Number.isNaN(n)) return 'Price on request';
  return `R ${Math.round(n).toLocaleString('en-ZA')}`;
};

export const artworkSrc = (artwork) => artwork?.webUrl || artwork?.imageUrl || '';

export const artworkMeta = (artwork) => [artwork?.category, artwork?.dimensions].filter(Boolean).join(', ');
