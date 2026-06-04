import React, { useState, useEffect, useCallback } from 'react';
import { getExams, deleteExam, publishResults } from '../../api/examApi';
import Badge, { statusVariant } from '../common/Badge';
import Button from '../common/Button';
import SearchBox from '../common/SearchBox';
import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import ExamForm from './ExamForm';
import ExamResults from './ExamResults';

const ExamList = ({ userRole }) => {
  const [exams, setExams]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination]     = useState({
    page: 1, limit: 10, total: 0, pages: 1,
  });
  const [showForm, setShowForm]         = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [viewResults, setViewResults]   = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [publishConfirm, setPublishConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const isPrincipalOrTeacher = ['principal', 'teacher'].includes(userRole);

  /* ─── fetch exams ────────────────────────────────────── */
  const fetchExams = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await getExams({
        page, limit: pagination.limit,
        ...(search       && { search }),
        ...(filterStatus && { status: filterStatus }),
      });
      setExams(res.data || []);
      if (res.pagination) setPagination((p) => ({ ...p, ...res.pagination, page }));
    } catch (err) {
      setError(err.message || 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, pagination.limit]);

  useEffect(() => { fetchExams(1); }, [filterStatus]);

  /* ─── delete ─────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setActionLoading('delete');
    try {
      await deleteExam(deleteConfirm.id);
      setSuccess('Exam deleted successfully');
      setDeleteConfirm(null);
      fetchExams(pagination.page);
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setActionLoading('');
    }
  };

  /* ─── publish results ────────────────────────────────── */
  const handlePublish = async () => {
    if (!publishConfirm) return;
    setActionLoading('publish');
    try {
      await publishResults(publishConfirm.id);
      setSuccess(`Results for "${publishConfirm.name}" published successfully!`);
      setPublishConfirm(null);
      fetchExams(pagination.page);
    } catch (err) {
      setError(err.message || 'Publish failed');
    } finally {
      setActionLoading('');
    }
  };

  /* ─── helpers ────────────────────────────────────────── */
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : '—';

  const examTypeIcon = (type) => {
    const map = {
      midterm  : '📘', final    : '📕',
      unit     : '📗', practical: '🔬',
      oral     : '🎤', quiz     : '📝',
    };
    return map[(type || '').toLowerCase()] || '📋';
  };

  /* ─── sub views ──────────────────────────────────────── */
  if (viewResults) {
    return (
      <ExamResults
        exam={viewResults}
        userRole={userRole}
        onBack={() => setViewResults(null)}
        onRefresh={() => fetchExams(pagination.page)}
      />
    );
  }

  if (showForm) {
    return (
      <ExamForm
        exam={selectedExam}
        onClose={(refresh) => {
          setShowForm(false);
          setSelectedExam(null);
          if (refresh) fetchExams(pagination.page);
        }}
      />
    );
  }

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>📖 Exams & Results</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Manage examinations, schedules and results
          </p>
        </div>
        {isPrincipalOrTeacher && (
          <Button
            icon="+"
            onClick={() => { setSelectedExam(null); setShowForm(true); }}
          >
            Create Exam
          </Button>
        )}
      </div>

      {/* ── Alerts ── */}
      {error   && <Alert type="error"   message={error}   dismissible autoClose={5000} onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible autoClose={4000} onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* ── Summary Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: 'Total Exams',     value: pagination.total, icon: '📋', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Upcoming',        value: exams.filter((e) => e.status === 'upcoming').length,  icon: '📅', color: '#d97706', bg: '#fef9c3' },
          { label: 'Ongoing',         value: exams.filter((e) => e.status === 'ongoing').length,   icon: '✏️', color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Results Published', value: exams.filter((e) => e.status === 'published').length, icon: '✅', color: '#16a34a', bg: '#dcfce7' },
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
              <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 16, marginBottom: 20,
      }}>
        <SearchBox
          placeholder="Search exams by name, type..."
          value={search}
          onChange={setSearch}
          onSearch={() => fetchExams(1)}
          onClear={() => { setSearch(''); fetchExams(1); }}
          filters={[{
            name   : 'status',
            label  : 'Status',
            options: [
              { value: 'upcoming',  label: 'Upcoming'  },
              { value: 'ongoing',   label: 'Ongoing'   },
              { value: 'completed', label: 'Completed' },
              { value: 'published', label: 'Published' },
            ],
          }]}
          filterValues={{ status: filterStatus }}
          onFilterChange={(name, val) => setFilterStatus(val)}
        />
      </div>

      {/* ── Exam Cards Grid ── */}
      {loading ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <Loading text="Loading exams..." />
        </div>
      ) : exams.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 60, textAlign: 'center', color: '#94a3b8',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 6px' }}>No exams found</p>
          <p style={{ fontSize: 14, margin: 0 }}>
            {isPrincipalOrTeacher ? 'Create your first exam to get started.' : 'No exams scheduled yet.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))',
          gap: 20,
        }}>
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              isPrincipalOrTeacher={isPrincipalOrTeacher}
              fmtDate={fmtDate}
              examTypeIcon={examTypeIcon}
              onView={() => setViewResults(exam)}
              onEdit={() => { setSelectedExam(exam); setShowForm(true); }}
              onDelete={() => setDeleteConfirm(exam)}
              onPublish={() => setPublishConfirm(exam)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          pageSize={pagination.limit}
          onPageChange={(p) => fetchExams(p)}
          style={{ marginTop: 20 }}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteConfirm && (
        <ConfirmModal
          icon="🗑️"
          title="Delete Exam?"
          message={<>Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? All associated results and schedules will be permanently removed.</>}
          confirmLabel="Delete"
          confirmVariant="danger"
          loading={actionLoading === 'delete'}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* ── Publish Modal ── */}
      {publishConfirm && (
        <ConfirmModal
          icon="📢"
          title="Publish Results?"
          message={<>Publish results for <strong>"{publishConfirm.name}"</strong>? Students and parents will be able to see their results immediately.</>}
          confirmLabel="Publish Results"
          confirmVariant="success"
          loading={actionLoading === 'publish'}
          onConfirm={handlePublish}
          onCancel={() => setPublishConfirm(null)}
        />
      )}
    </div>
  );
};

/* ─── Exam Card ──────────────────────────────────────────── */
const ExamCard = ({
  exam, isPrincipalOrTeacher, fmtDate, examTypeIcon,
  onView, onEdit, onDelete, onPublish,
}) => {
  const statusMap = {
    upcoming : { bg: '#fef9c3', color: '#854d0e', border: '#fde68a' },
    ongoing  : { bg: '#f5f3ff', color: '#5b21b6', border: '#ddd6fe' },
    completed: { bg: '#f0f9ff', color: '#075985', border: '#bae6fd' },
    published: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
    draft    : { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
  };
  const st = statusMap[exam.status] || statusMap.draft;

  return (
    <div style={{
      background: 'white', borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: `1px solid ${st.border}`,
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
      {/* Top strip */}
      <div style={{ height: 5, background: st.color }} />

      <div style={{ padding: 20 }}>
        {/* Title row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: st.bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>
              {examTypeIcon(exam.type)}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                {exam.name}
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>
                {exam.type ? exam.type.charAt(0).toUpperCase() + exam.type.slice(1) + ' Exam' : 'Exam'}
              </p>
            </div>
          </div>
          <span style={{
            background: st.bg, color: st.color,
            padding: '3px 10px', borderRadius: 12,
            fontSize: 11, fontWeight: 700,
            textTransform: 'capitalize',
          }}>
            {exam.status || 'Draft'}
          </span>
        </div>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            { icon: '📅', label: 'Start',   value: fmtDate(exam.startDate) },
            { icon: '🏁', label: 'End',     value: fmtDate(exam.endDate)   },
            { icon: '🏫', label: 'Class',   value: exam.className || exam.class || '—' },
            { icon: '📊', label: 'Max Marks', value: exam.totalMarks || '—' },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13,
            }}>
              <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                {icon} {label}
              </span>
              <span style={{ fontWeight: 600, color: '#374151' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={onView}
            style={{
              flex: 1, background: st.bg, color: st.color,
              border: `1px solid ${st.border}`, padding: '8px 0',
              borderRadius: 8, cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
            }}
          >
            {exam.status === 'published' ? '📊 View Results' : '📋 Details'}
          </button>
          {isPrincipalOrTeacher && (
            <>
              {exam.status === 'completed' && (
                <button
                  onClick={onPublish}
                  style={{
                    background: '#dcfce7', color: '#166534',
                    border: '1px solid #bbf7d0', padding: '8px 12px',
                    borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  }}
                >
                  📢 Publish
                </button>
              )}
              <button
                onClick={onEdit}
                style={{
                  background: '#f8fafc', color: '#475569',
                  border: '1px solid #e2e8f0', padding: '8px 12px',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13,
                }}
              >
                ✏️
              </button>
              <button
                onClick={onDelete}
                style={{
                  background: '#fff1f2', color: '#be123c',
                  border: '1px solid #fecdd3', padding: '8px 12px',
                  borderRadius: 8, cursor: 'pointer', fontSize: 13,
                }}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Confirm Modal ──────────────────────────────────────── */
const ConfirmModal = ({
  icon, title, message,
  confirmLabel, confirmVariant = 'danger',
  loading, onConfirm, onCancel,
}) => {
  const variantColor = {
    danger : '#dc2626', success: '#16a34a',
    primary: '#2563eb', warning: '#d97706',
  };
  const color = variantColor[confirmVariant] || variantColor.danger;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }}>
      <div style={{
        background: 'white', borderRadius: 14, padding: 36,
        maxWidth: 440, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.2s ease',
      }}>
        <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 16 }}>{icon}</div>
        <h3 style={{ textAlign: 'center', margin: '0 0 10px', fontSize: 19, fontWeight: 700 }}>
          {title}
        </h3>
        <p style={{
          textAlign: 'center', color: '#64748b',
          fontSize: 14, marginBottom: 28, lineHeight: 1.6,
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            style={{ background: color, borderColor: color }}
          >
            {confirmLabel}
          </Button>
        </div>
        <style>{`@keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>
      </div>
    </div>
  );
};

export { ConfirmModal };
export default ExamList;
