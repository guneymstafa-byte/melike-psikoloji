'use client';

import { useEffect, useRef, useState } from 'react';

export function useConnectionRecovery(onRecover: () => void) {
  const [offline, setOffline] = useState(false);
  const callback = useRef(onRecover);
  useEffect(() => { callback.current = onRecover; });
  useEffect(() => {
    let lastRefresh = 0;
    const refresh = () => {
      if (!navigator.onLine || document.visibilityState === 'hidden') return;
      setOffline(false);
      if (Date.now() - lastRefresh < 2_000) return;
      lastRefresh = Date.now();
      callback.current();
    };
    const disconnected = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener('online', refresh);
    window.addEventListener('offline', disconnected);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('online', refresh);
      window.removeEventListener('offline', disconnected);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  return offline;
}
