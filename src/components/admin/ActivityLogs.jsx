// src/components/admin/ActivityLogs.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { getActivityLogs } from '../../api/adminApi';

const ACTION_COLORS = {
  create: { bg: '#dcfce7', text: '#166534' },
  update: { bg: '#dbeafe', text: '#1e40af' },
  delete: { bg: '#fee2e2', text: '#991b1b' },
  login:  { bg: '#fef9c3', text: '#854d0e' },
  logout: { bg: '#f3f4f6', text: '#374151' },
};

const getActionColor = (action = '') => {
  const key = Object.keys(ACTION_COLORS).find(k => action.toLowerCase().includes(k));
  return ACTION_COLORS[key] || ACTION_COLORS.logout;
};

const ActionBadge = ({ action }) => {
  const c = getActionColor(action);
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: '2px 8px', borderRadius: 999,
      fontSize: 11, fontWeight: 600,
    }}>
      {action}
    </span>
  );
};

// Collapsible JSON details viewer
const Details = ({ details }) => {
  const [open, setOpen] = useState(false);
  if (!details) return <span style={{ color: '#d1d5db' }}>—</span>;

  let display;
  try {
    display = typeof details === 'string' ? JSON.parse(details) : details;
  } catch {
    display = details;
  }

  return (
    <div>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          background: 'none', border: 'none', color: '#6366f1',
          cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0,
        }}
      >
        {open ? '▼ Hide' : '▶ Show'}
      </button>
      {open && (
        <pre style={{
          marginTop: 6, padding: '8px 10px', background: '#f8fafc',
          borderRadius: 6, fontSize: 11, color: '#374151',
          maxWidth: 300, overflowX: 'auto', border: '1px solid #e5e7eb',
        }}>
          {JSON.stringify(display, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default function ActivityLogs({ schoolId = null, userId = null }) {
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters
  const [action, setAction]       = useState('');
  const [entityType, setEntityType] = useState('');
  const [from, setFrom]           = useState('');
  const [to, setTo]               = useState('');
  const [page, setPage]           = useState(1);

  const fetchLogs = useCallback(() => {
    setLoading(true);
    setError('');
    getActivityLogs({
      page, limit: 20,
      school_id:   schoolId   || undefined,
      user_id:     userId     || undefined,
      action:      action     || undefined,
      entity_type: entityType || undefined,
      from:        from       || undefined,
      to:          to         || undefined,
    })
      .then(r => {
        setLogs(r.data.data);
        setPagination(r.data.pagination);
      })
      .catch(() => setError('Failed to load logs'))
      .finally(() => setLoading(false));
  }, [page, action, entityType, from, to, schoolId, userId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { setPage(1); }, [action, entityType, from, to]);

  const clearFilters = () => {
    setAction('');
    setEntityType('');
    setFrom('');
    setTo('');
    setPage(1);
  };

  const hasFilters = action || entityType || from || to;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
          Activity Logs
          {!loading && (
            <span style={{ marginLeft: 8, fontSize: 13, color: '#6b7280', fontWeight: 400 }}>
              ({pagination.total})
            </span>
          )}
        </h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{ fontSize: 12, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={action}
          onChange={e => setAction(e.target.value)}
          placeholder="Filter by action..."
          style={{ flex: '1 1 160px', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }}
        />
        <input
          value={entityType}
          onChange={e => setEntityType(e.target.value)}
          placeholder="Entity type (e.g. student)"
          style={{ flex: '1 1 160px', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>From</span>
          <input
            type="date" value={from}
            onChange={e => setFrom(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>To</span>
          <input
            type="date" value={to}
            onChange={e => setTo(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
          />
        </div>
      </div>

      {error && (
        <div style={{ color: '#ef4444', background: '#fef2f2', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Time', 'User', 'Action', 'Entity', 'IP', 'Details'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} style={{ padding: '12px 14px' }}>
                      <div style={{ height: 13, background: '#f3f4f6', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
                  No activity logs found
                </td>
              </tr>
            ) : logs.map((log, i) => (
              <tr
                key={log.log_id || i}
                style={{ borderBottom: '1px solid #f3f4f6' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <td style={{ padding: '10px 14px', color: '#6b7280', whiteSpace: 'nowrap', fontSize: 12 }}>
                  {new Date(log.created_at).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {log.email ? (
                    <>
                      <div style={{ fontWeight: 600, color: '#111' }}>
                        {log.first_name} {log.last_name}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{log.email}</div>
                    </>
                  ) : (
                    <span style={{ color: '#d1d5db', fontSize: 12 }}>System</span>
                  )}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <ActionBadge action={log.action} />
                </td>
                <td style={{ padding: '10px 14px', color: '#6b7280', fontSize: 12 }}>
                  {log.entity_type && (
                    <div style={{ textTransform: 'capitalize' }}>{log.entity_type}</div>
                  )}
                  {log.entity_id && (
                    <div style={{ color: '#d1d5db', fontFamily: 'monospace', fontSize: 11 }}>
                      {log.entity_id.slice(0, 8)}…
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', fontSize: 12, fontFamily: 'monospace' }}>
                  {log.ip_address || '—'}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <Details details={log.details} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}
            style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
            Next →
          </button>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}
