import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../database/db';
import { SyncQueueItem, SyncHistoryItem } from '../types';

interface OfflineContextType {
  isOfflineSimulated: boolean;
  toggleOfflineSimulation: () => void;
  isEffectiveOffline: boolean;
  syncQueue: SyncQueueItem[];
  syncQueueCount: number;
  triggerSync: () => Promise<number>;
  isSyncing: boolean;
  lastSyncTime: string | null;
  addToSyncQueue: (action: SyncQueueItem['action'], entity: SyncQueueItem['entity'], payload: any) => Promise<void>;
  refreshQueue: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const isEffectiveOffline = isOfflineSimulated || !isBrowserOnline;

  const refreshQueue = async () => {
    try {
      const items = await db.syncQueue.where('status').equals('PENDING').toArray();
      setSyncQueue(items);
      const latestHistory = await db.syncHistory.orderBy('syncedAt').reverse().first();
      if (latestHistory) {
        setLastSyncTime(latestHistory.syncedAt);
      }
    } catch (err) {
      console.error('Error loading sync queue:', err);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    refreshQueue();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineSimulation = () => {
    setIsOfflineSimulated(prev => !prev);
  };

  const addToSyncQueue = async (
    action: SyncQueueItem['action'], 
    entity: SyncQueueItem['entity'], 
    payload: any
  ) => {
    const item: SyncQueueItem = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      action,
      entity,
      payload,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };

    await db.syncQueue.add(item);
    await refreshQueue();
  };

  const triggerSync = async (): Promise<number> => {
    if (isEffectiveOffline) {
      throw new Error('Tidak dapat melakukan sinkronisasi saat dalam mode offline!');
    }

    setIsSyncing(true);
    try {
      // Simulate network latency / USB data exchange
      await new Promise(resolve => setTimeout(resolve, 1500));

      const pendingItems = await db.syncQueue.where('status').equals('PENDING').toArray();
      const count = pendingItems.length;

      // Update pending items to SYNCED
      for (const item of pendingItems) {
        await db.syncQueue.update(item.id, { status: 'SYNCED' });
        
        // If entity was submission, mark submission as synced
        if (item.entity === 'submission' && item.payload?.id) {
          await db.submissions.update(item.payload.id, { isSynced: true });
        }
      }

      // Record in history
      const historyItem: SyncHistoryItem = {
        id: 'hist-' + Date.now(),
        syncedAt: new Date().toISOString(),
        itemsSynced: count > 0 ? count : 1,
        status: 'SUKSES',
        connectionType: 'Sinkronisasi Otomatis Hub Mukomuko'
      };
      await db.syncHistory.add(historyItem);

      setLastSyncTime(historyItem.syncedAt);
      await refreshQueue();
      return count;
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOfflineSimulated,
        toggleOfflineSimulation,
        isEffectiveOffline,
        syncQueue,
        syncQueueCount: syncQueue.length,
        triggerSync,
        isSyncing,
        lastSyncTime,
        addToSyncQueue,
        refreshQueue
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

