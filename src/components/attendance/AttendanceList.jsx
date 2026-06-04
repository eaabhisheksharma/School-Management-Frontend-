import React, { useState, useEffect, useCallback } from 'react';
import {
  getAttendance,
  getClassAttendance,
  getAttendanceDefaulters,
} from '../../api/attendanceApi';
import { getClasses } from '../../api/classApi';
import AttendanceForm from './AttendanceForm';
import AttendanceReport from './AttendanceReport';

const AttendanceList = ({ userRole }) => {
  const [attendance, setAttendance]     = useState([]);
  const [classes, setClasses]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [activeTab, setActiveTab]       = useState('list');
  const [filterClass, setFilterClass]   = useState('');
  const [filterDate, setFilterDate]     = useState(
    new Date().toISOString().split('T')[0]
  );
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination]     = useState({
    page: 1, limit: 20, total: 0, pages: 1,
  });
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [summaryStats, setSummaryStats] = useState(null);

  const isTeacherOrPrincipal = ['teacher', 'principal'].includes(userRole);

  /* ─── fetch classes dropdown ─────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await getClasses();
        setClasses(res.data || []);
      } catch { /* silent */ }
    })();
  }, []);

  /* ─── fetch attendance records ───────────────────────── */
  const fetchAttendance = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (filterClass && filterDate) {
        res = await getClassAttendance(filterClass, filterDate);
        const records = res.data || [];
        setAttendance(records);
        // compute quick stats
        const present = records.filter((r) => r.status === 'present').length;
        const absent  = records.filter((r) => r.status === 'absent').length;
        const late    = records.filter((r) => r.status === 'late').length;
        setSummaryStats({ total: records.length, present, absent, late });
      } else {
        res = await getAttendance({
          page, limit: pagination.limit,
          ...(filterClass  && { classId: filterClass }),
          ...(filterDate   && { date: filterDate }),
          ...(filterStatus && { status: filterStatus }),
        });
        setAttendance(res.data || []);
        if (res.pagination) setPagination((p) => ({ ...p, ...res.pagination }));
        setSummaryStats(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, [filterClass, filterDate, filterStatus, pagination.limit]);

  useEffect(() => { fetchAttendance(1); }, [filterClass, filterDate, filterStatus]);

  /* ─── status badge ───────────────────────────────────── */
  const statusBadge = (status) => {
    const map = {
      present : { bg: '#dcfce7', color: '#166534', label: 'Present' },
      absent  : { bg: '#fee2e2', color: '#991b1b', label: 'Absent'  },
      late    : { bg: '#fef9c3', color: '#854d0e', label: 'Late'    },
      halfday : { bg: '#e0f2fe', color: '#075985', label: 'Half Day'},
    };
    const s = map[status] || { bg: '#f1f5f9', color: '#475569', label: status || '—' };
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

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : '—';

  /* ─── show sub-views ─────────────────────────────────── */
  if (showMarkForm) {
    return (
      <AttendanceForm
        classes={classes}
        onClose={(refresh) => {
          setShowMarkForm(false);
          if (refresh) fetchAttendance(pagination.page);
        }}
      />
    );
  }

  if (activeTab === 'report') {
    return (
      <AttendanceReport
        classes={classes}
        userRole={userRole}
        onBack={() => setActiveTab('list')}
      />
    );
  }

  /* ─── main render ────────────────────────────────────── */
  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>📋 Attendance</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Track and manage student attendance records
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setActiveTab('report')}
            style={{
              background: '#f1f5f9', color: '#475569', border: 'none',
              padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
              fontWeight: 600, fontSize: 14,
            }}
          >
            📊 Reports
          </button>
          {isTeacherOrPrincipal && (
            <button
              onClick={() => setShowMarkForm(true)}
              style={{
                background: '#2563eb', color: 'white', border: 'none',
                padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
                fontWeight: 600, fontSize: 14,
              }}
            >
              + Mark Attendance
            </button>
          )}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: '#fee2e2', color: '#991b1b', padding: '12px 16px',
          borderRadius: 8, marginBottom: 20, fontSize: 14,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Summary Stats (when class+date selected) ── */}
      {summaryStats && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16, marginBottom: 20,
        }}>
          {[
            { label: 'Total',   value: summaryStats.total,   color: '#2563eb', bg: '#eff6ff'  },
            { label: 'Present', value: summaryStats.present, color: '#16a34a', bg: '#dcfce7'  },
            { label: 'Absent',  value: summaryStats.absent,  color: '#dc2626', bg: '#fee2e2'  },
            { label: 'Late',    value: summaryStats.late,    color: '#d97706', bg: '#fef9c3'  },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              padding: 20, display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color,
              }}>
                {label === 'Total' ? '👥' : label === 'Present' ? '✅' : label === 'Absent' ? '❌' : '⏰'}
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 20, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>DATE</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 160,
              }}
            />
          </div>

          {/* Class */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>CLASS</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 160,
              }}
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>STATUS</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 150,
              }}
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="halfday">Half Day</option>
            </select>
          </div>

          {(filterClass || filterStatus) && (
            <button
              onClick={() => { setFilterClass(''); setFilterStatus(''); }}
              style={{
                padding: '9px 16px', background: '#f1f5f9',
                border: 'none', borderRadius: 8,
                cursor: 'pointer', fontSize: 14, color: '#475569',
                marginTop: 22,
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Loading attendance records...
          </div>
        ) : attendance.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>No records found</p>
            <p style={{ fontSize: 14 }}>
              {isTeacherOrPrincipal
                ? 'Select a class and date, or mark new attendance.'
                : 'No attendance records available.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Student', 'Class', 'Date', 'Status', 'Remarks', 'Marked By'].map((h) => (
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
                {attendance.map((rec, idx) => (
                  <tr
                    key={rec.id || idx}
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {rec.studentName || rec.student?.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        Roll: {rec.rollNo || rec.student?.rollNo || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569' }}>
                      {rec.className || rec.class?.name || 'N/A'}
                      {rec.sectionName && (
                        <span style={{ color: '#94a3b8' }}> - {rec.sectionName}</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569' }}>
                      {fmtDate(rec.date)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {statusBadge(rec.status)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>
                      {rec.remarks || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>
                      {rec.markedBy || rec.teacher?.name || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && !filterClass && pagination.pages > 1 && (
          <div style={{
            padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid #f1f5f9',
          }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              Page {pagination.page} of {pagination.pages} ({pagination.total} records)
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchAttendance(pagination.page - 1)}
                style={{
                  padding: '6px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 6, cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  background: 'white', fontSize: 13,
                  opacity: pagination.page === 1 ? 0.5 : 1,
                }}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchAttendance(p)}
                  style={{
                    padding: '6px 12px', border: '1px solid #e2e8f0',
                    borderRadius: 6, cursor: 'pointer', fontSize: 13,
                    background: pagination.page === p ? '#2563eb' : 'white',
                    color: pagination.page === p ? 'white' : '#475569',
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => fetchAttendance(pagination.page + 1)}
                style={{
                  padding: '6px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                  background: 'white', fontSize: 13,
                  opacity: pagination.page === pagination.pages ? 0.5 : 1,
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;
