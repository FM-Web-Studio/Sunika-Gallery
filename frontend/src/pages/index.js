import { lazy } from 'react';

/*
 * Lazy on purpose: static re-exports would ship the whole admin, the artwork editor
 * and react-select in the first bundle to every anonymous visitor.
 *
 * Loading stays eager. It IS the Suspense fallback, so lazy-loading it would mean
 * suspending in order to render the thing shown while suspended.
 */
export { default as Loading } from './Loading';

export const Gallery  = lazy(() => import('./Gallery'));
export const Contact  = lazy(() => import('./Contact'));
export const NotFound = lazy(() => import('./Not Found'));
export const Admin    = lazy(() => import('./Admin'));
