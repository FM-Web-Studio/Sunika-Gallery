# Firebase Module

Thin wrappers around Firestore reads and writes.

- `index.js`     — initialises the Firebase app from env vars
- `firestore.js` — all Firestore read helpers + re-exports submitContactForm
- `contact.js`   — writes visitor messages to `contacts/{id}`

## Required env vars (see `.env.local.example` at repo root)

```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
```
