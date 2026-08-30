// =========================================================================
// KOPARGAON CONNECT — RESILIENCE INDEXED DB PERSISTENCE
// Provides offline durability and continuous operation queuing
// =========================================================================

const DB_NAME = 'kopargaon_resilience_v2';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('journal')) {
        const store = db.createObjectStore('journal', { keyPath: 'operation_id' });
        store.createIndex('entity_id', 'entity_id', { unique: false });
        store.createIndex('sequence_number', 'sequence_number', { unique: true });
        store.createIndex('created_at', 'created_at', { unique: false });
      }

      if (!db.objectStoreNames.contains('snapshots')) {
        const store = db.createObjectStore('snapshots', { keyPath: 'snapshot_id' });
        store.createIndex('entity_id', 'entity_id', { unique: false });
        store.createIndex('entity_type', 'entity_type', { unique: false });
      }

      if (!db.objectStoreNames.contains('incidents')) {
        db.createObjectStore('incidents', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('recovery_queue')) {
        const store = db.createObjectStore('recovery_queue', { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('classification', 'classification', { unique: false });
      }

      if (!db.objectStoreNames.contains('audit')) {
        const store = db.createObjectStore('audit', { keyPath: 'id' });
        store.createIndex('incident_id', 'incident_id', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains('pending_tx')) {
        const store = db.createObjectStore('pending_tx', { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbPut<T>(storeName: string, value: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IDB Put error in ${storeName}:`, err);
  }
}

export async function idbGetAll<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IDB GetAll error in ${storeName}:`, err);
    return [];
  }
}

export async function idbGet<T>(storeName: string, key: IDBValidKey): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IDB Get error in ${storeName}:`, err);
    return null;
  }
}

export async function idbDelete(storeName: string, key: IDBValidKey): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IDB Delete error in ${storeName}:`, err);
  }
}

export async function idbClear(storeName: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IDB Clear error in ${storeName}:`, err);
  }
}
