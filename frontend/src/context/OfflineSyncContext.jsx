import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { indexedDb } from "../services/indexedDb";
import { api } from "../services/api";

const OfflineSyncContext = createContext(null);

export const OfflineSyncProvider = ({ children }) => {
  const [isDbOnline, setIsDbOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingActions, setPendingActions] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncStatus, setLastSyncStatus] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  // Refresh pending count and items from IndexedDB
  const refreshPendingQueue = useCallback(async () => {
    try {
      const items = await indexedDb.getPendingActions();
      setPendingActions(items);
      setPendingCount(items.length);
    } catch (e) {
      console.error("Failed to read IndexedDB sync queue:", e);
    }
  }, []);

  // Poll DB Health status periodically
  const checkHealth = useCallback(async () => {
    try {
      const res = await api.getDbHealth();
      if (res) {
        setIsDbOnline(!res.simulatedDown && res.isHealthy);
      }
    } catch (e) {
      if (e.isDatabaseUnavailable || e.status === 503) {
        setIsDbOnline(false);
      }
    }
  }, []);

  useEffect(() => {
    refreshPendingQueue();
    checkHealth();

    const interval = setInterval(() => {
      checkHealth();
      refreshPendingQueue();
    }, 5000);

    return () => clearInterval(interval);
  }, [checkHealth, refreshPendingQueue]);

  // Synchronize all pending actions in IndexedDB to MongoDB Atlas
  const syncPendingQueue = useCallback(async () => {
    const items = await indexedDb.getPendingActions();
    if (!items || items.length === 0) {
      setLastSyncStatus({ success: true, count: 0, message: "No pending items to sync." });
      return;
    }

    setIsSyncing(true);
    let successCount = 0;
    const errors = [];

    for (const item of items) {
      try {
        await api.replayPendingAction(item);
        await indexedDb.removePendingAction(item.id);
        successCount++;
      } catch (err) {
        console.warn(`[Sync Replay Error] Item ${item.id} failed:`, err);
        errors.push({ id: item.id, error: err.message });
      }
    }

    await refreshPendingQueue();
    setIsSyncing(false);

    if (successCount > 0) {
      const statusMsg = `✅ ${successCount} offline action${successCount > 1 ? 's' : ''} synchronized successfully to MongoDB Atlas!`;
      setLastSyncStatus({
        success: true,
        count: successCount,
        timestamp: new Date().toISOString(),
        message: statusMsg
      });
      setToastNotification(statusMsg);
      setTimeout(() => setToastNotification(null), 6000);
    }
  }, [refreshPendingQueue]);

  // Simulate Database Failure (Judge / Demo Trigger)
  const simulateDbFailure = async () => {
    try {
      const res = await api.toggleDbFailure();
      setIsDbOnline(false);
      const msg = "⚠️ MongoDB Outage Simulated! System entered Offline Recovery Mode (IndexedDB Active).";
      setToastNotification(msg);
      setTimeout(() => setToastNotification(null), 5000);
      return res;
    } catch (e) {
      setIsDbOnline(false);
    }
  };

  // Restore Database & Trigger Auto-Sync
  const restoreDatabase = async () => {
    try {
      const res = await api.restoreDb();
      setIsDbOnline(true);
      const msg = "🟢 MongoDB Connection Restored! Auto-synchronizing pending offline records...";
      setToastNotification(msg);
      
      // Auto-trigger sync
      setTimeout(() => {
        syncPendingQueue();
      }, 600);

      return res;
    } catch (e) {
      console.error("Restore DB error:", e);
    }
  };

  /**
   * Helper to execute API actions with automatic IndexedDB offline fallback
   */
  const executeWithOfflineSupport = async ({
    type,
    title,
    endpoint,
    method = "POST",
    payload,
    directApiCall
  }) => {
    // If DB is known to be simulated down, directly queue into IndexedDB
    if (!isDbOnline) {
      const queuedItem = await indexedDb.savePendingAction({
        type,
        title,
        endpoint,
        method,
        payload
      });
      await refreshPendingQueue();
      return {
        isOfflineQueued: true,
        item: queuedItem,
        message: `💾 Saved locally in IndexedDB — will sync automatically when database restores!`
      };
    }

    // Try executing live API call
    try {
      const result = await directApiCall();
      return { isOfflineQueued: false, result };
    } catch (err) {
      if (err.isDatabaseUnavailable || err.status === 503 || !navigator.onLine) {
        // Save to IndexedDB
        const queuedItem = await indexedDb.savePendingAction({
          type,
          title,
          endpoint,
          method,
          payload
        });
        await refreshPendingQueue();
        setIsDbOnline(false);
        return {
          isOfflineQueued: true,
          item: queuedItem,
          message: `💾 Database unavailable: Saved locally in IndexedDB — will sync automatically when MongoDB restores!`
        };
      }
      throw err;
    }
  };

  return (
    <OfflineSyncContext.Provider
      value={{
        isDbOnline,
        isSyncing,
        pendingActions,
        pendingCount,
        lastSyncStatus,
        toastNotification,
        refreshPendingQueue,
        syncPendingQueue,
        simulateDbFailure,
        restoreDatabase,
        executeWithOfflineSupport,
        clearToast: () => setToastNotification(null)
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = () => {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error("useOfflineSync must be used within an OfflineSyncProvider");
  }
  return context;
};
