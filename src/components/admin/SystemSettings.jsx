// src/components/admin/SystemSettings.jsx
import React, { useEffect, useState } from 'react';
import { getSystemSettings, upsertSystemSetting, deleteSystemSetting } from '../../api/adminApi';

const TYPE_OPTIONS = ['string', 'boolean', 'number', 'json'];

const inputStyle = {
  padding: '7px 11px', borderRadius: 7,
  border: '1px solid #e5e7eb', fontSize: 13,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

// Single row in the settings table — inline edit
const SettingRow = ({ settingKey, meta, onSaved, onDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue]     = useState(
    meta.type === 'json'
      ? JSON.stringify(meta.value, null, 2)
      : String(meta.value ?? '')
  );
  const [type, setType]       = useState(meta.type || 'string');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      let finalValue = value;
      if (type === 'json') {
        try { JSON.parse(value); } catch { setError('Invalid JSON'); setLoading(false); return; }
        finalValue = value;
      }
      await upsertSystemSetting(settingKey, finalValue, type);
      setEditing(false);
      onSaved && onSaved();
    } catch (e) {
      setError(e.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete setting "${settingKey}"?`)) return;
    setLoading(true);
    try {
      await deleteSystemSetting(settingKey);
      onDeleted && onDeleted();
    } catch (e) {
      setError(e.response?.data?.error || 'Delete failed');
      setLoading(false);
    }
  };

  const displayValue = () => {
    if (meta.type === 'json') return (
      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6366f1' }}>
        {JSON.stringify(meta.value).slice(0, 60)}{JSON.stringify(meta.value).length > 60 ? '…' : ''}
      </span>
    );
    if (meta.type === 'boolean') return (
      <span style={{
        background: meta.value ? '#dcfce7' : '#fee2e2',
        color:      meta.value ? '#166534' : '#dc2626',
        padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      }}>
        {String(meta.value)}
      </span>
    );
    return <span style={{ color: '#374151' }}>{String(meta.value)}</span>;
  };

  return (
    <tr
      style={{ borderBottom: '1px solid #f3f4f6' }}
      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
      onMouseLeave={e => e.currentTarget.style.background = ''}
    >
      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 13, color: '#111', fontWeight: 600 }}>
        {settingKey}
      </td>
      <td style={{ padding: '12px 14px' }}>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {type === 'json' || String(meta.value).length > 60 ? (
              <textarea
                value={value}
                onChange={e => setValue(e.target.value)}
                rows={3}
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
              />
            ) : (
              <input
                value={value}
                onChange={e => setValue(e.target.value)}
                style={inputStyle}
              />
            )}
            {error && <span style={{ fontSize: 11, color: '#ef4444' }}>{error}</span>}
          </div>
        ) : displayValue()}
      </td>
      <td style={{ padding: '12px 14px' }}>
        {editing ? (
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            style={{ ...inputStyle, width: 90 }}
          >
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        ) : (
          <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{meta.type}</span>
        )}
      </td>
      <td style={{ padding: '12px 14px', fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>
        {new Date(meta.updated_at).toLocaleDateString('en-IN')}
      </td>
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#6366f1', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                {loading ? '…' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(false); setError(''); }}
                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 12, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#374151' }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// Add new setting form
const AddSettingForm = ({ onAdded }) => {
  const [open, setOpen]       = useState(false);
  const [key, setKey]         = useState('');
  const [value, setValue]     = useState('');
  const [type, setType]       = useState('string');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleAdd = async () => {
    if (!key.trim()) { setError('Key is required'); return; }
    if (value === '')  { setError('Value is required'); return; }

    if (type === 'json') {
      try { JSON.parse(value); } catch { setError('Invalid JSON'); return; }
    }

    setLoading(true);
    setError('');
    try {
      await upsertSystemSetting(key.trim(), value, type);
      setKey(''); setValue(''); setType('string');
      setOpen(false);
      onAdded && onAdded();
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      style={{
        padding: '8px 18px', borderRadius: 8, border: '1.5px dashed #d1d5db',
        background: 'transparent', color: '#6366f1', fontSize: 13, fontWeight: 600,
        cursor: 'pointer', marginBottom: 16,
      }}
    >
      + Add Setting
    </button>
  );

  return (
    <div style={{
      background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: 16, marginBottom: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 12 }}>New Setting</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Key *</label>
          <input
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            placeholder="e.g. maintenance_mode"
            style={{ ...inputStyle, fontFamily: 'monospace' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Value *</label>
          <input
            value={value}
            onChange={e => { setValue(e.target.value); setError(''); }}
            placeholder="Value"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>Type</label>
          <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      {error && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{ padding: '7px 18px', borderRadius: 7, border: 'none', background: '#6366f1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Adding…' : 'Add'}
        </button>
        <button
          onClick={() => { setOpen(false); setError(''); }}
          style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', fontSize: 13, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function SystemSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  const fetchSettings = () => {
    setLoading(true);
    getSystemSettings()
      .then(r => setSettings(r.data.data || {}))
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSettings(); }, []);

  const filtered = Object.entries(settings).filter(([k]) =>
    k.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
          System Settings
          {!loading && (
            <span style={{ marginLeft: 8, fontSize: 13, color: '#6b7280', fontWeight: 400 }}>
              ({Object.keys(settings).length} keys)
            </span>
          )}
        </h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search key..."
          style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none', width: 200 }}
        />
      </div>

      <AddSettingForm onAdded={fetchSettings} />

      {error && (
        <div style={{ color: '#ef4444', background: '#fef2f2', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ borderRadius: 10, border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Key', 'Value', 'Type', 'Updated', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} style={{ padding: '12px 14px' }}>
                      <div style={{ height: 13, background: '#f3f4f6', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
                  {search ? `No settings matching "${search}"` : 'No settings yet'}
                </td>
              </tr>
            ) : filtered.map(([k, meta]) => (
              <SettingRow
                key={k}
                settingKey={k}
                meta={meta}
                onSaved={fetchSettings}
                onDeleted={fetchSettings}
              />
            ))}
          </tbody>
        </table>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}
