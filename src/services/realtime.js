// Realtime sync helper: BroadcastChannel (local tabs) + optional Firebase Firestore sync
// To enable Firebase syncing, set the following env vars in a .env file at project root:
// REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, REACT_APP_FIREBASE_PROJECT_ID,
// REACT_APP_FIREBASE_STORAGE_BUCKET, REACT_APP_FIREBASE_MESSAGING_SENDER_ID, REACT_APP_FIREBASE_APP_ID

let bc = null;
let firebaseApp = null;
let firestore = null;

export function initBroadcast(channelName = 'luxe-cart-channel') {
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel(channelName);
    }
  } catch (e) {
    bc = null;
  }
  return bc;
}

export function listenBroadcast(onMessage) {
  if (!bc) initBroadcast();
  if (!bc) return () => {};
  const handler = (ev) => {
    if (!ev?.data) return;
    onMessage(ev.data);
  };
  bc.addEventListener('message', handler);
  return () => bc.removeEventListener('message', handler);
}

export function postBroadcast(payload) {
  if (!bc) initBroadcast();
  if (!bc) return;
  try { bc.postMessage(payload); } catch (e) { /* ignore */ }
}

// --------- Optional Firebase integration ---------
// Dynamically import firebase to avoid bundling if not used.
export async function initFirebaseIfConfigured() {
  if (firebaseApp) return { app: firebaseApp, firestore };

  const key = process.env.REACT_APP_FIREBASE_API_KEY;
  if (!key) return null; // not configured

  const firebase = await import('firebase/app');
  await import('firebase/firestore');

  const cfg = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  if (!firebase.getApps || firebase.getApps().length === 0) {
    firebaseApp = firebase.initializeApp(cfg);
  } else {
    firebaseApp = firebase.getApp();
  }

  firestore = firebase.firestore();
  return { app: firebaseApp, firestore };
}

export async function subscribeRemoteCart(userId, onChange) {
  const initialized = await initFirebaseIfConfigured();
  if (!initialized) return () => {};
  try {
    const docRef = firestore.collection('carts').doc(userId);
    const unsub = docRef.onSnapshot((snap) => {
      if (!snap.exists) return onChange(null);
      const data = snap.data();
      onChange(data.cart || []);
    });
    return unsub;
  } catch (e) {
    return () => {};
  }
}

export async function setRemoteCart(userId, cart) {
  const initialized = await initFirebaseIfConfigured();
  if (!initialized) return null;
  try {
    const docRef = firestore.collection('carts').doc(userId);
    await docRef.set({ cart, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (e) {
    return null;
  }
}

export default {
  initBroadcast,
  listenBroadcast,
  postBroadcast,
  initFirebaseIfConfigured,
  subscribeRemoteCart,
  setRemoteCart,
};
