import React from 'react';
import Loading from './Loading';

const Table = ({
  columns,       // [{ key, label, render, width, align }]
  data,
  loading = false,
  emptyIcon = '📋',
  emptyTitle = 'No records found',
  emptySubtitle = '',
  rowKey = 'id',
  onRowClick,
  striped = false,
  stickyHeader = false,
  maxHeight,
}) => {
  if (loading) {
    return <Loading text="Loading data..." />;
  }

  return (
    <div style={{
      overflowX: 'auto',
      overflowY: maxHeight ? 'auto' : undefined,
      maxHeight,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* Head */}
        <thead style={{ position: stickyHeader ? 'sticky' : undefined, top: 0, zIndex: 1 }}>
          <tr style={{ background: '#f8fafc' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '12px 16px',
                  textAlign: col.align || 'left',
                  fontSize: 12, fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '2px solid #e2e8f0',
                  whiteSpace: 'nowrap',
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div style={{
                  padding: '60px 20px', textAlign: 'center', color: '#94a3b8',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>
                    {emptyIcon}
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 6px', color: '#64748b' }}>
                    {emptyTitle}
                  </p>
                  {emptySubtitle && (
                    <p style={{ fontSize: 14, margin: 0 }}>{emptySubtitle}</p>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row[rowKey] || idx}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  background: striped && idx % 2 === 1 ? '#f8fafc' : 'white',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f9ff'; }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    striped && idx % 2 === 1 ? '#f8fafc' : 'white';
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '13px 16px',
                      fontSize: 14,
                      color: '#374151',
                      textAlign: col.align || 'left',
                      verticalAlign: 'middle',
                    }}
                  >
                    {col.render
                      ? col.render(row[col.key], row, idx)
                      : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
