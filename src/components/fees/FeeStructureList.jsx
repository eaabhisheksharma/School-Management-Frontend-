import React, { useState, useEffect, useCallback } from 'react';
import {
  getFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
} from '../../api/feeApi';
import { getClasses } from '../../api/classApi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Badge from '../common/Badge';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';

const FEE_CATEGORIES = [
  { value: 'tuition',      label: '📚 Tuition Fee'       },
  { value: 'transport',    label: '🚌 Transport Fee'      },
  { value: 'library',      label: '📖 Library Fee'        },
  { value: 'sports',       label: '⚽ Sports Fee'         },
  { value: 'laboratory',   label: '🔬 Laboratory Fee'     },
  { value: 'examination',  label: '📝 Examination Fee'    },
  { value: 'hostel',       label: '🏠 Hostel Fee'         },
  { value: 'miscellaneous',label: '📋 Miscellaneous'      },
];

const FREQUENCY_OPTIONS = [
  { value: 'monthly',   label: 'Monthly'   },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually',  label: 'Annually'  },
  { value: 'one_time',  label: 'One Time'  },
];

const emptyForm = {
  name        : '',
  category    : '',
  classId     : '',
  amount      : '',
  frequency   : 'monthly',
  dueDay      : '',
  description : '',
  isActive    : true,
  academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
};

const FeeStructureList = ({ userRole }) => {
  const [structures, setStructures]     = useState([]);
  const [classes, setClasses]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [editItem, setEditItem]         = useState(null);
  const [formData, setFormData]         = useState(emptyForm);
  const [formLoading, setFormLoading]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterClass, setFilterClass]   = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const isPrincipal = userRole === 'principal';

  /* ─── fetch ──────────────────────────────────────────── */
  const fetchStructures = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getFeeStructures({
        ...(filterClass    && { classId   : filterClass    }),
        ...(filterCategory && { category  : filterCategory }),
      });
      setStructures(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load fee structures');
    } finally {
      setLoading(false);
    }
  }, [filterClass, filterCategory]);

  useEffect(() => {
    fetchStructures();
    (async () => {
      try {
        const res = await getClasses();
        setClasses(res.data || []);
      } catch { /* silent */ }
    })();
  }, [filterClass, filterCategory]);

  /* ─── form handlers ──────────────────────────────────── */
  const openCreate = () => {
    setEditItem(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFormData({
      name        : item.name         || '',
      category    : item.category     || '',
      classId     : item.classId      || '',
      amount      : item.amount       || '',
      frequency   : item.frequency    || 'monthly',
      dueDay      : item.dueDay       || '',
      description : item.description  || '',
      isActive    : item.isActive     !== false,
      academicYear: item.academicYear || emptyForm.academicYear,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type: t, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: t === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        amount: formData.amount ? Number(formData.amount) : 0,
        dueDay: formData.dueDay ? Number(formData.dueDay) : undefined,
      };
      if (editItem) await updateFeeStructure(editItem.id, payload);
      else          await createFeeStructure(payload);
      setSuccess(`Fee structure ${editItem ? 'updated' : 'created'} successfully! ✅`);
      setShowModal(false);
      fetchStructures();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteFeeStructure(deleteConfirm.id);
      setSuccess('Fee structure deleted');
      setDeleteConfirm(null);
      fetchStructures();
    } catch (err) {
      setError(err.message || 'Delete failed');
      setDeleteConfirm(null);
    }
  };

  /* ─── helpers ────────────────────────────────────────── */
  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

  const categoryIcon = (cat) => {
    const m = {
      tuition:'📚', transport:'🚌', library:'📖',
      sports:'⚽', laboratory:'🔬', examination:'📝',
      hostel:'🏠', miscellaneous:'📋',
    };
    return m[cat] || '💰';
  };

  const totalMonthly = structures
    .filter((s) => s.isActive && s.frequency === 'monthly')
    .reduce((a, s) => a + (s.amount || 0), 0);

  const totalAnnual = structures
    .filter((s) => s.isActive)
    .reduce((a, s) => {
      const mult = { monthly: 12, quarterly: 4, annually: 1, one_time: 1 };
      return a + (s.amount || 0) * (mult[s.frequency] || 1);
    }, 0);

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>💰 Fee Structures</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Define and manage fee structures per class
          </p>
        </div>
        {isPrincipal && (
          <Button icon="+" onClick={openCreate}>Add Structure</Button>
        )}
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible autoClose={5000} onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible autoClose={4000} onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: 'Total Structures', value: structures.length,                                    icon: '📋', color: '#2563eb', bg: '#eff6ff'  },
          { label: 'Active',           value: structures.filter((s) => s.isActive).length,          icon: '✅', color: '#16a34a', bg: '#dcfce7'  },
          { label: 'Monthly Revenue',  value: formatCurrency(totalMonthly),                         icon: '📅', color: '#d97706', bg: '#fef9c3'  },
          { label: 'Annual Revenue',   value: formatCurrency(totalAnnual),                          icon: '💵', color: '#7c3aed', bg: '#f5f3ff'  },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 10,
              background: bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 22,
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

      {/* Filters */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 16, marginBottom: 20,
        display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>CLASS</label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
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
          <label style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>CATEGORY</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '9px 14px', border: '1px solid #e2e8f0',
              borderRadius: 8, fontSize: 14, minWidth: 180,
            }}
          >
            <option value="">All Categories</option>
            {FEE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        {(filterClass || filterCategory) && (
          <button
            onClick={() => { setFilterClass(''); setFilterCategory(''); }}
            style={{
              padding: '9px 16px', background: '#fff1f2',
              border: '1px solid #fecdd3', borderRadius: 8,
              cursor: 'pointer', fontSize: 13, color: '#be123c', fontWeight: 600,
              marginTop: 22,
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Structure Cards */}
      {loading ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <Loading text="Loading fee structures..." />
        </div>
      ) : structures.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 60, textAlign: 'center', color: '#94a3b8',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 6px' }}>No fee structures found</p>
          {isPrincipal && (
            <Button style={{ marginTop: 12 }} onClick={openCreate}>
              + Create First Structure
            </Button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))',
          gap: 18,
        }}>
          {structures.map((item) => (
            <div key={item.id} style={{
              background: 'white', borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: `1px solid ${item.isActive ? '#e2e8f0' : '#fee2e2'}`,
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                height: 5,
                background: item.isActive ? '#2563eb' : '#94a3b8',
              }} />
              <div style={{ padding: 20 }}>
                {/* Title */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: '#eff6ff', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 22,
                    }}>
                      {categoryIcon(item.category)}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{item.name}</h3>
                      <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8', textTransform: 'capitalize' }}>
                        {item.category?.replace('_', ' ') || '—'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.isActive ? 'success' : 'danger'} size="sm">
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {/* Amount */}
                <div style={{
                  background: '#f8fafc', borderRadius: 10,
                  padding: '14px 16px', marginBottom: 14,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb' }}>
                      {formatCurrency(item.amount)}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, textTransform: 'capitalize' }}>
                      per {item.frequency?.replace('_', ' ') || 'month'}
                    </div>
                  </div>
                  {item.dueDay && (
                    <div style={{
                      background: '#fef9c3', color: '#854d0e',
                      padding: '6px 12px', borderRadius: 8,
                      fontSize: 12, fontWeight: 700,
                    }}>
                      Due: Day {item.dueDay}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, color: '#64748b', marginBottom: 16,
                }}>
                  <span>🏫 {item.className || item.class?.name || 'All Classes'}</span>
                  <span>📅 {item.academicYear || '—'}</span>
                </div>

                {/* Actions */}
                {isPrincipal && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => openEdit(item)}
                      style={{
                        flex: 1, background: '#eff6ff', color: '#2563eb',
                        border: '1px solid #bfdbfe', padding: '8px',
                        borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      style={{
                        background: '#fff1f2', color: '#be123c',
                        border: '1px solid #fecdd3', padding: '8px 14px',
                        borderRadius: 8, cursor: 'pointer', fontSize: 13,
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? '✏️ Edit Fee Structure' : '➕ Add Fee Structure'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Structure Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Monthly Tuition Fee"
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={FEE_CATEGORIES}
                placeholder="Select category"
                required
              />
              <Select
                label="Class"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                options={classes.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="All Classes"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Input
                label="Amount (₹)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                min={0}
                required
              />
              <Select
                label="Frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                options={FREQUENCY_OPTIONS}
              />
              <Input
                label="Due Day of Month"
                name="dueDay"
                type="number"
                value={formData.dueDay}
                onChange={handleChange}
                placeholder="e.g. 10"
                min={1} max={31}
              />
            </div>
            <Input
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="e.g. 2025-2026"
            />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Optional notes..."
                style={{
                  width: '100%', marginTop: 6, padding: '9px 14px',
                  border: '1.5px solid #e2e8f0', borderRadius: 8,
                  fontSize: 14, resize: 'vertical', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            {/* Active toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute', cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: formData.isActive ? '#2563eb' : '#cbd5e1',
                  borderRadius: 34, transition: '0.3s',
                }}>
                  <span style={{
                    position: 'absolute', height: 18, width: 18,
                    left: formData.isActive ? 22 : 3, bottom: 3,
                    background: 'white', borderRadius: '50%', transition: '0.3s',
                  }} />
                </span>
              </label>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {/* Form buttons */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={formLoading}>
                {editItem ? 'Update Structure' : 'Create Structure'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16,
        }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: 32,
            maxWidth: 400, width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 14 }}>🗑️</div>
            <h3 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: 18 }}>Delete Fee Structure?</h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 24 }}>
              Delete <strong>"{deleteConfirm.name}"</strong>? Existing invoices using this structure won't be affected.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructureList;
