import React, { useState, useEffect, useCallback } from 'react';
import {
  getStudents,
  deleteStudent,
  exportStudents,
} from '../../api/studentApi';
import { getClasses } from '../../api/classApi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';
import SearchBox from '../common/SearchBox';
import StudentCard from './StudentCard';
import StudentForm from './StudentForm';
import StudentDetails from './StudentDetails';

const StudentList = ({ userRole }) => {
  const [students, setStudents]         = useState([]);
  const [classes, setClasses]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [search, setSearch]             = useState('');
  const [filterClass, setFilterClass]   = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [viewMode, setViewMode]         = useState('table'); // 'table' | 'grid'
  const [pagination, setPagination]     = useState({
    page: 1, limit: 15, total: 0, pages: 1,
  });

  const [showForm, setShowForm]             = useState(false);
  const [editStudent, setEditStudent]       = useState(null);
  const [viewStudent, setViewStudent]       = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState(null);
  const [deleting, setDeleting]             = useState(false);
  const [exporting, setExporting]           = useState(false);
  const [selectedIds, setSelectedIds]       = useState([]);

  const isPrincipalOrTeacher = ['principal', 'teacher'].includes(userRole);

  /* ─── fetch ──────────────────────────────────────────── */
  const fetchStudents = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await getStudents({
        page, limit: pagination.limit,
        ...(search        && { search }),
        ...(filterClass   && { classId: filterClass  }),
        ...(filterGender  && { gender : filterGender  }),
        ...(filterStatus  && { status : filterStatus  }),
      });
      setStudents(res.data || []);
      if (res.pagination) setPagination((p) => ({ ...p, ...res.pagination, page }));
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [search, filterClass, filterGender, filterStatus, pagination.limit]);

  useEffect(() => {
    fetchStudents(1);
    (async () => {
      try { const r = await getClasses(); setClasses(r.data || []); } catch { /* silent */ }
    })();
  }, [filterClass, filterGender, filterStatus]);

  /* ─── delete ─────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteStudent(deleteConfirm.id);
      setSuccess(`Student "${deleteConfirm.name}" removed successfully`);
      setDeleteConfirm(null);
      fetchStudents(pagination.page);
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  /* ─── export ─────────────────────────────────────────── */
  const handleExport = async (format = 'csv') => {
    setExporting(true);
    try {
      const blob = await exportStudents({
        format,
        ...(filterClass  && { classId: filterClass  }),
        ...(filterStatus && { status : filterStatus  }),
      });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `students-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSuccess(`Students exported as ${format.toUpperCase()}`);
    } catch (err) {
      setError('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  /* ─── select all ─────────────────────────────────────── */
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length)
      setSelectedIds([]);
    else
      setSelectedIds(students.map((s) => s.id));
  };

  const toggleSelect = (id) =>
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  /* ─── sub-views ──────────────────────────────────────── */
  if (showForm) {
    return (
      <StudentForm
        student={editStudent}
        userRole={userRole}
        onClose={(refresh) => {
          setShowForm(false);
          setEditStudent(null);
          if (refresh) fetchStudents(pagination.page);
        }}
      />
    );
  }

  if (viewStudent) {
    return (
      <StudentDetails
        studentId={viewStudent.id}
        userRole={userRole}
        onClose={() => setViewStudent(null)}
        onEdit={() => {
          setEditStudent(viewStudent);
          setViewStudent(null);
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
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>👥 Students</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Manage student profiles, enrollment and records
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            loading={exporting}
            onClick={() => handleExport('csv')}
            icon="📄"
          >
            Export
          </Button>
          {isPrincipalOrTeacher && (
            <Button
              icon="+"
              onClick={() => { setEditStudent(null); setShowForm(true); }}
            >
              Add Student
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
          { label: 'Total Students', value: pagination.total,                                              icon: '👥', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Active',         value: students.filter((s) => s.status === 'active').length,          icon: '✅', color: '#16a34a', bg: '#dcfce7' },
          { label: 'Boys',           value: students.filter((s) => s.gender === 'male').length,            icon: '👦', color: '#0284c7', bg: '#e0f2fe' },
          { label: 'Girls',          value: students.filter((s) => s.gender === 'female').length,          icon: '👧', color: '#9333ea', bg: '#f5f3ff' },
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

      {/* Search + Filters */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 16, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <input
              type="text"
              placeholder="🔍 Search by name, roll no, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchStudents(1)}
              style={{
                width: '100%', padding: '9px 14px',
                border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Class filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>CLASS</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 150,
              }}
            >
              <option value="">All Classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Gender filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>GENDER</label>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 130,
              }}
            >
              <option value="">All</option>
              <option value="male">👦 Male</option>
              <option value="female">👧 Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>STATUS</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 130,
              }}
            >
              <option value="">All Status</option>
              <option value="active">✅ Active</option>
              <option value="inactive">⏸ Inactive</option>
              <option value="transferred">🔄 Transferred</option>
              <option value="graduated">🎓 Graduated</option>
            </select>
          </div>

          {/* Search button */}
          <Button onClick={() => fetchStudents(1)} style={{ marginTop: 20 }}>
            Search
          </Button>

          {/* Clear */}
          {(filterClass || filterGender || filterStatus || search) && (
            <button
              onClick={() => {
                setFilterClass(''); setFilterGender('');
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
            {[
              { mode: 'table', icon: '☰' },
              { mode: 'grid',  icon: '⊞' },
            ].map(({ mode, icon }) => (
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

      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div style={{
          background: '#eff6ff', border: '1px solid #bfdbfe',
          borderRadius: 8, padding: '10px 16px', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1d4ed8' }}>
            {selectedIds.length} student{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => setSelectedIds([])}
            style={{
              background: 'none', border: 'none',
              color: '#64748b', cursor: 'pointer', fontSize: 13,
            }}
          >
            Clear
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Button size="sm" variant="outline" onClick={() => handleExport('csv')}>
              📄 Export Selected
            </Button>
            {isPrincipalOrTeacher && (
              <Button size="sm" variant="danger">
                🗑️ Delete Selected
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── Grid View ── */}
      {loading ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <Loading type="skeleton" rows={8} />
        </div>
      ) : students.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 60, textAlign: 'center', color: '#94a3b8',
        }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>👥</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 6px', color: '#64748b' }}>
            No students found
          </p>
          {isPrincipalOrTeacher && (
            <Button
              style={{ marginTop: 16 }}
              onClick={() => { setEditStudent(null); setShowForm(true); }}
            >
              + Enroll First Student
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))',
          gap: 18,
        }}>
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              userRole={userRole}
              selected={selectedIds.includes(student.id)}
              onSelect={() => toggleSelect(student.id)}
              onView={() => setViewStudent(student)}
              onEdit={() => { setEditStudent(student); setShowForm(true); }}
              onDelete={() => setDeleteConfirm(student)}
            />
          ))}
        </div>
      ) : (
        /* ── Table View ── */
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {isPrincipalOrTeacher && (
                    <th style={{ padding: '13px 16px', width: 40, borderBottom: '2px solid #e2e8f0' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === students.length && students.length > 0}
                        onChange={toggleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                  )}
                  {['Student', 'Roll No', 'Class', 'Gender', 'Parent Contact', 'Status', 'Actions'].map((h) => (
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
                {students.map((student, idx) => (
                  <tr
                    key={student.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: selectedIds.includes(student.id)
                        ? '#f0f9ff' : 'white',
                      cursor: 'pointer',
                    }}
                    onClick={() => setViewStudent(student)}
                    onMouseEnter={(e) => {
                      if (!selectedIds.includes(student.id))
                        e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        selectedIds.includes(student.id) ? '#f0f9ff' : 'white';
                    }}
                  >
                    {isPrincipalOrTeacher && (
                      <td
                        style={{ padding: '13px 16px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(student.id)}
                          onChange={() => toggleSelect(student.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    )}

                    {/* Student */}
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Avatar */}
                        <div style={{
                          width: 38, height: 38, borderRadius: 10,
                          background: student.gender === 'female'
                            ? 'linear-gradient(135deg,#9333ea,#c026d3)'
                            : 'linear-gradient(135deg,#2563eb,#0284c7)',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14, fontWeight: 800, color: 'white',
                          flexShrink: 0,
                        }}>
                          {student.profilePhoto
                            ? <img src={student.profilePhoto} alt="" style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }} />
                            : (student.name || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                            {student.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>
                            {student.email || student.admissionNo || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        background: '#f8fafc', color: '#475569',
                        padding: '3px 9px', borderRadius: 6,
                        fontSize: 13, fontWeight: 600,
                        border: '1px solid #e2e8f0',
                      }}>
                        {student.rollNo || '—'}
                      </span>
                    </td>

                    {/* Class */}
                    <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569', fontWeight: 500 }}>
                      {student.className || student.class?.name || '—'}
                    </td>

                    {/* Gender */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        fontSize: 13,
                        color: student.gender === 'female' ? '#9333ea' : '#0284c7',
                        fontWeight: 600, textTransform: 'capitalize',
                      }}>
                        {student.gender === 'male'   ? '👦 Male'   :
                         student.gender === 'female' ? '👧 Female' : student.gender || '—'}
                      </span>
                    </td>

                    {/* Parent Contact */}
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                      {student.parentPhone || student.guardianPhone || '—'}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        background:
                          student.status === 'active'      ? '#dcfce7' :
                          student.status === 'inactive'    ? '#fee2e2' :
                          student.status === 'transferred' ? '#fef9c3' : '#f1f5f9',
                        color:
                          student.status === 'active'      ? '#166534' :
                          student.status === 'inactive'    ? '#991b1b' :
                          student.status === 'transferred' ? '#854d0e' : '#475569',
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'currentColor', flexShrink: 0,
                        }} />
                        {(student.status || 'active').charAt(0).toUpperCase() +
                         (student.status || 'active').slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td
                      style={{ padding: '13px 16px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setViewStudent(student)}
                          style={{
                            background: '#eff6ff', color: '#2563eb',
                            border: '1px solid #bfdbfe', padding: '5px 10px',
                            borderRadius: 6, cursor: 'pointer',
                            fontSize: 12, fontWeight: 600,
                          }}
                        >
                          👁️
                        </button>
                        {isPrincipalOrTeacher && (
                          <>
                            <button
                              onClick={() => { setEditStudent(student); setShowForm(true); }}
                              style={{
                                background: '#f8fafc', color: '#475569',
                                border: '1px solid #e2e8f0', padding: '5px 10px',
                                borderRadius: 6, cursor: 'pointer', fontSize: 12,
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(student)}
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
              onPageChange={(p) => fetchStudents(p)}
            />
          </div>
        </div>
      )}

      {/* Pagination for grid view */}
      {!loading && viewMode === 'grid' && pagination.pages > 1 && (
        <div style={{ marginTop: 24 }}>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={(p) => fetchStudents(p)}
          />
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
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
              Remove Student?
            </h3>
            <p style={{
              textAlign: 'center', color: '#64748b',
              fontSize: 14, marginBottom: 28, lineHeight: 1.6,
            }}>
              Are you sure you want to remove{' '}
              <strong>"{deleteConfirm.name}"</strong>? All associated records will be affected.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                Remove Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
