/**
 * One-off bootstrap: upload the images in frontend/public/Gallery to Firebase
 * Storage and create a matching Firestore `artworks` document for each.
 *
 * Prerequisites:
 *   1. Blaze plan enabled, Storage bucket created.
 *   2. A service account key JSON. Point to it with GOOGLE_APPLICATION_CREDENTIALS,
 *      or place it at the repo root as serviceAccount.json.
 *   3. frontend/.env filled in (reads project id + storage bucket from it).
 *
 * Run:  cd frontend && npm install && npm run seed
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(__dirname, '..');
const REPO_ROOT = join(FRONTEND, '..');
const GALLERY_DIR = join(FRONTEND, 'public', 'Gallery');

// Keep these in sync with src/firebase/config.js (shared Firestore/Storage namespace).
const COL_ARTWORKS  = 'gallery_artworks';
const COL_SETTINGS  = 'gallery_settings';
const SETTINGS_DOC  = 'contact';
const STORAGE_PREFIX = 'gallery';

const DEFAULT_SETTINGS = {
  email: 'hello@example.com',
  phone: '',
  location: '',
  socials: [
    { type: 'instagram', label: 'Instagram', href: 'https://instagram.com/your-handle' },
    { type: 'facebook',  label: 'Facebook',  href: 'https://facebook.com/your-page' },
    { type: 'whatsapp',  label: 'WhatsApp',  href: 'https://wa.me/27000000000' },
    { type: 'email',     label: 'Email',     href: 'mailto:hello@example.com' },
  ],
};

// ── Read frontend/.env (no dotenv dependency) ────────────────────────────────
const parseEnv = (path) => {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
};
const env = parseEnv(join(FRONTEND, '.env'));

const projectId  = env.REACT_APP_FIREBASE_PROJECT_ID;
const bucketName = env.REACT_APP_FIREBASE_STORAGE_BUCKET;
if (!projectId || !bucketName) {
  console.error('Missing REACT_APP_FIREBASE_PROJECT_ID or REACT_APP_FIREBASE_STORAGE_BUCKET in frontend/.env');
  process.exit(1);
}

// ── Service account credentials ──────────────────────────────────────────────
const saPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || join(REPO_ROOT, 'serviceAccount.json');
if (!existsSync(saPath)) {
  console.error(`Service account key not found at ${saPath}. Set GOOGLE_APPLICATION_CREDENTIALS or add serviceAccount.json at the repo root.`);
  process.exit(1);
}
const serviceAccount = JSON.parse(readFileSync(saPath, 'utf8'));

initializeApp({ credential: cert(serviceAccount), projectId, storageBucket: bucketName });
const db = getFirestore();
const bucket = getStorage().bucket();

const CONTENT_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

// "1. 2 Ships.jpeg" -> "2 Ships"
const titleFromFile = (file) => basename(file, extname(file)).replace(/^\s*\d+\.\s*/, '').trim();

const run = async () => {
  const categories = readdirSync(GALLERY_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let order = 0;
  let created = 0;

  for (const category of categories) {
    const dir = join(GALLERY_DIR, category);
    const files = readdirSync(dir).filter((f) => CONTENT_TYPES[extname(f).toLowerCase()]);

    for (const file of files) {
      const docRef = db.collection(COL_ARTWORKS).doc();
      const destination = `${STORAGE_PREFIX}/artworks/${docRef.id}/${file}`;
      const token = randomUUID();
      const contentType = CONTENT_TYPES[extname(file).toLowerCase()];

      await bucket.upload(join(dir, file), {
        destination,
        metadata: { contentType, metadata: { firebaseStorageDownloadTokens: token } },
      });

      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(destination)}?alt=media&token=${token}`;

      await docRef.set({
        title: titleFromFile(file),
        category,
        description: '',
        price: 0,
        dimensions: '',
        sold: false,
        imageUrl,
        imagePath: destination,
        order: order++,
        ratingSum: 0,
        ratingCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      created++;
      console.log(`✓ ${category} / ${titleFromFile(file)}`);
    }
  }

  // Seed the contact/socials settings section if it doesn't exist yet.
  const settingsRef = db.collection(COL_SETTINGS).doc(SETTINGS_DOC);
  if (!(await settingsRef.get()).exists) {
    await settingsRef.set({ ...DEFAULT_SETTINGS, updatedAt: FieldValue.serverTimestamp() });
    console.log('✓ seeded gallery_settings/contact (edit the real socials in /admin)');
  }

  console.log(`\nDone. Created ${created} artworks.`);
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
