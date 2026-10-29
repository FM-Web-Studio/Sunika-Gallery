import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../content/legal';

// Gives a page its own title and canonical address, and puts the site defaults back on the way out.
export const usePageMeta = ({ title, description }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.head.querySelector('meta[name="description"]');
    const previousDescription = meta?.content;
    const canonical = Object.assign(document.createElement('link'), { rel: 'canonical', href: SITE_URL + pathname });

    document.title = `${title} | Sunika Gallery`;
    if (meta && description) meta.content = description;
    document.head.appendChild(canonical);

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription) meta.content = previousDescription;
      canonical.remove();
    };
  }, [title, description, pathname]);
};
