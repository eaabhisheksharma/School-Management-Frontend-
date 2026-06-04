import React, { useState, useEffect, useCallback } from 'react';
import {
  getFeeInvoices,
  generateInvoices,
  sendReminder,
  downloadInvoicePdf,
} from '../../api/feeApi';
import { getClasses } from '../../api/classApi';
import Button from '../common/Button';
import Badge, { statusVariant } from '../common/Badge';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';
import PaymentForm from './PaymentForm';

const FeeInvoiceList = ({ userRole }) => {
  const [invoices, setInvoices]         = useState([]);
  const [classes, setClasses]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [filterClass, setFilterClass]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMonth, setFilterMonth]   = useState('');
  const [search, setSearch]             = useState('');
  const [pagination, setPagination]     = useState({
    page: 1, limit: 15, total: 0, pages: 1,
  });
  const [selectedInvoice, setSelectedInvoice]   = useState(null);
  const [showPaymentForm, setShowPaymentForm]   = useState(false);
  const [generating, setGenerating]             = useState(false);
  const [downloadingId, setDownloadingId]       = useState(null);
  const [sendingId, setSendingId]               = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateData, setGenerateData]         = useState({
    classId: '', month: new Date().toISOString().slice(0,7),
  });

  const isPrincipal = userRole === 'principal';

  /* ─── fetch ──────────────────────────────────────────── */
  const fetchInvoices = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await getFeeInvoices({
        page, limit: pagination.limit,
        ...(filterClass  && { classId : filterClass  }),
        ...(filterStatus && { status  : filterStatus }),
        ...(filterMonth  && { month   : filterMonth  }),
        ...(search       && { search               }),
      });
      setInvoices(res.data || []);
      if (res.pagination) setPagination((p) => ({ ...p, ...res.pagination, page }));
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [filterClass, filterStatus, filterMonth, search, pagination.limit]);

  useEffect(() => {
    fetchInvoices(1);
    (async () => {
      try { const r = await getClasses(); setClasses(r.data || []); } catch { /* silent */ }
    })();
  }, [filterClass, filterStatus, filterMonth]);

  /* ─── generate invoices ──────────────────────────────── */
  const handleGenerate = async () => {
    if (!generateData.classId || !generateData.month) {
      setError('Select class and month to generate invoices');
      return;
    }
    setGenerating(true);
    setError('');
    try {
      const res = await generateInvoices(generateData);
      setSuccess(`Generated ${res.count || 0} invoices successfully! ✅`);
      setShowGenerateModal(false);
      fetchInvoices(1);
    } catch (err) {
      setError(err.message || 'Failed to generate invoices');
    } finally {
      setGenerating(false);
    }
  };

  /* ─── download PDF ───────────────────────────────────── */
  const handleDownload = async (invoice) => {
    setDownloadingId(invoice.id);
    try {
      const blob = await downloadInvoicePdf(invoice.id);
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `invoice-${invoice.invoiceNumber || invoice.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('PDF download failed: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  /* ─── send reminder ──────────────────────────────────── */
  const handleReminder = async (invoiceId) => {
    setSendingId(invoiceId);
    try {
      await sendReminder(invoiceId);
      setSuccess('Payment reminder sent successfully!');
    } catch (err) {
      setError('Failed to send reminder: ' + err.message);
    } finally {
      setSendingId(null);
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

  const isOverdue = (inv) =>
    inv.status !== 'paid' && inv.dueDate && new Date(inv.dueDate) < new Date();

  const statusLabel = (inv) => {
    if (isOverdue(inv)) return 'overdue';
    return inv.status || 'pending';
  };

  /* Quick totals from current page */
  const totalAmount  = invoices.reduce((a, i) => a + (i.amount || 0), 0);
  const totalPaid    = invoices.filter((i) => i.status === 'paid').reduce((a, i) => a + (i.paidAmount || i.amount || 0), 0);
  const totalPending = invoices.filter((i) => i.status !== 'paid').reduce((a, i) => a + (i.amount || 0), 0);

  /* ─── sub-view: payment form ─────────────────────────── */
  if (showPaymentForm && selectedInvoice) {
    return (
      <PaymentForm
        invoice={selectedInvoice}
        onClose={(refresh) => {
          setShowPaymentForm(false);
          setSelectedInvoice(null);
          if (refresh) fetchInvoices(pagination.page);
        }}
      />
    );
  }

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>🧾 Fee Invoices</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Track fee invoices and payments
          </p>
        </div>
        {isPrincipal && (
          <Button icon="⚡" onClick={() => setShowGenerateModal(true)}>
            Generate Invoices
          </Button>
        )}
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible autoClose={5000} onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible autoClose={4000} onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: 'Total Invoices',  value: pagination.total,            icon: '🧾', color: '#2563eb', bg: '#eff6ff'  },
          { label: 'Paid',            value: invoices.filter((i) => i.status === 'paid').length,    icon: '✅', color: '#16a34a', bg: '#dcfce7'  },
          { label: 'Pending',         value: invoices.filter((i) => i.status === 'pending').length, icon: '⏳', color: '#d97706', bg: '#fef9c3'  },
          { label: 'Overdue',         value: invoices.filter((i) => isOverdue(i)).length,           icon: '🚨', color: '#dc2626', bg: '#fee2e2'  },
          { label: 'Amount Collected',value: formatCurrency(totalPaid),   icon: '💰', color: '#16a34a', bg: '#dcfce7'  },
          { label: 'Amount Pending',  value: formatCurrency(totalPending),icon: '💸', color: '#d97706', bg: '#fef9c3'  },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 9,
              background: bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 16, marginBottom: 20,
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end',
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            placeholder="🔍 Search student, invoice no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInvoices(1)}
            style={{
              width: '100%', padding: '9px 14px',
              border: '1px solid #e2e8f0', borderRadius: 8,
              fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {[
          {
            label: 'CLASS', value: filterClass,
            onChange: setFilterClass,
            options: [
              <option key="" value="">All Classes</option>,
              ...classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>),
            ],
          },
          {
            label: 'STATUS', value: filterStatus,
            onChange: setFilterStatus,
            options: [
              <option value="">All Status</option>,
              <option value="pending">Pending</option>,
              <option value="paid">Paid</option>,
              <option value="overdue">Overdue</option>,
              <option value="partial">Partial</option>,
              <option value="cancelled">Cancelled</option>,
            ],
          },
          {
            label: 'MONTH', value: filterMonth,
            onChange: setFilterMonth,
            options: [<option value="">All Months</option>],
            type: 'month',
          },
        ].map(({ label, value, onChange, options, type }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              {label}
            </label>
            {type === 'month' ? (
              <input
                type="month"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                  padding: '9px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 8, fontSize: 14, minWidth: 150,
                }}
              />
            ) : (
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                  padding: '9px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 8, fontSize: 14, minWidth: 150,
                }}
              >
                {options}
              </select>
            )}
          </div>
        ))}

        {(filterClass || filterStatus || filterMonth || search) && (
          <button
            onClick={() => {
              setFilterClass(''); setFilterStatus('');
              setFilterMonth(''); setSearch('');
            }}
            style={{
              padding: '9px 14px', background: '#fff1f2',
              border: '1px solid #fecdd3', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, color: '#be123c',
              fontWeight: 600, marginTop: 22,
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Invoice Table */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
      }}>
        {loading ? (
          <Loading text="Loading invoices..." />
        ) : invoices.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>No invoices found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Invoice #', 'Student', 'Class', 'Fee Type', 'Amount', 'Due Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
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
                {invoices.map((inv, idx) => {
                  const overdue = isOverdue(inv);
                  const status  = statusLabel(inv);
                  return (
                    <tr
                      key={inv.id || idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: overdue ? '#fff5f5' : 'white',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = overdue ? '#fff5f5' : 'white';
                      }}
                    >
                      {/* Invoice # */}
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#2563eb' }}>
                          {inv.invoiceNumber || `INV-${String(inv.id).padStart(4,'0')}`}
                        </div>
                        {inv.month && (
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{inv.month}</div>
                        )}
                      </td>

                      {/* Student */}
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {inv.studentName || inv.student?.name || 'N/A'}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          Roll: {inv.rollNo || '—'}
                        </div>
                      </td>

                      {/* Class */}
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                        {inv.className || inv.class?.name || '—'}
                      </td>

                      {/* Fee Type */}
                      <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>
                        {inv.feeCategory?.replace('_', ' ') || inv.feeStructureName || '—'}
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                          {formatCurrency(inv.amount)}
                        </div>
                        {inv.paidAmount && inv.paidAmount < inv.amount && (
                          <div style={{ fontSize: 11, color: '#16a34a' }}>
                            Paid: {formatCurrency(inv.paidAmount)}
                          </div>
                        )}
                      </td>

                      {/* Due Date */}
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{
                          fontSize: 13,
                          color: overdue ? '#dc2626' : '#475569',
                          fontWeight: overdue ? 700 : 400,
                        }}>
                          {fmtDate(inv.dueDate)}
                          {overdue && <span style={{ marginLeft: 4 }}>⚠️</span>}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '13px 16px' }}>
                        <Badge
                          variant={
                            status === 'paid'      ? 'success'  :
                            status === 'overdue'   ? 'danger'   :
                            status === 'partial'   ? 'warning'  :
                            status === 'cancelled' ? 'default'  : 'warning'
                          }
                          dot
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {/* Collect payment */}
                          {isPrincipal && inv.status !== 'paid' && inv.status !== 'cancelled' && (
                            <button
                              onClick={() => { setSelectedInvoice(inv); setShowPaymentForm(true); }}
                              style={{
                                background: '#dcfce7', color: '#166534',
                                border: 'none', padding: '5px 10px',
                                borderRadius: 6, cursor: 'pointer',
                                fontSize: 12, fontWeight: 700,
                              }}
                            >
                              💳 Pay
                            </button>
                          )}
                          {/* PDF */}
                          <button
                            onClick={() => handleDownload(inv)}
                            disabled={downloadingId === inv.id}
                            style={{
                              background: '#eff6ff', color: '#2563eb',
                              border: 'none', padding: '5px 10px',
                              borderRadius: 6,
                              cursor: downloadingId === inv.id ? 'wait' : 'pointer',
                              fontSize: 12, fontWeight: 600,
                            }}
                          >
                            {downloadingId === inv.id ? '⏳' : '⬇️'}
                          </button>
                          {/* Reminder */}
                          {isPrincipal && inv.status !== 'paid' && (
                            <button
                              onClick={() => handleReminder(inv.id)}
                              disabled={sendingId === inv.id}
                              style={{
                                background: '#fef9c3', color: '#854d0e',
                                border: 'none', padding: '5px 10px',
                                borderRadius: 6,
                                cursor: sendingId === inv.id ? 'wait' : 'pointer',
                                fontSize: 12, fontWeight: 600,
                              }}
                            >
                              {sendingId === inv.id ? '⏳' : '🔔'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div style={{ padding: '0 20px 16px' }}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={(p) => fetchInvoices(p)}
            />
          </div>
        )}
      </div>

      {/* ── Generate Invoices Modal ── */}
      {showGenerateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16,
        }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: 32,
            maxWidth: 440, width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>
              ⚡ Generate Invoices
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Class *
                </label>
                <select
                  value={generateData.classId}
                  onChange={(e) => setGenerateData((p) => ({ ...p, classId: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                  }}
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Month *
                </label>
                <input
                  type="month"
                  value={generateData.month}
                  onChange={(e) => setGenerateData((p) => ({ ...p, month: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid #e2e8f0', borderRadius: 8,
                    fontSize: 14, boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            <Alert
              type="info"
              message="Invoices will be generated for all active students in the selected class based on their fee structures."
              style={{ marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowGenerateModal(false)} disabled={generating}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} loading={generating}>
                Generate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeInvoiceList;
