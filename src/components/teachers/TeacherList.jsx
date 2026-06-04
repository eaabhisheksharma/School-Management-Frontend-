import React, { useState, useEffect, useCallback } from 'react';
import {
  getTeachers,
  deleteTeacher,
  exportTeachers,
} from '../../api/teacherApi';
import { getSubjects } from '../../api/subjectApi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';
import TeacherForm from './TeacherForm';
import TeacherDetails from './TeacherDetails';

const DESIGNATION_OPTIONS = [
  'Principal', 'Vice Principal', 'Head of Department',
  'Senior Teacher', 'Teacher', 'Assistant Teacher',
  'Lecturer', 'Lab Assistant', 'Sports Coach', 'Counselor',
];

const TeacherList = ({ userRole }) => {
  const [teachers, setTeachers]         = useState([]);
  const [subjects, setSubjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [search, setSearch]             = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [filterDesig, setFilterDesig]   = useState('');
  const [viewMode, setViewMode]         = useState('table');
  const [pagination, setPagination]     = useState({
    page: 1, limit: 15, total: 0, pages: 1,
  });
  const [showForm, setShowForm]         = useState(false);
  const [editTeacher, setEditTeacher]   = useState(null);
  const [viewTeacher, setViewTeacher]   = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [exporting, setExporting]       = useState(false);

  const isPrincipal = userRole === 'principal';

  /* ─── fetch ──────────────────────────────────────────── */
  const fetchTeachers = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await getTeachers({
        page, limit: pagination.limit,
        ...(search        && { search }),
        ...(filterSubject && { subjectId   : filterSubject }),
        ...(filterStatus  && { status      : filterStatus  }),
        ...(filterDesig   && { designation : filterDesig   }),
      });
      setTeachers(res.data || []);
      if (res.pagination) setPagination((p) => ({ ...p, ...res.pagination, page }));
    } catch (err) {
      setError(err.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  }, [search, filterSubject, filterStatus, filterDesig, pagination.limit]);

  useEffect(() => {
    fetchTeachers(1);
    (async () => {
      try { const r = await getSubjects(); setSubjects(r.data || []); } catch { /* silent */ }
    })();
  }, [filterSubject, filterStatus, filterDesig]);

  /* ─── delete ─────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteTeacher(deleteConfirm.id);
      setSuccess(`Teacher "${deleteConfirm.name}" removed`);
      setDeleteConfirm(null);
      fetchTeachers(pagination.page);
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  /* ─── export ─────────────────────────────────────────── */
  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportTeachers({ status: filterStatus });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `teachers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess('Exported successfully!');
    } catch (err) {
      setError('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  /* ─── sub-views ──────────────────────────────────────── */
  if (showForm) {
    return (
      <TeacherForm
        teacher={editTeacher}
        userRole={userRole}
        onClose={(refresh) => {
          setShowForm(false);
          setEditTeacher(null);
          if (refresh) fetchTeachers(pagination.page);
        }}
      />
    );
  }

  if (viewTeacher) {
    return (
      <TeacherDetails
        teacherId={viewTeacher.id}
        userRole={userRole}
        onClose={() => setViewTeacher(null)}
        onEdit={() => {
          setEditTeacher(viewTeacher);
          setViewTeacher(null);
          setShowForm(true);
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
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>👨‍🏫 Teachers</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Manage teaching staff profiles and assignments
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" loading={exporting} onClick={handleExport} icon="📄">
            Export
          </Button>
          {isPrincipal && (
            <Button icon="+" onClick={() => { setEditTeacher(null); setShowForm(true); }}>
              Add Teacher
            </Button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible autoClose={5000} onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible autoClose={3000} onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
        gap: 14, marginBottom: 24,
      }}>
        {[
          { label: 'Total Teachers', value: pagination.total,                                              icon: '👨‍🏫', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Active',         value: teachers.filter((t) => t.status === 'active').length,          icon: '✅',   color: '#16a34a', bg: '#dcfce7' },
          { label: 'Male',           value: teachers.filter((t) => t.gender === 'male').length,            icon: '👨',   color: '#0284c7', bg: '#e0f2fe' },
          { label: 'Female',         value: teachers.filter((t) => t.gender === 'female').length,          icon: '👩',   color: '#9333ea', bg: '#f5f3ff' },
          { label: 'Departments',    value: [...new Set(teachers.map((t) => t.department).filter(Boolean))].length, icon: '🏢', color: '#d97706', bg: '#fef9c3' },
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
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 16, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              type="text"
              placeholder="🔍 Search by name, email, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTeachers(1)}
              style={{
                width: '100%', padding: '9px 14px',
                border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {[
            {
              label: 'SUBJECT', value: filterSubject, set: setFilterSubject,
              options: [
                <option key="" value="">All Subjects</option>,
                ...subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>),
              ],
              width: 170,
            },
            {
              label: 'DESIGNATION', value: filterDesig, set: setFilterDesig,
              options: [
                <option value="">All Designations</option>,
                ...DESIGNATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>),
              ],
              width: 190,
            },
            {
              label: 'STATUS', value: filterStatus, set: setFilterStatus,
              options: [
                <option value="">All Status</option>,
                <option value="active">✅ Active</option>,
                <option value="inactive">⏸ Inactive</option>,
                <option value="on_leave">🏖 On Leave</option>,
                <option value="resigned">🚪 Resigned</option>,
              ],
              width: 150,
            },
          ].map(({ label, value, set, options, width }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                {label}
              </label>
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                style={{
                  padding: '9px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 8, fontSize: 14, minWidth: width,
                }}
              >
                {options}
              </select>
            </div>
          ))}

          <Button onClick={() => fetchTeachers(1)} style={{ marginTop: 20 }}>Search</Button>

          {(filterSubject || filterDesig || filterStatus || search) && (
            <button
              onClick={() => {
                setFilterSubject(''); setFilterDesig('');
                setFilterStatus('active'); setSearch('');
              }}
              style={{
                padding: '9px 14px', marginTop: 20,
                background: '#fff1f2', border: '1px solid #fecdd3',
                borderRadius: 8, cursor: 'pointer',
                fontSize: 13, color: '#be123c', fontWeight: 600,
              }}
            >
              Clear
            </button>
          )}

          {/* View toggle */}
          <div style={{
            display: 'flex', marginLeft: 'auto', marginTop: 20,
            border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden',
          }}>
            {[{ mode: 'table', icon: '☰' }, { mode: 'grid', icon: '⊞' }].map(({ mode, icon }) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{
                  padding: '9px 14px',
                  background: viewMode === mode ? '#2563eb' : 'white',
                  border: 'none', cursor: 'pointer',
                  color: viewMode === mode ? 'white' : '#64748b',
                  fontSize: 16,
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <Loading type="skeleton" rows={8} />
        </div>
      ) : teachers.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 60, textAlign: 'center', color: '#94a3b8',
        }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>👨‍🏫</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 6px', color: '#64748b' }}>
            No teachers found
          </p>
          {isPrincipal && (
            <Button style={{ marginTop: 16 }} onClick={() => { setEditTeacher(null); setShowForm(true); }}>
              + Add First Teacher
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (

        /* ── Grid cards ── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))',
          gap: 18,
        }}>
          {teachers.map((teacher) => (
            <TeacherGridCard
              key={teacher.id}
              teacher={teacher}
              isPrincipal={isPrincipal}
              onView={() => setViewTeacher(teacher)}
              onEdit={() => { setEditTeacher(teacher); setShowForm(true); }}
              onDelete={() => setDeleteConfirm(teacher)}
            />
          ))}
        </div>
      ) : (

        /* ── Table view ── */
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Teacher', 'Employee ID', 'Designation', 'Department', 'Subject(s)', 'Contact', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '13px 16px', textAlign: 'left',
                      fontSize: 12, fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    onClick={() => setViewTeacher(teacher)}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    {/* Teacher */}
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                          background: teacher.gender === 'female'
                            ? 'linear-gradient(135deg,#9333ea,#c026d3)'
                            : 'linear-gradient(135deg,#2563eb,#0284c7)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 800, color: 'white',
                          overflow: 'hidden',
                        }}>
                          {teacher.profilePhoto
                            ? <img src={teacher.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (teacher.name || 'T').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                            {teacher.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>
                            {teacher.email || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        background: '#f8fafc', color: '#475569',
                        padding: '3px 9px', borderRadius: 6,
                        fontSize: 12, fontWeight: 600, border: '1px solid #e2e8f0',
                      }}>
                        {teacher.employeeId || '—'}
                      </span>
                    </td>

                    {/* Designation */}
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                      {teacher.designation || '—'}
                    </td>

                    {/* Department */}
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                      {teacher.department || '—'}
                    </td>

                    {/* Subjects */}
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(teacher.subjects || []).slice(0, 2).map((s) => (
                          <span key={s.id || s} style={{
                            background: '#eff6ff', color: '#2563eb',
                            padding: '2px 8px', borderRadius: 6,
                            fontSize: 11, fontWeight: 600,
                          }}>
                            {s.name || s}
                          </span>
                        ))}
                        {teacher.subjects?.length > 2 && (
                          <span style={{
                            background: '#f1f5f9', color: '#64748b',
                            padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          }}>
                            +{teacher.subjects.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                      {teacher.phone || '—'}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 20,
                        fontSize: 12, fontWeight: 700,
                        background:
                          teacher.status === 'active'   ? '#dcfce7' :
                          teacher.status === 'on_leave' ? '#fef9c3' :
                          teacher.status === 'resigned' ? '#fee2e2' : '#f1f5f9',
                        color:
                          teacher.status === 'active'   ? '#166534' :
                          teacher.status === 'on_leave' ? '#854d0e' :
                          teacher.status === 'resigned' ? '#991b1b' : '#475569',
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'currentColor',
                        }} />
                        {(teacher.status || 'active').replace('_', ' ')
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      style={{ padding: '13px 16px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setViewTeacher(teacher)}
                          style={{
                            background: '#eff6ff', color: '#2563eb',
                            border: '1px solid #bfdbfe', padding: '5px 10px',
                            borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          }}
                        >
                          👁️
                        </button>
                        {isPrincipal && (
                          <>
                            <button
                              onClick={() => { setEditTeacher(teacher); setShowForm(true); }}
                              style={{
                                background: '#f8fafc', color: '#475569',
                                border: '1px solid #e2e8f0', padding: '5px 10px',
                                borderRadius: 6, cursor: 'pointer', fontSize: 12,
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(teacher)}
                              style={{
                                background: '#fff1f2', color: '#be123c',
                                border: '1px solid #fecdd3', padding: '5px 10px',
                                borderRadius: 6, cursor: 'pointer', fontSize: 12,
                              }}
                            >
                              🗑️
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

          {/* Pagination */}
          <div style={{ padding: '0 20px 16px' }}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={(p) => fetchTeachers(p)}
            />
          </div>
        </div>
      )}

      {/* Grid pagination */}
      {!loading && viewMode === 'grid' && pagination.pages > 1 && (
        <div style={{ marginTop: 24 }}>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={(p) => fetchTeachers(p)}
          />
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16,
        }}>
          <div style={{
            background: 'white', borderRadius: 14, padding: 36,
            maxWidth: 420, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 16 }}>⚠️</div>
            <h3 style={{ textAlign: 'center', margin: '0 0 10px', fontSize: 18 }}>
              Remove Teacher?
            </h3>
            <p style={{
              textAlign: 'center', color: '#64748b',
              fontSize: 14, marginBottom: 28, lineHeight: 1.6,
            }}>
              Are you sure you want to remove{' '}
              <strong>"{deleteConfirm.name}"</strong>?
              Their class assignments and records will be affected.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                Remove Teacher
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Grid Card Sub-component ────────────────────────────── */
const TeacherGridCard = ({ teacher, isPrincipal, onView, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  const avatarBg = teacher.gender === 'female'
    ? 'linear-gradient(135deg,#9333ea,#c026d3)'
    : 'linear-gradient(135deg,#2563eb,#0284c7)';

  const statusCfg = {
    active   : { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
    on_leave : { bg: '#fef9c3', color: '#854d0e', dot: '#f59e0b' },
    inactive : { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
    resigned : { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  };
  const sc = statusCfg[teacher.status] || statusCfg.active;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background   : 'white', borderRadius: 14,
        border       : `2px solid ${hovered ? '#bfdbfe' : '#f1f5f9'}`,
        boxShadow    : hovered ? '0 10px 30px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
        transition   : 'all 0.2s ease',
        transform    : hovered ? 'translateY(-3px)' : 'translateY(0)',
        overflow     : 'hidden',
      }}
    >
      {/* Gradient header */}
      <div style={{ height: 68, background: avatarBg, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -18, right: -18,
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
      </div>

      <div style={{ padding: '0 18px 18px', position: 'relative', marginTop: -28 }}>
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: teacher.profilePhoto ? 'transparent' : avatarBg,
          border: '3px solid white', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 800, color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          marginBottom: 10,
        }}>
          {teacher.profilePhoto
            ? <img src={teacher.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (teacher.name || 'T').charAt(0).toUpperCase()}
        </div>

        {/* Status */}
        <div style={{
          position: 'absolute', top: -16, right: 18,
          display: 'flex', alignItems: 'center', gap: 5,
          background: sc.bg, color: sc.color,
          padding: '4px 10px', borderRadius: 20,
          fontSize: 11, fontWeight: 700, border: '2px solid white',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
          {(teacher.status || 'active').replace('_', ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())}
        </div>

        <h3 style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
          {teacher.name}
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b' }}>
          {teacher.designation || 'Teacher'}
          {teacher.department ? ` • ${teacher.department}` : ''}
        </p>

        {/* Subjects */}
        {teacher.subjects && teacher.subjects.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
            {teacher.subjects.slice(0, 3).map((s) => (
              <span key={s.id || s} style={{
                background: '#eff6ff', color: '#2563eb',
                padding: '3px 9px', borderRadius: 8,
                fontSize: 11, fontWeight: 600, border: '1px solid #bfdbfe',
              }}>
                {s.name || s}
              </span>
            ))}
            {teacher.subjects.length > 3 && (
              <span style={{
                background: '#f1f5f9', color: '#64748b',
                padding: '3px 9px', borderRadius: 8, fontSize: 11, fontWeight: 600,
              }}>
                +{teacher.subjects.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Contact */}
        {teacher.phone && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 11px', marginBottom: 12,
            background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9',
            fontSize: 12, color: '#475569',
          }}>
            <span>📞</span>
            <span style={{ fontWeight: 500 }}>{teacher.phone}</span>
          </div>
        )}

        {/* Experience */}
        {teacher.experience && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 11px', marginBottom: 14,
            background: '#fef9c3', borderRadius: 8, border: '1px solid #fde68a',
            fontSize: 12, color: '#854d0e',
          }}>
            <span>⭐</span>
            <span style={{ fontWeight: 600 }}>{teacher.experience} years experience</span>
          </div>
        )}

        {/* Actions */}
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onView}
            style={{
              flex: 1, background: '#eff6ff', color: '#2563eb',
              border: '1px solid #bfdbfe', padding: '8px',
              borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background='#2563eb'; e.currentTarget.style.color='white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.color='#2563eb'; }}
          >
            👁️ View
          </button>
          {isPrincipal && (
            <>
              <button onClick={onEdit} style={{ background:'#f8fafc', color:'#475569', border:'1px solid #e2e8f0', padding:'8px 12px', borderRadius:8, cursor:'pointer', fontSize:14 }}>✏️</button>
              <button onClick={onDelete} style={{ background:'#fff1f2', color:'#be123c', border:'1px solid #fecdd3', padding:'8px 12px', borderRadius:8, cursor:'pointer', fontSize:14 }}>🗑️</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherList;
