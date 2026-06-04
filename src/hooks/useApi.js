import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * useApi — generic data-fetching hook
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(getStudents, { page: 1 });
 *   const { execute, loading } = useApi(createStudent, null, { manual: true });
 */
const useApi = (
  apiFn,
  params       = null,
  options      = {}
) => {
  const {
    manual        = false,   // if true, won't auto-fetch — call execute() instead
    initialData   = null,    // default data value before first fetch
    onSuccess     = null,    // callback(data) on success
    onError       = null,    // callback(error) on error
    transform     = null,    // transform(rawResponse) → data
    debounce      = 0,       // debounce auto-fetch by N ms
    cache         = false,   // simple in-memory cache
    cacheKey      = '',      // cache identifier
    retries       = 0,       // number of retry attempts on failure
    retryDelay    = 1000,    // ms between retries
    showError     = true,    // whether to set error state
    keepPrevData  = false,   // keep previous data while loading new
  } = options;

  const [data,       setData]       = useState(initialData);
  const [loading,    setLoading]    = useState(!manual);
  const [error,      setError]      = useState('');
  const [status,     setStatus]     = useState('idle');  // idle | loading | success | error
  const [callCount,  setCallCount]  = useState(0);

  /* internal refs */
  const abortRef      = useRef(null);
  const debounceRef   = useRef(null);
  const retryRef      = useRef(0);
  const isMountedRef  = useRef(true);
  const cacheStore    = useRef({});

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  /* ─── core fetch ─────────────────────────────────────── */
  const executeFetch = useCallback(async (callParams, signal) => {
    if (!apiFn) return;

    /* cache check */
    const key = cacheKey || JSON.stringify(callParams);
    if (cache && cacheStore.current[key]) {
      const cached = cacheStore.current[key];
      if (!keepPrevData || !data) setData(cached);
      setStatus('success');
      setLoading(false);
      onSuccess?.(cached);
      return cached;
    }

    if (!keepPrevData) setData(initialData);
    setLoading(true);
    setStatus('loading');
    setError('');

    let attempt = 0;

    const tryFetch = async () => {
      try {
        const res = await (
          callParams !== null
            ? apiFn(callParams, { signal })
            : apiFn({ signal })
        );

        if (!isMountedRef.current) return;

        const processed = transform ? transform(res) : res;

        /* write cache */
        if (cache) cacheStore.current[key] = processed;

        setData(processed);
        setStatus('success');
        setError('');
        retryRef.current = 0;
        onSuccess?.(processed);
        return processed;
      } catch (err) {
        if (err?.name === 'AbortError' || err?.name === 'CanceledError') return;
        if (!isMountedRef.current) return;

        if (attempt < retries) {
          attempt++;
          retryRef.current = attempt;
          await new Promise((r) => setTimeout(r, retryDelay * attempt));
          return tryFetch();
        }

        const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
        if (showError) setError(msg);
        setStatus('error');
        onError?.(err, msg);
        throw err;
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    return tryFetch();
  }, [apiFn, cache, cacheKey, transform, onSuccess, onError, retries, retryDelay, showError, keepPrevData, initialData]);

  /* ─── auto-fetch on param change ─────────────────────── */
  useEffect(() => {
    if (manual) return;

    /* cancel previous */
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    clearTimeout(debounceRef.current);

    const run = () => {
      executeFetch(params, abortRef.current.signal).catch(() => {});
    };

    if (debounce > 0) {
      debounceRef.current = setTimeout(run, debounce);
    } else {
      run();
    }

    return () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [manual, JSON.stringify(params), debounce]);

  /* ─── manual execute ──────────────────────────────────── */
  const execute = useCallback(async (overrideParams) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setCallCount((c) => c + 1);
    return executeFetch(
      overrideParams !== undefined ? overrideParams : params,
      abortRef.current.signal
    );
  }, [executeFetch, params]);

  /* ─── refetch (same params) ───────────────────────────── */
  const refetch = useCallback(() => execute(params), [execute, params]);

  /* ─── reset ───────────────────────────────────────────── */
  const reset = useCallback(() => {
    setData(initialData);
    setError('');
    setStatus('idle');
    setLoading(false);
  }, [initialData]);

  /* ─── clear cache ─────────────────────────────────────── */
  const clearCache = useCallback((key) => {
    if (key) delete cacheStore.current[key];
    else     cacheStore.current = {};
  }, []);

  /* ─── mutation helpers (POST/PUT/DELETE) ──────────────── */
  const mutate = useCallback(async (payload, mutFn) => {
    setLoading(true);
    setError('');
    setStatus('loading');
    try {
      const fn  = mutFn || apiFn;
      const res = await fn(payload);
      if (!isMountedRef.current) return;
      const processed = transform ? transform(res) : res;
      setData(processed);
      setStatus('success');
      onSuccess?.(processed);
      return { success: true, data: processed };
    } catch (err) {
      if (!isMountedRef.current) return;
      const msg = err?.response?.data?.message || err?.message || 'Request failed';
      if (showError) setError(msg);
      setStatus('error');
      onError?.(err, msg);
      return { success: false, error: msg };
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [apiFn, transform, onSuccess, onError, showError]);

  return {
    /* state */
    data,
    loading,
    error,
    status,
    callCount,

    /* derived booleans */
    isIdle    : status === 'idle',
    isLoading : status === 'loading',
    isSuccess : status === 'success',
    isError   : status === 'error',
    isEmpty   : !loading && !error && (
      data === null ||
      data === undefined ||
      (Array.isArray(data) ? data.length === 0 : false)
    ),
    hasData   : data !== null && data !== undefined,

    /* actions */
    execute,
    refetch,
    reset,
    mutate,
    setData,
    clearCache,
  };
};

export default useApi;


/* ════════════════════════════════════════════════════════════
   SPECIALISED VARIANTS
══════════════════════════════════════════════════════════════ */

/**
 * useApiList — for paginated list endpoints
 * Automatically merges pagination meta from response.
 */
export const useApiList = (apiFn, params = {}, options = {}) => {
  const {
    page          = 1,
    limit         = 15,
    onSuccess     = null,
    ...restOpts
  } = options;

  const [pagination, setPagination] = useState({
    page, limit, total: 0, pages: 1,
  });
  const [items, setItems] = useState([]);

  const transform = useCallback((res) => {
    const list = res?.data || res?.items || res?.results || [];
    if (res?.pagination) {
      setPagination((p) => ({ ...p, ...res.pagination }));
    } else if (res?.total !== undefined) {
      setPagination((p) => ({
        ...p,
        total : res.total,
        pages : Math.ceil(res.total / (params.limit || limit)),
      }));
    }
    setItems(list);
    return list;
  }, [limit, params.limit]);

  const api = useApi(apiFn, { ...params, page: pagination.page, limit }, {
    transform,
    onSuccess,
    ...restOpts,
  });

  const goToPage = useCallback((p) => {
    setPagination((prev) => ({ ...prev, page: p }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination((p) =>
      p.page < p.pages ? { ...p, page: p.page + 1 } : p
    );
  }, []);

  const prevPage = useCallback(() => {
    setPagination((p) =>
      p.page > 1 ? { ...p, page: p.page - 1 } : p
    );
  }, []);

  return {
    ...api,
    items,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage : pagination.page < pagination.pages,
    hasPrevPage : pagination.page > 1,
  };
};


/**
 * useApiMutation — fire-and-forget mutations (create/update/delete)
 * No auto-fetch. Returns { execute, loading, error, data, success }.
 */
export const useApiMutation = (apiFn, options = {}) => {
  const {
    onSuccess  = null,
    onError    = null,
    showError  = true,
    transform  = null,
    resetDelay = 0,   // auto-reset success flag after N ms
  } = options;

  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [data,       setData]       = useState(null);
  const [success,    setSuccess]    = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const execute = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await apiFn(payload);
      if (!isMountedRef.current) return;
      const processed = transform ? transform(res) : res;
      setData(processed);
      setSuccess(true);
      onSuccess?.(processed);
      if (resetDelay > 0) {
        setTimeout(() => {
          if (isMountedRef.current) setSuccess(false);
        }, resetDelay);
      }
      return { success: true, data: processed };
    } catch (err) {
      if (!isMountedRef.current) return;
      const msg = err?.response?.data?.message || err?.message || 'Operation failed';
      if (showError) setError(msg);
      onError?.(err, msg);
      return { success: false, error: msg };
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [apiFn, transform, onSuccess, onError, showError, resetDelay]);

  const reset = useCallback(() => {
    setData(null);
    setError('');
    setSuccess(false);
  }, []);

  return { execute, loading, error, data, success, reset };
};


/**
 * useApiPolling — auto-refreshes every N ms
 */
export const useApiPolling = (apiFn, params = null, intervalMs = 10000, options = {}) => {
  const { enabled = true, ...restOpts } = options;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);

  return useApi(apiFn, params ? { ...params, _tick: tick } : tick, {
    keepPrevData: true,
    ...restOpts,
  });
};
