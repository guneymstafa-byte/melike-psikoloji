'use client';

export function ConnectionNotice({ offline, error, onRetry }: { offline: boolean; error: string; onRetry: () => void }) {
  if (!offline && !error) return null;
  return (
    <div role="status" aria-live="polite" className="m-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
      <p>{offline ? 'İnternet bağlantısı kesildi. Bu ekrandaki yazdıklarınız korunuyor; bağlantı geldiğinde veriler yenilenecek.' : error}</p>
      {!offline && <button type="button" onClick={onRetry} className="mt-2 font-semibold underline">Tekrar dene</button>}
    </div>
  );
}
