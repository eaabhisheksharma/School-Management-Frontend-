import React, { useState, useEffect } from 'react';
import { getFeeReport, exportFeeReport } from '../../api/feeApi';
import { getClasses } from '../../api/classApi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';

const FeeReport = ({ userRole }) => {
  const [reportData, setReportData]   = useState(null);
  const [classes, setClasses]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [exporting, setExporting]     = useState(false);
  const [activeTab, setActiveTab]     = useState('summary');

  const [filters, setFilters] = useState({
    classId    : '',
    fromDate   : new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    toDate     : new Date().toISOString().split('T')[0],
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
  });

  /* ─── init ───────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try { const r = await getClasses(); setClasses(r.data || []); } catch { /* silent */ }
    })();
    fetchReport();
  }, []);

  /* ─── fetch report ───────────────────────────────────── */
  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getFeeReport(filters);
      setReportData(res.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'csv') => {
    setExporting(true);
    try {
      const blob = await exportFeeReport({ ...filters, format });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `fee-report-${filters.fromDate}-${filters.toDate}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess(`Report exported as ${format.toUpperCase()}`);
    } catch (err) {
      setError('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  /* ─── helpers ────────────────────────────────────────── */
  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(n || 0);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : '—';

  const collectRate = reportData
    ? ((reportData.totalCollected / reportData.totalBilled) * 100).toFixed(1)
    : 0;

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>📊 Fee Reports</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Comprehensive fee collection and defaulter analysis
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="outline"
            loading={exporting}
            onClick={() => handleExport('csv')}
            icon="📄"
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            loading={exporting}
            onClick={() => handleExport('pdf')}
            icon="📕"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible autoClose={5000} onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible autoClose={4000} onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* Filters */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 20, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[
            {
              label: 'FROM DATE', type: 'date', key: 'fromDate',
            },
            {
              label: 'TO DATE', type: 'date', key: 'toDate',
            },
          ].map(({ label, type, key }) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {label}
              </label>
              <input
                type={type}
                value={filters[key]}
                onChange={(e) => setFilters((p) => ({ ...p, [key]: e.target.value }))}
                style={{
                  padding: '9px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 8, fontSize: 14, minWidth: 160,
                }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              CLASS
            </label>
            <select
              value={filters.classId}
              onChange={(e) => setFilters((p) => ({ ...p, classId: e.target.value }))}
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 160,
              }}
            >
              <option value="">All Classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              ACADEMIC YEAR
            </label>
            <input
              type="text"
              value={filters.academicYear}
              onChange={(e) => setFilters((p) => ({ ...p, academicYear: e.target.value }))}
              placeholder="e.g. 2025-2026"
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 140,
              }}
            />
          </div>

          <Button onClick={fetchReport} loading={loading} style={{ marginTop: 22 }}>
            🔍 Generate Report
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <Loading text="Generating report..." type="dots" />
        </div>
      ) : !reportData ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 60, textAlign: 'center', color: '#94a3b8',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontWeight: 600, fontSize: 16 }}>Select filters and click Generate Report</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
            gap: 16, marginBottom: 24,
          }}>
            {[
              { label: 'Total Billed',    value: formatCurrency(reportData.totalBilled),     icon: '🧾', color: '#2563eb', bg: '#eff6ff' },
              { label: 'Total Collected', value: formatCurrency(reportData.totalCollected),  icon: '💰', color: '#16a34a', bg: '#dcfce7' },
              { label: 'Total Pending',   value: formatCurrency(reportData.totalPending),    icon: '⏳', color: '#d97706', bg: '#fef9c3' },
              { label: 'Total Overdue',   value: formatCurrency(reportData.totalOverdue),    icon: '🚨', color: '#dc2626', bg: '#fee2e2' },
              { label: 'Collection Rate', value: `${collectRate}%`,                          icon: '📊', color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'Defaulters',      value: reportData.defaultersCount ?? 0,            icon: '⚠️', color: '#ea580c', bg: '#fff7ed' },
            ].map(({ label, value, icon, color, bg }) => (
              <div key={label} style={{
                background: 'white', borderRadius: 10,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 10, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Collection Progress Bar */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: 24, marginBottom: 24,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 12,
            }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                📈 Collection Progress
              </h3>
              <span style={{
                fontSize: 22, fontWeight: 800,
                color: Number(collectRate) >= 80 ? '#16a34a' : Number(collectRate) >= 50 ? '#d97706' : '#dc2626',
              }}>
                {collectRate}%
              </span>
            </div>
            <div style={{
              background: '#f1f5f9', borderRadius: 99,
              height: 16, overflow: 'hidden', marginBottom: 12,
            }}>
              <div style={{
                width: `${collectRate}%`, height: '100%',
                background: Number(collectRate) >= 80
                  ? '#16a34a'
                  : Number(collectRate) >= 50 ? '#d97706' : '#dc2626',
                borderRadius: 99,
                transition: 'width 1s ease',
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, color: '#64748b',
            }}>
              <span>Collected: <strong style={{ color: '#16a34a' }}>{formatCurrency(reportData.totalCollected)}</strong></span>
              <span>Pending: <strong style={{ color: '#d97706' }}>{formatCurrency(reportData.totalPending)}</strong></span>
              <span>Total: <strong>{formatCurrency(reportData.totalBilled)}</strong></span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: 20,
            borderBottom: '2px solid #f1f5f9',
          }}>
            {[
              { key: 'summary',    label: '📋 Class-wise Summary' },
              { key: 'defaulters', label: `⚠️ Defaulters (${reportData.defaultersCount || 0})` },
              { key: 'monthly',    label: '📅 Monthly Trend'      },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{
                  padding: '10px 22px', border: 'none', cursor: 'pointer',
                  background: 'none', fontWeight: activeTab === key ? 700 : 500,
                  color: activeTab === key ? '#2563eb' : '#64748b',
                  borderBottom: activeTab === key
                    ? '2px solid #2563eb' : '2px solid transparent',
                  fontSize: 14, marginBottom: -2,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ══════ CLASS-WISE SUMMARY TAB ══════ */}
          {activeTab === 'summary' && (
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Class', 'Total Students', 'Invoices', 'Billed', 'Collected', 'Pending', 'Overdue', 'Collection %'].map((h) => (
                        <th key={h} style={{
                          padding: '12px 16px', textAlign: h === 'Class' ? 'left' : 'right',
                          fontSize: 12, fontWeight: 700, color: '#64748b',
                          textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0',
                          whiteSpace: 'nowrap',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(reportData.classSummary || []).map((cls, i) => {
                      const rate = cls.billed > 0
                        ? ((cls.collected / cls.billed) * 100).toFixed(1) : 0;
                      return (
                        <tr
                          key={cls.classId || i}
                          style={{ borderBottom: '1px solid #f1f5f9' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 14 }}>
                            {cls.className || '—'}
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 14 }}>
                            {cls.studentCount ?? '—'}
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', fontSize: 14 }}>
                            {cls.invoiceCount ?? '—'}
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right', fontWeight: 600, fontSize: 14 }}>
                            {formatCurrency(cls.billed)}
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                            <span style={{ fontWeight: 700, color: '#16a34a', fontSize: 14 }}>
                              {formatCurrency(cls.collected)}
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                            <span style={{ fontWeight: 600, color: '#d97706', fontSize: 14 }}>
                              {formatCurrency(cls.pending)}
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                            <span style={{ fontWeight: 600, color: cls.overdue > 0 ? '#dc2626' : '#94a3b8', fontSize: 14 }}>
                              {formatCurrency(cls.overdue)}
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                              <div style={{
                                width: 60, height: 6, background: '#f1f5f9',
                                borderRadius: 99, overflow: 'hidden',
                              }}>
                                <div style={{
                                  width: `${rate}%`, height: '100%',
                                  background: rate >= 80 ? '#16a34a' : rate >= 50 ? '#d97706' : '#dc2626',
                                  borderRadius: 99,
                                }} />
                              </div>
                              <span style={{
                                fontSize: 13, fontWeight: 700,
                                color: rate >= 80 ? '#16a34a' : rate >= 50 ? '#d97706' : '#dc2626',
                              }}>
                                {rate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Totals row */}
                  <tfoot>
                    <tr style={{ background: '#f0f9ff', borderTop: '2px solid #bae6fd' }}>
                      <td colSpan={3} style={{ padding: '14px 16px', fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
                        TOTAL
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, fontSize: 14 }}>
                        {formatCurrency(reportData.totalBilled)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#16a34a', fontSize: 14 }}>
                        {formatCurrency(reportData.totalCollected)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#d97706', fontSize: 14 }}>
                        {formatCurrency(reportData.totalPending)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, color: '#dc2626', fontSize: 14 }}>
                        {formatCurrency(reportData.totalOverdue)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, fontSize: 14 }}>
                        <span style={{ color: Number(collectRate) >= 80 ? '#16a34a' : '#d97706' }}>
                          {collectRate}%
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ══════ DEFAULTERS TAB ══════ */}
          {activeTab === 'defaulters' && (
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
              {(reportData.defaulters || []).length === 0 ? (
                <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                  <p style={{ fontWeight: 600, fontSize: 16 }}>No defaulters found!</p>
                  <p style={{ fontSize: 14 }}>All payments are up to date.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#fff5f5' }}>
                        {['Student', 'Class', 'Roll No', 'Outstanding Amount', 'Oldest Due Date', 'Pending Invoices', 'Action'].map((h) => (
                          <th key={h} style={{
                            padding: '12px 16px', textAlign: 'left',
                            fontSize: 12, fontWeight: 700, color: '#991b1b',
                            textTransform: 'uppercase', borderBottom: '2px solid #fecaca',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(reportData.defaulters || []).map((d, i) => (
                        <tr
                          key={d.studentId || i}
                          style={{ borderBottom: '1px solid #fff5f5', background: 'white' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{d.studentName}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{d.email || d.parentPhone || ''}</div>
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                            {d.className || '—'}
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b' }}>
                            {d.rollNo || '—'}
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <span style={{ fontWeight: 800, fontSize: 15, color: '#dc2626' }}>
                              {formatCurrency(d.outstandingAmount)}
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14, color: '#dc2626', fontWeight: 600 }}>
                            {fmtDate(d.oldestDueDate)}
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <span style={{
                              background: '#fee2e2', color: '#991b1b',
                              padding: '3px 10px', borderRadius: 12,
                              fontSize: 12, fontWeight: 700,
                            }}>
                              {d.pendingInvoices} invoices
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px' }}>
                            <button
                              style={{
                                background: '#fef9c3', color: '#854d0e',
                                border: 'none', padding: '6px 12px',
                                borderRadius: 6, cursor: 'pointer',
                                fontSize: 12, fontWeight: 700,
                              }}
                            >
                              🔔 Remind
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══════ MONTHLY TREND TAB ══════ */}
          {activeTab === 'monthly' && (
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
            }}>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700 }}>
                📅 Monthly Fee Collection Trend
              </h3>

              {(reportData.monthlyTrend || []).length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                  <p>No trend data available for the selected period</p>
                </div>
              ) : (
                <>
                  {/* Bar Chart */}
                  <div style={{
                    display: 'flex', gap: 8, alignItems: 'flex-end',
                    height: 220, marginBottom: 16, overflowX: 'auto',
                    paddingBottom: 8,
                  }}>
                    {(reportData.monthlyTrend || []).map((m, i) => {
                      const maxVal = Math.max(
                        ...(reportData.monthlyTrend || []).map((x) => x.billed || 0)
                      );
                      const billedH    = maxVal > 0 ? ((m.billed    || 0) / maxVal) * 180 : 0;
                      const collectedH = maxVal > 0 ? ((m.collected || 0) / maxVal) * 180 : 0;
                      const rate = m.billed > 0
                        ? ((m.collected / m.billed) * 100).toFixed(0) : 0;
                      return (
                        <div key={i} style={{
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 4, minWidth: 60,
                        }}>
                          {/* Rate label */}
                          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
                            {rate}%
                          </div>
                          {/* Bars side-by-side */}
                          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 180 }}>
                            <div
                              title={`Billed: ${formatCurrency(m.billed)}`}
                              style={{
                                width: 20, height: billedH,
                                background: '#bfdbfe', borderRadius: '4px 4px 0 0',
                                cursor: 'pointer', transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            />
                            <div
                              title={`Collected: ${formatCurrency(m.collected)}`}
                              style={{
                                width: 20, height: collectedH,
                                background: '#2563eb', borderRadius: '4px 4px 0 0',
                                cursor: 'pointer', transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                            />
                          </div>
                          {/* Month label */}
                          <div style={{
                            fontSize: 11, color: '#64748b', textAlign: 'center',
                            whiteSpace: 'nowrap',
                          }}>
                            {m.month
                              ? new Date(m.month + '-01').toLocaleDateString('en-IN', {
                                  month: 'short', year: '2-digit',
                                })
                              : m.label || '—'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 24 }}>
                    {[
                      { color: '#bfdbfe', label: 'Billed'    },
                      { color: '#2563eb', label: 'Collected' },
                    ].map(({ color, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
                        <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Monthly Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['Month', 'Invoices', 'Billed', 'Collected', 'Pending', 'Rate'].map((h) => (
                            <th key={h} style={{
                              padding: '11px 16px',
                              textAlign: h === 'Month' ? 'left' : 'right',
                              fontSize: 12, fontWeight: 700, color: '#64748b',
                              textTransform: 'uppercase',
                              borderBottom: '1px solid #e2e8f0',
                            }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(reportData.monthlyTrend || []).map((m, i) => {
                          const rate = m.billed > 0
                            ? ((m.collected / m.billed) * 100).toFixed(1) : 0;
                          return (
                            <tr
                              key={i}
                              style={{ borderBottom: '1px solid #f1f5f9' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                              <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>
                                {m.month
                                  ? new Date(m.month + '-01').toLocaleDateString('en-IN', {
                                      month: 'long', year: 'numeric',
                                    })
                                  : m.label || '—'}
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 14, color: '#475569' }}>
                                {m.invoiceCount ?? '—'}
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 14 }}>
                                {formatCurrency(m.billed)}
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <span style={{ fontWeight: 700, color: '#16a34a', fontSize: 14 }}>
                                  {formatCurrency(m.collected)}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <span style={{ fontWeight: 600, color: '#d97706', fontSize: 14 }}>
                                  {formatCurrency(m.pending)}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <span style={{
                                  fontWeight: 700, fontSize: 14,
                                  color: rate >= 80 ? '#16a34a' : rate >= 50 ? '#d97706' : '#dc2626',
                                }}>
                                  {rate}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeeReport;
