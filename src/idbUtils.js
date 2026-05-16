const DB_NAME = 'RadhaCounterDB';
const DB_VERSION = 1;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('backgrounds')) {
        db.createObjectStore('backgrounds', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBackground(userId, dataUrl) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('backgrounds', 'readwrite');
    const store = tx.objectStore('backgrounds');
    store.add({ userId, dataUrl });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBackgrounds(userId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('backgrounds', 'readonly');
    const store = tx.objectStore('backgrounds');
    const req = store.getAll();
    req.onsuccess = () => {
      const all = req.result;
      resolve(all.filter(b => b.userId === userId).map(b => b.dataUrl));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearBackgrounds(userId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('backgrounds', 'readwrite');
    const store = tx.objectStore('backgrounds');
    const req = store.getAll();
    req.onsuccess = () => {
      const all = req.result;
      all.forEach(item => {
        if (item.userId === userId) {
          store.delete(item.id);
        }
      });
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}
