import { lazy } from 'react';

/*
 * Routes are lazy on purpose, and that is what makes the <Suspense> in App.js real.
 *
 * Static re-exports would ship the whole admin, its section files, the artwork
 * editor and react-select, in the first bundle to every anonymous visitor, and
 * nothing would ever suspend, which would make the Loading fallback decoration.
 * Splitting them means the admin is only fetched by someone who opens /admin.
 *
 * Loading itself stays eager: it IS the Suspense fallback, so lazy-loading it would
 * mean suspending in order to render the thing shown while suspended.
 */
export { default as Loading } from './Loading';

export const Gallery  = lazy(() => import('./Gallery'));
export const Contact  = lazy(() => import('./Contact'));
export const NotFound = lazy(() => import('./Not Found'));
export const Admin    = lazy(() => import('./Admin'));
