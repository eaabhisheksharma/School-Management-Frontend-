import React, { useState, useEffect, useCallback } from 'react';
import {
  getTimetables,
  deleteTimetable,
  publishTimetable,
  copyTimetable,
} from '../../api/timetableApi';
import { getClasses } from '../../api/classApi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import TimetableGrid from './TimetableGrid';
import TimetableForm from './TimetableForm';

const DAYS    = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const PERIODS = [1,2,3,4,5,6,7,8];

const TimetableView = ({ userRole }) => {
  const [timetables, setTimetables]   = useState([]);
  const [classes, setClasses]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedAcYear, setSelectedAcYear]   = useState(
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  );
  const [viewMode, setViewMode]       = useState('grid');   // 'grid' | 'list'
  const [activeTab, setActiveTab]     = useState('class');  // 'class' | 'teacher' | 'master'
  const [showForm, setShowForm]       = useState(false);
  const [editEntry, setEditEntry]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting]       = useState(false);
  const [publishing, setPublishing]   = useState(false);
  const [copying, setCopying]         = useState(false);
  const [currentTimetable, setCurrentTimetable] = useState(null);

  const isPrincipalOrTeacher = ['principal','teacher'].includes(userRole);
  const isPrincipal          = userRole === 'principal';

  /* ─── fetch ──────────────────────────────────────────── */
  const fetchTimetables = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...(selectedClass   && { classId     : selectedClass   }),
        ...(selectedSection && { section     : selectedSection }),
        ...(selectedAcYear  && { academicYear: selectedAcYear  }),
      };
      const res = await getTimetables(params);
      setTimetables(res.data || []);
      if (res.data && res.data.length > 0) setCurrentTimetable(res.data[0]);
    } catch (err) {
      setError(err.message || 'Failed to load timetable');
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSection, selectedAcYear]);

  useEffect(() => {
    fetchTimetables();
    (async () => {
      try { const r = await getClasses(); setClasses(r.data || []); } catch { /* silent */ }
    })();
  }, [selectedClass, selectedSection, selectedAcYear]);

  /* ─── delete ─────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteTimetable(deleteConfirm.id);
      setSuccess('Timetable entry deleted');
      setDeleteConfirm(null);
      fetchTimetables();
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  /* ─── publish ─────────────────────────────────────────── */
  const handlePublish = async () => {
    if (!currentTimetable) return;
    setPublishing(true);
    try {
      await publishTimetable(currentTimetable.id);
      setSuccess('Timetable published successfully! 🎉');
      fetchTimetables();
    } catch (err) {
      setError(err.message || 'Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  /* ─── copy ───────────────────────────────────────────── */
  const handleCopy = async () => {
    if (!currentTimetable) return;
    setCopying(true);
    try {
      await copyTimetable(currentTimetable.id);
      setSuccess('Timetable copied to next week!');
      fetchTimetables();
    } catch (err) {
      setError(err.message || 'Copy failed');
    } finally {
      setCopying(false);
    }
  };

  /* ─── derived data ───────────────────────────────────── */
  // Build grid: { day: { period: entry } }
  const gridData = {};
  DAYS.forEach((d) => { gridData[d] = {}; });
  timetables.forEach((entry) => {
    if (entry.day && entry.period) {
      if (!gridData[entry.day]) gridData[entry.day] = {};
      gridData[entry.day][entry.period] = entry;
    }
  });

  const selectedClassObj = classes.find((c) => c.id === selectedClass);
  const sections = selectedClassObj?.sections || [];

  /* ─── sub-view: form ─────────────────────────────────── */
  if (showForm) {
    return (
      <TimetableForm
        entry={editEntry}
        classId={selectedClass}
        section={selectedSection}
        academicYear={selectedAcYear}
        userRole={userRole}
        onClose={(refresh) => {
          setShowForm(false);
          setEditEntry(null);
          if (refresh) fetchTimetables();
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
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>📅 Timetable</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Manage class schedules, periods and teacher assignments
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {isPrincipal && currentTimetable && (
            <>
              <Button
                variant="outline"
                loading={copying}
                onClick={handleCopy}
                icon="📋"
              >
                Copy Week
              </Button>
              {currentTimetable.status !== 'published' && (
                <Button
                  variant="success"
                  loading={publishing}
                  onClick={handlePublish}
                  icon="🚀"
                >
                  Publish
                </Button>
              )}
            </>
          )}
          {isPrincipalOrTeacher && (
            <Button
              icon="+"
              onClick={() => { setEditEntry(null); setShowForm(true); }}
            >
              Add Period
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(155px,1fr))',
        gap: 14, marginBottom: 24,
      }}>
        {[
          { label: 'Total Periods',   value: timetables.length,                                              icon: '📅', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Classes Covered', value: [...new Set(timetables.map((t) => t.classId).filter(Boolean))].length, icon: '🏫', color: '#16a34a', bg: '#dcfce7' },
          { label: 'Teachers Assigned', value: [...new Set(timetables.map((t) => t.teacherId).filter(Boolean))].length, icon: '👨‍🏫', color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Subjects Scheduled', value: [...new Set(timetables.map((t) => t.subjectId).filter(Boolean))].length, icon: '📚', color: '#d97706', bg: '#fef9c3' },
          {
            label: 'Status',
            value: currentTimetable?.status === 'published' ? 'Published' : 'Draft',
            icon: currentTimetable?.status === 'published' ? '✅' : '📝',
            color: currentTimetable?.status === 'published' ? '#16a34a' : '#d97706',
            bg: currentTimetable?.status === 'published' ? '#dcfce7' : '#fef9c3',
          },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 9, background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
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
          { key: 'class',   label: '🏫 Class View'   },
          { key: 'teacher', label: '👨‍🏫 Teacher View' },
          { key: 'master',  label: '📊 Master View'  },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{
              padding: '10px 22px', border: 'none', cursor: 'pointer',
              background: 'none',
              fontWeight: activeTab === key ? 700 : 500,
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

      {/* Filters */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 16, marginBottom: 20,
      }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Class */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              CLASS
            </label>
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection(''); }}
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

          {/* Section */}
          {sections.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                SECTION
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{
                  padding: '9px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 8, fontSize: 14, minWidth: 120,
                }}
              >
                <option value="">All Sections</option>
                {sections.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Academic Year */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              ACADEMIC YEAR
            </label>
            <select
              value={selectedAcYear}
              onChange={(e) => setSelectedAcYear(e.target.value)}
              style={{
                padding: '9px 14px', border: '1px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, minWidth: 150,
              }}
            >
              {[0, 1, -1].map((offset) => {
                const yr = new Date().getFullYear() + offset;
                const val = `${yr}-${yr + 1}`;
                return <option key={val} value={val}>{val}</option>;
              })}
            </select>
          </div>

          {/* View toggle */}
          <div style={{
            display: 'flex', marginLeft: 'auto',
            border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden',
          }}>
            {[
              { mode: 'grid', icon: '⊞', label: 'Grid' },
              { mode: 'list', icon: '☰', label: 'List' },
            ].map(({ mode, icon, label }) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{
                  padding: '9px 16px',
                  background: viewMode === mode ? '#2563eb' : 'white',
                  border: 'none', cursor: 'pointer',
                  color: viewMode === mode ? 'white' : '#64748b',
                  fontSize: 14, fontWeight: viewMode === mode ? 700 : 500,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <Loading type="skeleton" rows={8} text="Loading timetable..." />
        </div>
      ) : (
        <>
          {/* ── CLASS VIEW ── */}
          {activeTab === 'class' && (
            viewMode === 'grid' ? (
              <TimetableGrid
                gridData={gridData}
                days={DAYS}
                periods={PERIODS}
                userRole={userRole}
                selectedClass={selectedClassObj}
                onEdit={(entry) => { setEditEntry(entry); setShowForm(true); }}
                onDelete={setDeleteConfirm}
                onAddSlot={(day, period) => {
                  setEditEntry({ day, period, classId: selectedClass, section: selectedSection });
                  setShowForm(true);
                }}
              />
            ) : (
              <TimetableListView
                timetables={timetables}
                userRole={userRole}
                onEdit={(entry) => { setEditEntry(entry); setShowForm(true); }}
                onDelete={setDeleteConfirm}
              />
            )
          )}

          {/* ── TEACHER VIEW ── */}
          {activeTab === 'teacher' && (
            <TeacherTimetableView
              timetables={timetables}
              days={DAYS}
              periods={PERIODS}
              userRole={userRole}
            />
          )}

          {/* ── MASTER VIEW ── */}
          {activeTab === 'master' && (
            <MasterTimetableView
              timetables={timetables}
              classes={classes}
              days={DAYS}
              periods={PERIODS}
            />
          )}
        </>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16,
        }}>
          <div style={{
            background: 'white', borderRadius: 14, padding: 36,
            maxWidth: 400, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ textAlign: 'center', margin: '0 0 10px', fontSize: 18 }}>
              Remove Period?
            </h3>
            <p style={{
              textAlign: 'center', color: '#64748b',
              fontSize: 14, marginBottom: 28, lineHeight: 1.6,
            }}>
              Remove <strong>{deleteConfirm.subjectName || 'this period'}</strong> from{' '}
              {deleteConfirm.day} Period {deleteConfirm.period}?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */

/* ── List View ── */
const TimetableListView = ({ timetables, userRole, onEdit, onDelete }) => {
  const isPrincipalOrTeacher = ['principal','teacher'].includes(userRole);
  const grouped = {};
  timetables.forEach((t) => {
    const day = t.day || 'Unknown';
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(t);
  });
  const DAYS_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const sortedDays = DAYS_ORDER.filter((d) => grouped[d]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {sortedDays.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 60, textAlign: 'center', color: '#94a3b8',
        }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>📅</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>No timetable entries found</p>
        </div>
      ) : sortedDays.map((day) => (
        <div key={day} style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          {/* Day header */}
          <div style={{
            background: 'linear-gradient(90deg,#2563eb,#1d4ed8)',
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>📆</span>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{day}</span>
            <span style={{
              marginLeft: 8, background: 'rgba(255,255,255,0.2)',
              color: 'white', fontSize: 11, fontWeight: 700,
              padding: '2px 8px', borderRadius: 10,
            }}>
              {grouped[day].length} periods
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Period','Time','Subject','Teacher','Room','Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grouped[day]
                .sort((a, b) => (a.period || 0) - (b.period || 0))
                .map((entry, i) => (
                  <tr key={entry.id || i}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        background: '#eff6ff', color: '#2563eb',
                        padding: '3px 9px', borderRadius: 6,
                        fontSize: 12, fontWeight: 700,
                      }}>
                        P{entry.period}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: '#64748b' }}>
                      {entry.startTime || '—'}{entry.endTime ? ` – ${entry.endTime}` : ''}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                        {entry.subjectName || entry.subject?.name || '—'}
                      </div>
                      {entry.subjectCode && (
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{entry.subjectCode}</div>
                      )}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: '#475569', fontWeight: 500 }}>
                      {entry.teacherName || entry.teacher?.name || '—'}
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 13, color: '#64748b' }}>
                      {entry.room || entry.roomNo || '—'}
                    </td>
                    <td style={{ padding: '11px 16px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isPrincipalOrTeacher && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => onEdit(entry)} style={{
                            background: '#f8fafc', color: '#475569',
                            border: '1px solid #e2e8f0', padding: '5px 10px',
                            borderRadius: 6, cursor: 'pointer', fontSize: 12,
                          }}>✏️</button>
                          <button onClick={() => onDelete(entry)} style={{
                            background: '#fff1f2', color: '#be123c',
                            border: '1px solid #fecdd3', padding: '5px 10px',
                            borderRadius: 6, cursor: 'pointer', fontSize: 12,
                          }}>🗑️</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

/* ── Teacher Timetable View ── */
const TeacherTimetableView = ({ timetables, days, periods, userRole }) => {
  const teacherMap = {};
  timetables.forEach((t) => {
    const tName = t.teacherName || t.teacher?.name || 'Unknown';
    if (!teacherMap[tName]) teacherMap[tName] = {};
    const key = `${t.day}_${t.period}`;
    teacherMap[tName][key] = t;
  });

  const teachers = Object.keys(teacherMap);
  if (teachers.length === 0) return (
    <div style={{
      background: 'white', borderRadius: 10,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      padding: 60, textAlign: 'center', color: '#94a3b8',
    }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>👨‍🏫</div>
      <p style={{ fontWeight: 600, fontSize: 16 }}>No teacher assignments found</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {teachers.map((tName) => (
        <div key={tName} style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          <div style={{
            background: 'linear-gradient(90deg,#7c3aed,#6d28d9)',
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: 'white',
            }}>
              {tName.charAt(0).toUpperCase()}
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{tName}</span>
            <span style={{
              marginLeft: 8, background: 'rgba(255,255,255,0.2)',
              color: 'white', fontSize: 11, fontWeight: 700,
              padding: '2px 8px', borderRadius: 10,
            }}>
              {Object.keys(teacherMap[tName]).length} periods/week
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase' }}>
                    Period
                  </th>
                  {days.map((d) => (
                    <th key={d} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', textTransform: 'uppercase', textAlign: 'center' }}>
                      {d.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => (
                  <tr key={p} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        background: '#f5f3ff', color: '#7c3aed',
                        padding: '3px 9px', borderRadius: 6,
                        fontSize: 12, fontWeight: 700,
                      }}>
                        P{p}
                      </span>
                    </td>
                    {days.map((d) => {
                      const entry = teacherMap[tName][`${d}_${p}`];
                      return (
                        <td key={d} style={{ padding: '8px 12px', textAlign: 'center' }}>
                          {entry ? (
                            <div style={{
                              background: '#f5f3ff', borderRadius: 8,
                              padding: '6px 10px', border: '1px solid #e9d5ff',
                            }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>
                                {entry.subjectName || entry.subject?.name || '—'}
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                                {entry.className || '—'}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#e2e8f0', fontSize: 18 }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Master Timetable View ── */
const MasterTimetableView = ({ timetables, classes, days, periods }) => {
  const [selectedDay, setSelectedDay] = useState(days[0]);

  const dayEntries = timetables.filter((t) => t.day === selectedDay);
  const classIds   = [...new Set(dayEntries.map((t) => t.classId).filter(Boolean))];

  return (
    <div style={{
      background: 'white', borderRadius: 10,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
    }}>
      {/* Day tabs */}
      <div style={{
        display: 'flex', background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0', overflowX: 'auto',
      }}>
        {days.map((d) => (
          <button key={d} onClick={() => setSelectedDay(d)}
            style={{
              padding: '12px 18px', border: 'none', cursor: 'pointer',
              background: selectedDay === d ? 'white' : 'transparent',
              fontWeight: selectedDay === d ? 700 : 500,
              color: selectedDay === d ? '#2563eb' : '#64748b',
              borderBottom: selectedDay === d ? '2px solid #2563eb' : '2px solid transparent',
              fontSize: 13, whiteSpace: 'nowrap',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', minWidth: 80 }}>
                Period
              </th>
              {classIds.length > 0
                ? classIds.map((cid) => {
                    const cls = classes.find((c) => c.id === cid);
                    return (
                      <th key={cid} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', textAlign: 'center', minWidth: 140 }}>
                        {cls?.name || cid}
                      </th>
                    );
                  })
                : <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>No classes</th>}
            </tr>
          </thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    background: '#eff6ff', color: '#2563eb',
                    padding: '4px 10px', borderRadius: 6,
                    fontSize: 12, fontWeight: 700,
                  }}>
                    Period {p}
                  </span>
                </td>
                {classIds.map((cid) => {
                  const entry = dayEntries.find(
                    (t) => t.classId === cid && t.period === p
                  );
                  return (
                    <td key={cid} style={{ padding: '8px 12px', textAlign: 'center' }}>
                      {entry ? (
                        <div style={{
                          background: `hsl(${(entry.subjectId || 0) * 47 % 360},70%,95%)`,
                          borderRadius: 8, padding: '8px 10px',
                          border: `1px solid hsl(${(entry.subjectId || 0) * 47 % 360},60%,85%)`,
                        }}>
                          <div style={{
                            fontSize: 12, fontWeight: 700,
                            color: `hsl(${(entry.subjectId || 0) * 47 % 360},60%,30%)`,
                          }}>
                            {entry.subjectName || entry.subject?.name || '—'}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            {entry.teacherName
                              ? entry.teacherName.split(' ').slice(-1)[0]
                              : '—'}
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          height: 40, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#e2e8f0',
                        }}>
                          <span style={{ fontSize: 18 }}>—</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableView;
