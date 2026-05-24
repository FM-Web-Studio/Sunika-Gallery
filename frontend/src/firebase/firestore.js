import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './index';

// ─── Portfolio document reads ─────────────────────────────────────────────────

const portfolioDoc = (id) => getDoc(doc(db, 'portfolio', id)).then(s => s.data() ?? null);

export const getPersonal  = () => portfolioDoc('personal');
export const getContact   = () => portfolioDoc('contact');
export const getSkills    = () => portfolioDoc('skills');
export const getSocial    = () => portfolioDoc('social').then(d => d?.platforms ?? []);
export const getInterests = () => portfolioDoc('interests').then(d => d?.items ?? []);

// ─── Ordered collection reads ─────────────────────────────────────────────────

const orderedCollection = async (col) => {
  const snap = await getDocs(query(collection(db, col), orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getEducation       = () => orderedCollection('education');
export const getDesignProjects  = () => orderedCollection('projects');

// ─── Full portfolio fetch (all sections in parallel) ─────────────────────────

export const getPortfolio = () =>
  Promise.all([
    getPersonal(), getContact(), getSocial(),
    getSkills(), getInterests(), getEducation(),
  ]).then(([personal, contact, social, skills, interests, education]) => ({
    personal, contact, social, skills, interests, education,
    experience: [],
  }));

// ─── Contact form write ───────────────────────────────────────────────────────

export { submitContactForm } from './contact';
