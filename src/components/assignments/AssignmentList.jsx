import React, { useState, useEffect, useCallback } from 'react';
import {
  getAssignments,
  getMyAssignments,
  deleteAssignment,
} from '../../api/assignmentApi';
import AssignmentForm from './AssignmentForm';
import AssignmentDetails from './AssignmentDetails';

const AssignmentList = ({ userRole }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [viewAssignment, setViewAssignment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const isTeacherOrPrincipal = ['teacher', 'principal'].includes(userRole);

  const fetchAssignments = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(filterStatus && { status: filterStatus }),
      };
      const res = isTeacherOrPrincipal
        ? await getAssignments(params)
        : await getMyAssignments(params);

      setAssignments(res.data || []);
      if (res.pagination) setPagination((prev) => ({ ...prev, ...res.pagination }));
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, isTeacherOrPrincipal, pagination.limit]);

  useEffect(() => {
    fetchAssignments(1);
  }, [filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAssignments(1);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAssignment(id);
      setDeleteConfirm(null);
      fetchAssignments(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to delete assignment');
    }
  };

  const handleFormClose = (refresh = false) => {
    setShowForm(false);
    setSelectedAssignment(null);
    if (refresh) fetchAssignments(pagination.page);
  };

  const getStatusBadge = (status) => {
    const map = {
      active: { bg: '#dcfce7', color: '#166534', label: 'Active' },
      expired: { bg: '#fee2e2', color: '#991b1b', label: 'Expired' },
      draft: { bg: '#fef9c3', color: '#854d0e', label: 'Draft' },
      submitted: { bg: '#dbeafe', color: '#1e40af', label: 'Submitted' },
      evaluated: { bg: '#ede9fe', color: '#5b21b6', label: 'Evaluated' },
    };
    const s = map[status] || { bg: '#f1f5f9', color: '#475569', label: status || 'Unknown' };
    return (
      <span style={{
        background: s.bg, color: s.color,
        padding: '3px 10px', borderRadius: 12,
        fontSize: 12, fontWeight: 600,
      }}>
        {s.label}
      </span>
    );
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : 'N/A';

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const diff = new Date(dueDate) - new Date();
    return diff > 0 && diff < 2 * 24 * 60 * 60 * 1000;
  };

  const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date();

  // ── Detail View ──────────────────────────────────────────────────
  if (viewAssignment) {
    return (
      <AssignmentDetails
        assignment={viewAssignment}
        userRole={userRole}
        onBack={() => setViewAssignment(null)}
        onEdit={(a) => { setViewAssignment(null); setSelectedAssignment(a); setShowForm(true); }}
        onRefresh={() => fetchAssignments(pagination.page)}
      />
    );
  }

  // ── Form View ────────────────────────────────────────────────────
  if (showForm) {
    return (
      <AssignmentForm
        assignment={selectedAssignment}
        onClose={handleFormClose}
      />
    );
  }

  // ── Main List ────────────────────────────────────────────────────
  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            📝 Assignments
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {isTeacherOrPrincipal
              ? 'Manage and track all assignments'
              : 'View and submit your assignments'}
          </p>
        </div>
        {isTeacherOrPrincipal && (
          <button onClick={() => { setSelectedAssignment(null); setShowForm(true); }}
            style={{
              background: '#2563eb', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
              fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
            }}>
            + New Assignment
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fee2e2', color: '#991b1b', padding: '12px 16px',
          borderRadius: 8, marginBottom: 20, fontSize: 14,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Search & Filter */}
      <div style={{
        background: 'white', borderRadius: 10, padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 20,
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by title, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 220, padding: '9px 14px',
              border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '9px 14px', border: '1px solid #e2e8f0',
              borderRadius: 8, fontSize: 14, minWidth: 150,
            }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
            {!isTeacherOrPrincipal && <option value="submitted">Submitted</option>}
            {!isTeacherOrPrincipal && <option value="evaluated">Evaluated</option>}
          </select>
          <button type="submit" style={{
            background: '#2563eb', color: 'white', border: 'none',
            padding: '9px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
          }}>
            Search
          </button>
          {(search || filterStatus) && (
            <button type="button"
              onClick={() => { setSearch(''); setFilterStatus(''); fetchAssignments(1); }}
              style={{
                background: '#f1f5f9', color: '#475569', border: 'none',
                padding: '9px 16px', borderRadius: 8, cursor: 'pointer',
              }}>
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Loading assignments...
          </div>
        ) : assignments.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No assignments found</p>
            <p style={{ fontSize: 14 }}>
              {isTeacherOrPrincipal ? 'Create your first assignment.' : 'No assignments yet.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Title', 'Subject', 'Class', 'Due Date', 'Marks', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: 12, fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, idx) => (
                  <tr key={a.id || idx}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>
                        {a.title}
                      </div>
                      {a.description && (
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                          {a.description.length > 50
                            ? `${a.description.slice(0, 50)}...`
                            : a.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569' }}>
                      {a.subjectName || a.subject || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569' }}>
                      {a.className || a.class || 'N/A'}
                      {a.sectionName && <span style={{ color: '#94a3b8' }}> - {a.sectionName}</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{
                        fontSize: 14,
                        color: isOverdue(a.dueDate)
                          ? '#dc2626'
                          : isDueSoon(a.dueDate)
                          ? '#d97706'
                          : '#475569',
                        fontWeight: isOverdue(a.dueDate) || isDueSoon(a.dueDate) ? 600 : 400,
                      }}>
                        {formatDate(a.dueDate)}
                        {isOverdue(a.dueDate) && (
                          <div style={{ fontSize: 11, color: '#dc2626' }}>Overdue</div>
                        )}
                        {isDueSoon(a.dueDate) && (
                          <div style={{ fontSize: 11, color: '#d97706' }}>Due Soon</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569' }}>
                      {a.totalMarks || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {getStatusBadge(a.status)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setViewAssignment(a)}
                          style={{
                            background: '#eff6ff', color: '#2563eb', border: 'none',
                            padding: '6px 12px', borderRadius: 6,
                            cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          }}>
                          View
                        </button>
                        {isTeacherOrPrincipal && (
                          <>
                            <button
                              onClick={() => { setSelectedAssignment(a); setShowForm(true); }}
                              style={{
                                background: '#f0fdf4', color: '#166534', border: 'none',
                                padding: '6px 12px', borderRadius: 6,
                                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                              }}>
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(a)}
                              style={{
                                background: '#fff1f2', color: '#be123c', border: 'none',
                                padding: '6px 12px', borderRadius: 6,
                                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                              }}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div style={{
            padding: '16px 20px', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid #f1f5f9',
          }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => fetchAssignments(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  padding: '6px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 6, cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  background: 'white', fontSize: 13,
                  opacity: pagination.page === 1 ? 0.5 : 1,
                }}>
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => fetchAssignments(p)}
                    style={{
                      padding: '6px 12px', border: '1px solid #e2e8f0',
                      borderRadius: 6, cursor: 'pointer', fontSize: 13,
                      background: pagination.page === p ? '#2563eb' : 'white',
                      color: pagination.page === p ? 'white' : '#475569',
                    }}>
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => fetchAssignments(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                style={{
                  padding: '6px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                  background: 'white', fontSize: 13,
                  opacity: pagination.page === pagination.pages ? 0.5 : 1,
                }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: 32,
            maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: 18 }}>
              Delete Assignment?
            </h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 24 }}>
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 24px', border: '1px solid #e2e8f0',
                  borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                  background: 'white', fontSize: 14,
                }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)}
                style={{
                  padding: '10px 24px', background: '#dc2626',
                  color: 'white', border: 'none', borderRadius: 8,
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
