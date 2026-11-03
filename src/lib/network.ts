const READ_RETRY_STATUSES = new Set([502, 503, 504]);

/** Bound requests; only idempotent reads may be retried, never form submissions. */
export function createResilientFetch(
  fetcher: typeof fetch = (...args) => fetch(...args),
  timeoutMs = 15_000,
  retryDelayMs = 400,
): typeof fetch {
  return async (input, init) => {
    const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const originalSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const attempts = method === 'GET' || method === 'HEAD' ? 2 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      if (originalSignal?.aborted) throw originalSignal.reason;
      const controller = new AbortController();
      const abort = () => controller.abort(originalSignal?.reason);
      originalSignal?.addEventListener('abort', abort, { once: true });
      const timer = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), timeoutMs);
      let retry = false;
      try {
        const response = await fetcher(input, { ...init, signal: controller.signal });
        if (attempt + 1 < attempts && READ_RETRY_STATUSES.has(response.status)) {
          await response.body?.cancel();
          retry = true;
        } else {
          return response;
        }
      } catch (error) {
        if (originalSignal?.aborted || attempt + 1 >= attempts) throw error;
        retry = true;
      } finally {
        clearTimeout(timer);
        originalSignal?.removeEventListener('abort', abort);
      }
      if (retry) await new Promise(resolve => setTimeout(resolve, retryDelayMs));
    }
    throw new Error('Request failed');
  };
}

export const resilientFetch = createResilientFetch();

export function connectionMessage(error: unknown): string {
  const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : '';
  if (/invalid login credentials/i.test(message)) return 'E-posta adresi veya şifre hatalı.';
  if (/email not confirmed/i.test(message)) return 'Giriş yapmadan önce e-posta adresinizi doğrulayın.';
  if (/jwt expired|refresh.token|session.*missing/i.test(message)) return 'Oturumunuz sona erdi. Lütfen yeniden giriş yapın.';
  if (/failed to fetch|network|timeout|timed out|abort|load failed|fetch failed/i.test(message)) {
    return 'Bağlantı kurulamadı. Bilgileriniz bu ekranda korunuyor. İnternet bağlantınızı kontrol edip tekrar deneyin.';
  }
  return 'İşlem tamamlanamadı. Lütfen tekrar deneyin; sorun sürerse telefonla bize ulaşın.';
}

/** Also bounds work waiting on an auth lock before a request can start. */
export async function withDeadline<T>(operation: PromiseLike<T>, timeoutMs = 35_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(operation),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Request timed out')), timeoutMs); }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
