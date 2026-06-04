import React, { useState, useEffect } from 'react';
import { recordPayment, getPaymentHistory } from '../../api/feeApi';
import Button from '../common/Button';
import Alert from '../common/Alert';

const PAYMENT_MODES = [
  { value: 'cash',          label: '💵 Cash'           },
  { value: 'online',        label: '💻 Online Transfer' },
  { value: 'cheque',        label: '🏦 Cheque'         },
  { value: 'dd',            label: '📄 Demand Draft'   },
  { value: 'upi',           label: '📱 UPI'            },
  { value: 'card',          label: '💳 Card'           },
];

const PaymentForm = ({ invoice, onClose }) => {
  const [paymentData, setPaymentData] = useState({
    amount          : invoice?.amount - (invoice?.paidAmount || 0) || '',
    paymentMode     : 'cash',
    paymentDate     : new Date().toISOString().split('T')[0],
    transactionId   : '',
    chequeNo        : '',
    chequeDate      : '',
    bankName        : '',
    remarks         : '',
    sendReceipt     : true,
  });

  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [activeTab, setActiveTab] = useState('payment');

  /* ─── load history ───────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await getPaymentHistory(invoice.id);
        setHistory(res.data || []);
      } catch { /* silent */ }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const pendingAmount = (invoice?.amount || 0) - (invoice?.paidAmount || 0);

  /* ─── submit ─────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.amount || Number(paymentData.amount) <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    if (Number(paymentData.amount) > pendingAmount) {
      setError(`Amount cannot exceed pending amount of ₹${pendingAmount}`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await recordPayment(invoice.id, {
        ...paymentData,
        amount: Number(paymentData.amount),
      });
      setSuccess('Payment recorded successfully! ✅ Receipt will be generated.');
      setTimeout(() => onClose(true), 1500);
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(n || 0);

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : '—';

  const modeRequiresTransId = ['online', 'upi', 'card'].includes(paymentData.paymentMode);
  const isCheque = paymentData.paymentMode === 'cheque' || paymentData.paymentMode === 'dd';

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>💳 Collect Payment</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Record fee payment for {invoice?.studentName || 'Student'}
          </p>
        </div>
        <Button variant="outline" onClick={() => onClose(false)}>← Back</Button>
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* Invoice Summary Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
        color: 'white', borderRadius: 12, padding: 24,
        marginBottom: 24,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))',
        gap: 20,
      }}>
        {[
          { label: 'Student',    value: invoice?.studentName   || '—' },
          { label: 'Class',      value: invoice?.className     || '—' },
          { label: 'Invoice #',  value: invoice?.invoiceNumber || `INV-${String(invoice?.id).padStart(4,'0')}` },
          { label: 'Fee Type',   value: invoice?.feeCategory?.replace('_',' ') || '—', style: { textTransform: 'capitalize' } },
          { label: 'Total Amount',  value: formatCurrency(invoice?.amount),     highlight: true },
          { label: 'Already Paid',  value: formatCurrency(invoice?.paidAmount), highlight: true, color: '#86efac' },
          { label: 'Pending Amount',value: formatCurrency(pendingAmount),        highlight: true, color: '#fca5a5' },
          { label: 'Due Date',   value: fmtDate(invoice?.dueDate) },
        ].map(({ label, value, highlight, color, style: s }) => (
          <div key={label}>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </div>
            <div style={{
              fontSize: highlight ? 18 : 14,
              fontWeight: highlight ? 800 : 600,
              color: color || 'white',
              ...(s || {}),
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: '2px solid #f1f5f9',
      }}>
        {[
          { key: 'payment', label: '💳 New Payment' },
          { key: 'history', label: `🕒 History (${history.length})` },
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

      {/* ══════ PAYMENT TAB ══════ */}
      {activeTab === 'payment' && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 28,
        }}>
          <form onSubmit={handleSubmit}>
            {/* Payment Mode */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#374151' }}>
                Payment Mode *
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {PAYMENT_MODES.map(({ value, label }) => (
                  <label key={value} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 16px',
                    border: `2px solid ${paymentData.paymentMode === value ? '#2563eb' : '#e2e8f0'}`,
                    borderRadius: 8, cursor: 'pointer',
                    background: paymentData.paymentMode === value ? '#eff6ff' : 'white',
                    transition: 'all 0.15s',
                  }}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value={value}
                      checked={paymentData.paymentMode === value}
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600,
                      color: paymentData.paymentMode === value ? '#2563eb' : '#475569' }}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount + Date */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 16, marginBottom: 20,
            }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                  Payment Amount (₹) *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 16, color: '#94a3b8', fontWeight: 700,
                  }}>₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={paymentData.amount}
                    onChange={handleChange}
                    min={1} max={pendingAmount}
                    required
                    style={{
                      width: '100%', padding: '10px 14px 10px 30px',
                      border: '1.5px solid #e2e8f0', borderRadius: 8,
                      fontSize: 16, fontWeight: 700, outline: 'none',
                      boxSizing: 'border-box', color: '#16a34a',
                    }}
                  />
                </div>
                <div style={{ marginTop: 5, fontSize: 12, color: '#64748b' }}>
                  Max: {formatCurrency(pendingAmount)}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentData.paymentDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1.5px solid #e2e8f0', borderRadius: 8,
                    fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Transaction ID for online / UPI / card */}
            {modeRequiresTransId && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                  Transaction / UTR ID *
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={paymentData.transactionId}
                  onChange={handleChange}
                  placeholder="Enter transaction reference number"
                  required
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1.5px solid #e2e8f0', borderRadius: 8,
                    fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {/* Cheque / DD fields */}
            {isCheque && (
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: 16, marginBottom: 20,
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                    Cheque / DD No. *
                  </label>
                  <input
                    type="text"
                    name="chequeNo"
                    value={paymentData.chequeNo}
                    onChange={handleChange}
                    placeholder="Cheque number"
                    required
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1.5px solid #e2e8f0', borderRadius: 8,
                      fontSize: 14, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                    Cheque Date *
                  </label>
                  <input
                    type="date"
                    name="chequeDate"
                    value={paymentData.chequeDate}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1.5px solid #e2e8f0', borderRadius: 8,
                      fontSize: 14, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={paymentData.bankName}
                    onChange={handleChange}
                    placeholder="Bank name"
                    required
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1.5px solid #e2e8f0', borderRadius: 8,
                      fontSize: 14, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Remarks */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                Remarks
              </label>
              <textarea
                name="remarks"
                value={paymentData.remarks}
                onChange={handleChange}
                rows={2}
                placeholder="Optional notes..."
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #e2e8f0', borderRadius: 8,
                  fontSize: 14, resize: 'vertical', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Send Receipt toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', background: '#f8fafc',
              borderRadius: 8, marginBottom: 24,
            }}>
              <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                <input
                  type="checkbox"
                  name="sendReceipt"
                  checked={paymentData.sendReceipt}
                  onChange={handleChange}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute', cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: paymentData.sendReceipt ? '#2563eb' : '#cbd5e1',
                  borderRadius: 34, transition: '0.3s',
                }}>
                  <span style={{
                    position: 'absolute', height: 18, width: 18,
                    left: paymentData.sendReceipt ? 22 : 3, bottom: 3,
                    background: 'white', borderRadius: '50%', transition: '0.3s',
                  }} />
                </span>
              </label>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                  📧 Send payment receipt
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  Email confirmation to parent / student
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="outline" type="button" onClick={() => onClose(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                variant="success"
                size="lg"
              >
                💰 Record Payment {paymentData.amount ? `of ${formatCurrency(paymentData.amount)}` : ''}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ══════ HISTORY TAB ══════ */}
      {activeTab === 'history' && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          {history.length === 0 ? (
            <div style={{ padding: 50, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🕒</div>
              <p style={{ fontWeight: 600 }}>No payment history yet</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Date', 'Amount', 'Mode', 'Transaction ID', 'Received By', 'Remarks'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: 12, fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr
                    key={h.id || i}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '13px 16px', fontSize: 14 }}>{fmtDate(h.paymentDate)}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#16a34a' }}>
                        {formatCurrency(h.amount)}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, textTransform: 'capitalize' }}>
                      {h.paymentMode?.replace('_',' ') || '—'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#2563eb' }}>
                      {h.transactionId || h.chequeNo || '—'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b' }}>
                      {h.receivedBy || '—'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b' }}>
                      {h.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
