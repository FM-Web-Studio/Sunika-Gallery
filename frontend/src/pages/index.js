import { lazy } from 'react';

// Every page loads on demand, so a visitor only downloads the page they open.
export const Gallery = lazy(() => import('./Gallery'));
export const Contact = lazy(() => import('./Contact'));
export const NotFound = lazy(() => import('./NotFound'));
export const Policy = lazy(() => import('./Policy'));
export const Admin = lazy(() => import('./Admin'));
export const Privacy = lazy(() => import('./Legal').then((m) => ({ default: m.Privacy })));
export const Terms = lazy(() => import('./Legal').then((m) => ({ default: m.Terms })));
