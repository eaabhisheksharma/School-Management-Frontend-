import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * usePagination — full-featured pagination state manager
 *
 * Handles both:
 *  • server-side pagination  (pass totalItems from API)
 *  • client-side pagination  (pass allItems array)
 *
 * Usage — server-side:
 *   const pg = usePagination({ totalItems: 200, pageSize: 15 });
 *   // use pg.page, pg.pageSize in your API call
 *   // call pg.setTotal(res.total) after fetch
 *
 * Usage — client-side:
 *   const pg = usePagination({ allItems: students, pageSize: 12 });
 *   // use pg.currentItems in your render
 */
const usePagination = (options = {}) => {
  const {
    totalItems    : initialTotal = 0,
    pageSize      : initialSize  = 15,
    initialPage   = 1,
    allItems      = null,      // pass array for client-side pagination
    siblingCount  = 1,         // pages shown either side of current
    boundaryCount = 1,         // pages shown at start/end
    onChange      = null,      // callback(page, pageSize) on change
    persistKey    = '',        // localStorage key to persist page/size
    pageSizeOptions = [10, 15, 25, 50, 100],
  } = options;

  /* ─── restore from storage ───────────────────────────── */
  const getInitial = (key, fallback) => {
    if (!persistKey) return fallback;
    try {
      const stored = localStorage.getItem(`pg_${persistKey}_${key}`);
      return stored ? Number(stored) : fallback;
    } catch { return fallback; }
  };

  const [page,     setPageState]  = useState(() => getInitial('page', initialPage));
  const [pageSize, setPageSize]   = useState(() => getInitial('size', initialSize));
  const [total,    setTotal]      = useState(
    allItems ? allItems.length : initialTotal
  );

  /* ─── sync total with allItems ───────────────────────── */
  useEffect(() => {
    if (allItems !== null) setTotal(allItems.length);
  }, [allItems?.length]);

  /* ─── derived ─────────────────────────────────────────── */
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const startIndex = useMemo(
    () => (page - 1) * pageSize,
    [page, pageSize]
  );

  const endIndex = useMemo(
    () => Math.min(startIndex + pageSize, total),
    [startIndex, pageSize, total]
  );

  const startItem = total === 0 ? 0 : startIndex + 1;
  const endItem   = endIndex;

  /* ─── client-side slice ───────────────────────────────── */
  const currentItems = useMemo(() => {
    if (!allItems) return null;
    return allItems.slice(startIndex, endIndex);
  }, [allItems, startIndex, endIndex]);

  /* ─── persist ─────────────────────────────────────────── */
  const persist = useCallback((key, val) => {
    if (!persistKey) return;
    try { localStorage.setItem(`pg_${persistKey}_${key}`, String(val)); }
    catch { /* storage full */ }
  }, [persistKey]);

  /* ─── set page (clamped) ─────────────────────────────── */
  const setPage = useCallback((p) => {
    const clamped = Math.max(1, Math.min(p, totalPages));
    setPageState(clamped);
    persist('page', clamped);
    onChange?.(clamped, pageSize);
  }, [totalPages, pageSize, onChange, persist]);

  /* ─── set page size ───────────────────────────────────── */
  const changePageSize = useCallback((size) => {
    const newSize    = Number(size);
    const newTotal   = Math.max(1, Math.ceil(total / newSize));
    const newPage    = Math.min(page, newTotal);
    setPageSize(newSize);
    setPageState(newPage);
    persist('size', newSize);
    persist('page', newPage);
    onChange?.(newPage, newSize);
  }, [total, page, onChange, persist]);

  /* ─── navigation helpers ─────────────────────────────── */
  const firstPage  = useCallback(() => setPage(1),             [setPage]);
  const lastPage   = useCallback(() => setPage(totalPages),    [setPage, totalPages]);
  const nextPage   = useCallback(() => setPage(page + 1),      [setPage, page]);
  const prevPage   = useCallback(() => setPage(page - 1),      [setPage, page]);

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const isFirstPage = page === 1;
  const isLastPage  = page === totalPages;

  /* ─── reset to first page ─────────────────────────────── */
  const reset = useCallback(() => {
    setPageState(initialPage);
    persist('page', initialPage);
  }, [initialPage, persist]);

  /* ─── page number range builder ───────────────────────── */
  const pageRange = useMemo(() => {
    if (totalPages <= 0) return [];

    const range = (start, end) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    if (totalPages <= 2 * boundaryCount + 2 * siblingCount + 3) {
      return range(1, totalPages);
    }

    const leftSibling  = Math.max(page - siblingCount, boundaryCount + 1);
    const rightSibling = Math.min(page + siblingCount, totalPages - boundaryCount);

    const showLeftDots  = leftSibling  > boundaryCount + 2;
    const showRightDots = rightSibling < totalPages - boundaryCount - 1;

    const leftPages  = range(1, boundaryCount);
    const rightPages = range(totalPages - boundaryCount + 1, totalPages);
    const midPages   = range(leftSibling, rightSibling);

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 2 + 2 * siblingCount + boundaryCount);
      return [...leftRange, 'dots_right', ...rightPages];
    }
    if (showLeftDots && !showRightDots) {
      const rightRange = range(
        totalPages - boundaryCount - 1 - 2 * siblingCount, totalPages
      );
      return [...leftPages, 'dots_left', ...rightRange];
    }
    return [
      ...leftPages,
      'dots_left',
      ...midPages,
      'dots_right',
      ...rightPages,
    ];
  }, [page, totalPages, siblingCount, boundaryCount]);

  /* ─── full object ─────────────────────────────────────── */
  return {
    /* state */
    page,
    pageSize,
    total,
    totalPages,
    startIndex,
    endIndex,
    startItem,
    endItem,
    currentItems,

    /* flags */
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,
    isEmpty     : total === 0,

    /* navigation */
    setPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    reset,

    /* page-size control */
    changePageSize,
    pageSizeOptions,

    /* page number array for rendering */
    pageRange,

    /* setters for external updates */
    setTotal,

    /* summary string helper */
    summaryText : total === 0
      ? 'No results'
      : `Showing ${startItem}–${endItem} of ${total}`,
  };
};

export default usePagination;


/* ════════════════════════════════════════════════════════════
   PAGINATION UI COMPONENT  (self-contained, no extra deps)
══════════════════════════════════════════════════════════════ */

/**
 * PaginationBar — drop-in pagination component
 *
 * Usage:
 *   const pg = usePagination({ totalItems: 200 });
 *   <PaginationBar pg={pg} />
 */
export const PaginationBar = ({
  pg,
  showPageSize   = true,
  showSummary    = true,
  showFirstLast  = true,
  size           = 'md',   // 'sm' | 'md' | 'lg'
  style          = {},
}) => {
  if (!pg) return null;

  const {
    page, pageSize, totalPages, summaryText,
    pageRange, hasNextPage, hasPrevPage,
    isFirstPage, isLastPage,
    setPage, nextPage, prevPage, firstPage, lastPage,
    changePageSize, pageSizeOptions, isEmpty,
  } = pg;

  if (isEmpty && totalPages <= 1) return null;

  const sz = {
    sm : { btn: '28px', font: 12, gap: 4,  px: 8  },
    md : { btn: '34px', font: 13, gap: 6,  px: 12 },
    lg : { btn: '40px', font: 14, gap: 8,  px: 16 },
  }[size] || { btn: '34px', font: 13, gap: 6, px: 12 };

  const btnBase = {
    width: sz.btn, height: sz.btn,
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    fontSize: sz.font, fontWeight: 600,
    transition: 'all 0.15s',
    flexShrink: 0,
  };

  const activeBtn = {
    ...btnBase,
    background: '#2563eb',
    color: 'white',
    border: '1px solid #2563eb',
    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
  };

  const navBtn = (disabled) => ({
    ...btnBase,
    background: disabled ? '#f8fafc' : 'white',
    color: disabled ? '#cbd5e1' : '#475569',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  });

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 10,
      padding: `12px 0`,
      ...style,
    }}>
      {/* Summary */}
      {showSummary && (
        <div style={{ fontSize: sz.font, color: '#64748b', whiteSpace: 'nowrap' }}>
          {summaryText}
        </div>
      )}

      {/* Page buttons */}
      <div style={{ display: 'flex', gap: sz.gap, alignItems: 'center' }}>

        {/* First */}
        {showFirstLast && (
          <button
            onClick={firstPage}
            disabled={isFirstPage}
            title="First page"
            style={navBtn(isFirstPage)}
            onMouseEnter={(e) => { if (!isFirstPage) e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseLeave={(e) => { if (!isFirstPage) e.currentTarget.style.background = 'white'; }}
          >
            «
          </button>
        )}

        {/* Prev */}
        <button
          onClick={prevPage}
          disabled={!hasPrevPage}
          title="Previous page"
          style={navBtn(!hasPrevPage)}
          onMouseEnter={(e) => { if (hasPrevPage) e.currentTarget.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { if (hasPrevPage) e.currentTarget.style.background = 'white'; }}
        >
          ‹
        </button>

        {/* Page numbers */}
        {pageRange.map((item, i) => {
          if (item === 'dots_left' || item === 'dots_right') {
            return (
              <span key={item + i} style={{
                width: sz.btn, textAlign: 'center',
                color: '#94a3b8', fontSize: sz.font, userSelect: 'none',
              }}>
                …
              </span>
            );
          }
          const isActive = item === page;
          return (
            <button
              key={item}
              onClick={() => setPage(item)}
              style={isActive ? activeBtn : {
                ...btnBase, background: 'white', color: '#475569',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'white'; }}
            >
              {item}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={nextPage}
          disabled={!hasNextPage}
          title="Next page"
          style={navBtn(!hasNextPage)}
          onMouseEnter={(e) => { if (hasNextPage) e.currentTarget.style.background = '#f1f5f9'; }}
          onMouseLeave={(e) => { if (hasNextPage) e.currentTarget.style.background = 'white'; }}
        >
          ›
        </button>

        {/* Last */}
        {showFirstLast && (
          <button
            onClick={lastPage}
            disabled={isLastPage}
            title="Last page"
            style={navBtn(isLastPage)}
            onMouseEnter={(e) => { if (!isLastPage) e.currentTarget.style.background = '#f1f5f9'; }}
            onMouseLeave={(e) => { if (!isLastPage) e.currentTarget.style.background = 'white'; }}
          >
            »
          </button>
        )}
      </div>

      {/* Page size selector */}
      {showPageSize && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: sz.font, color: '#64748b', whiteSpace: 'nowrap' }}>
            Rows per page
          </span>
          <select
            value={pageSize}
            onChange={(e) => changePageSize(e.target.value)}
            style={{
              padding: `4px ${sz.px}px`,
              border: '1px solid #e2e8f0', borderRadius: 7,
              fontSize: sz.font, color: '#374151',
              background: 'white', cursor: 'pointer',
              outline: 'none',
            }}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};


/* ════════════════════════════════════════════════════════════
   ADDITIONAL MINI HOOKS
══════════════════════════════════════════════════════════════ */

/**
 * useInfiniteScroll — append-style pagination (load more)
 */
export const useInfiniteScroll = (apiFn, params = {}, options = {}) => {
  const { pageSize = 15, threshold = 200 } = options;

  const [items,      setItems]      = useState([]);
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [hasMore,    setHasMore]    = useState(true);
  const [initialLoad,setInitialLoad]= useState(true);
  const loadingRef   = useRef(false);

  const fetchPage = useCallback(async (p) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const res  = await apiFn({ ...params, page: p, limit: pageSize });
      const list = res?.data || res?.items || [];
      const tot  = res?.pagination?.total || res?.total || 0;
      setTotal(tot);
      setItems((prev) => p === 1 ? list : [...prev, ...list]);
      setHasMore(p * pageSize < tot);
      setPage(p);
      setInitialLoad(false);
    } catch (err) {
      setError(err?.message || 'Failed to load');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [apiFn, JSON.stringify(params), pageSize]);

  /* initial load */
  useEffect(() => { fetchPage(1); }, [JSON.stringify(params)]);

  /* scroll listener */
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loadingRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        fetchPage(page + 1);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, fetchPage, threshold]);

  const refresh = useCallback(() => fetchPage(1), [fetchPage]);
  const loadMore = useCallback(() => { if (hasMore && !loading) fetchPage(page + 1); }, [hasMore, loading, page, fetchPage]);

  return {
    items, loading, error, hasMore,
    total, page, initialLoad,
    refresh, loadMore,
    isEmpty: !initialLoad && items.length === 0,
  };
};


/**
 * useSearch — debounced search state with reset-to-page-1 integration
 */
export const useSearch = (initialValue = '', debounceMs = 350) => {
  const [value,        setValue]        = useState(initialValue);
  const [debouncedVal, setDebouncedVal] = useState(initialValue);
  const [isSearching,  setIsSearching]  = useState(false);
  const timerRef = useRef(null);

  const handleChange = useCallback((val) => {
    setValue(val);
    setIsSearching(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedVal(val);
      setIsSearching(false);
    }, debounceMs);
  }, [debounceMs]);

  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    setValue('');
    setDebouncedVal('');
    setIsSearching(false);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return {
    value,
    debouncedValue : debouncedVal,
    isSearching,
    onChange       : handleChange,
    clear,
    isEmpty        : !debouncedVal.trim(),
  };
};


/**
 * useFilters — multi-filter state manager
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [dirty,   setDirty]   = useState(false);

  const set = useCallback((key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setDirty(true);
  }, []);

  const setMany = useCallback((obj) => {
    setFilters((p) => ({ ...p, ...obj }));
    setDirty(true);
  }, []);

  const remove = useCallback((key) => {
    setFilters((p) => {
      const next = { ...p };
      delete next[key];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setFilters(initialFilters);
    setDirty(false);
  }, [initialFilters]);

  /* strip empty values for API call */
  const activeFilters = useMemo(() => {
    return Object.fromEntries(
      Object.entries(filters).filter(
        ([, v]) => v !== '' && v !== null && v !== undefined
      )
    );
  }, [filters]);

  const activeCount = useMemo(
    () => Object.keys(activeFilters).length,
    [activeFilters]
  );

  return {
    filters,
    activeFilters,
    activeCount,
    dirty,
    set,
    setMany,
    remove,
    reset,
    hasFilters : activeCount > 0,
  };
};
