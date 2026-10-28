import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getContent } from '../firebase/content';
import { subscribeContact, EMPTY_CONTACT } from '../firebase/contact';
import { GROUP_FIELDS, resolveGroup } from '../content/siteCopy';

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [contact, setContact] = useState(EMPTY_CONTACT);

  const reload = useCallback(async () => setContent(await getContent()), []);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => subscribeContact(setContact, (err) => console.error('Contact details could not load.', err)), []);

  const copy = useCallback((group) => resolveGroup(GROUP_FIELDS[group], content?.[group]), [content]);

  const value = useMemo(() => ({ content, copy, reload, contact }), [content, copy, reload, contact]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
};
