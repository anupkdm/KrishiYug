/**
 * KrishiMitra IndexedDB Offline Storage & Resilient Sync Queue Manager
 * Database: KrishiMitraOfflineDB
 * ObjectStores:
 *  - 'pending_sync_queue': stores offline mutations { id, type, title, endpoint, method, payload, timestamp, status }
 *  - 'local_cache': mirrors essential farmer/labour state locally
 */

const DB_NAME = "KrishiMitraOfflineDB";
const DB_VERSION = 1;
const STORE_QUEUE = "pending_sync_queue";
const STORE_CACHE = "local_cache";

class IndexedDbService {
  constructor() {
    this.db = null;
    this.initPromise = this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        console.warn("IndexedDB is not supported in this browser environment.");
        return resolve(null);
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_QUEUE)) {
          const queueStore = db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
          queueStore.createIndex("timestamp", "timestamp", { unique: false });
          queueStore.createIndex("type", "type", { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_CACHE)) {
          db.createObjectStore(STORE_CACHE, { keyPath: "key" });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error("IndexedDB initialization error:", event.target.error);
        reject(event.target.error);
      };
    });
  }

  async getDb() {
    if (this.db) return this.db;
    return await this.initPromise;
  }

  /**
   * Save an offline action into the sync queue
   */
  async savePendingAction(action) {
    const db = await this.getDb();
    if (!db) return null;

    const item = {
      id: action.id || `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: action.type || "GENERIC_MUTATION",
      title: action.title || "Offline Request",
      endpoint: action.endpoint,
      method: action.method || "POST",
      payload: action.payload || {},
      token: action.token || null,
      timestamp: action.timestamp || new Date().toISOString(),
      status: "pending"
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readwrite");
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.put(item);

      req.onsuccess = () => resolve(item);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Get all pending sync actions
   */
  async getPendingActions() {
    const db = await this.getDb();
    if (!db) return [];

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readonly");
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.getAll();

      req.onsuccess = () => {
        const items = req.result || [];
        // Sort oldest to newest for chronological replay
        items.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        resolve(items);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Remove a successfully synced action from queue
   */
  async removePendingAction(id) {
    const db = await this.getDb();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readwrite");
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Clear all pending items
   */
  async clearPendingQueue() {
    const db = await this.getDb();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readwrite");
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.clear();

      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }
}

export const indexedDb = new IndexedDbService();
