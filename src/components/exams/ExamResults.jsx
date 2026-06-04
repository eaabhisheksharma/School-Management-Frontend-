import React, { useState, useEffect } from 'react';
import {
  getExamResults,
  getExamById,
  generateReportCard,
} from '../../api/examApi';
import { getClassStudents } from '../../api/classApi';
import Button from '../common/Button';
import Badge, { statusVariant } from '../common/Badge';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import Pagination from '../common/Pagination';
import ResultEntry from './ResultEntry';

const ExamResults = ({ exam, userRole, onBack, onRefresh }) => {
  const [results, setResults]         = useState([]);
  const [examDetails, setExamDetails] = useState(exam || null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [activeTab, setActiveTab]     = useState('results');
  const [showEntry, setShowEntry]     = useState(false);
  const [pagination, setPagination]   = useState({
    page: 1, limit: 20, total: 0, pages: 1,
  });
  const [downloadingId, setDownloadingId] = useState(null);
  const [search, setSearch]           = useState('');

  const isPrincipalOrTeacher = ['principal', 'teacher'].includes(userRole);

  /* ─── init ───────────────────────────────────────────── */
  useEffect(() => {
    fetchDetails();
    fetchResults(1);
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await getExamById(exam.id);
      setExamDetails(res.data || exam);
    } catch { setExamDetails(exam); }
  };

  const fetchResults = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await getExamResults(exam.id, { page, limit: 20 });
      setResults(res.data || []);
      if (res.pagination) setPagination((p) => ({ ...p, ...res.pagination, page }));
    } catch (err) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  /* ─── download report card ───────────────────────────── */
  const handleDownloadReportCard = async (studentId, studentName) => {
    setDownloadingId(studentId);
    try {
      const blob = await generateReportCard(exam.id, studentId);
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `report-card-${studentName.replace(/\s+/g, '-')}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate report card: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  /* ─── helpers ────────────────────────────────────────── */
  const getGrade = (marks, total) => {
    if (!marks || !total) return '—';
    const pct = (marks / total) * 100;
    if (pct >= 90) return { grade: 'A+', color: '#16a34a' };
    if (pct >= 80) return { grade: 'A',  color: '#2563eb' };
    if (pct >= 70) return { grade: 'B',  color: '#0891b2' };
    if (pct >= 60) return { grade: 'C',  color: '#d97706' };
    if (pct >= 50) return { grade: 'D',  color: '#ea580c' };
    return { grade: 'F', color: '#dc2626' };
  };

  const calcStats = () => {
    if (!results.length) return null;
    const passed    = results.filter((r) =>
      r.marks >= (examDetails?.passingMarks || 0)
    ).length;
    const marks     = results.map((r) => r.marks || 0);
    const highest   = Math.max(...marks);
    const lowest    = Math.min(...marks);
    const average   = (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1);
    const passRate  = ((passed / results.length) * 100).toFixed(1);
    return { passed, failed: results.length - passed, highest, lowest, average, passRate };
  };

  const stats         = calcStats();
  const filteredResults = results.filter((r) =>
    (r.studentName || '').toLowerCase().includes(search.toLowerCase())
  );

  /* ─── result entry sub-view ──────────────────────────── */
  if (showEntry) {
    return (
      <ResultEntry
        exam={examDetails}
        onClose={(refresh) => {
          setShowEntry(false);
          if (refresh) { fetchResults(pagination.page); onRefresh && onRefresh(); }
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
        alignItems: 'flex-start', marginBottom: 24,
      }}>
        <div>
          <button onClick={onBack}
            style={{
              background: 'none', border: 'none', color: '#2563eb',
              cursor: 'pointer', fontSize: 14, padding: '0 0 8px',
            }}
          >
            ← Back to Exams
          </button>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            📊 {examDetails?.name || 'Exam Results'}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {examDetails?.className || ''} •{' '}
            {examDetails?.type
              ? examDetails.type.charAt(0).toUpperCase() + examDetails.type.slice(1)
              : ''} Exam
            {examDetails?.status && (
              <Badge
                variant={statusVariant(examDetails.status)}
                style={{ marginLeft: 10 }}
              >
                {examDetails.status}
              </Badge>
            )}
          </p>
        </div>
        {isPrincipalOrTeacher && (
          <Button icon="✏️" onClick={() => setShowEntry(true)}>
            Enter / Edit Results
          </Button>
        )}
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* Stats cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
          gap: 16, marginBottom: 24,
        }}>
          {[
            { label: 'Total Students', value: results.length,      icon: '👥', color: '#2563eb', bg: '#eff6ff'  },
            { label: 'Passed',         value: stats.passed,        icon: '✅', color: '#16a34a', bg: '#dcfce7'  },
            { label: 'Failed',         value: stats.failed,        icon: '❌', color: '#dc2626', bg: '#fee2e2'  },
            { label: 'Pass Rate',      value: `${stats.passRate}%`,icon: '📊', color: '#7c3aed', bg: '#f5f3ff'  },
            { label: 'Average Marks',  value: stats.average,       icon: '📈', color: '#0891b2', bg: '#e0f2fe'  },
            { label: 'Highest Marks',  value: stats.highest,       icon: '🏆', color: '#d97706', bg: '#fef9c3'  },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 9,
                background: bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: '2px solid #f1f5f9',
      }}>
        {[
          { key: 'results',   label: '📋 Results'    },
          { key: 'analytics', label: '📊 Analytics'  },
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

      {/* ══════ RESULTS TABLE TAB ══════ */}
      {activeTab === 'results' && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          {/* Search row */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <input
              type="text"
              placeholder="🔍 Search student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '9px 14px', border: '1.5px solid #e2e8f0',
                borderRadius: 8, fontSize: 14, width: 300, outline: 'none',
              }}
            />
          </div>

          {loading ? (
            <Loading text="Loading results..." />
          ) : filteredResults.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
              <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 6px' }}>No results yet</p>
              {isPrincipalOrTeacher && (
                <p style={{ fontSize: 14, margin: 0 }}>
                  Click "Enter / Edit Results" to add marks.
                </p>
              )}
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['#', 'Student', 'Roll No', 'Marks', 'Grade', 'Status', 'Remarks', 'Report Card'].map((h) => (
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
                    {filteredResults
                      .sort((a, b) => (b.marks || 0) - (a.marks || 0))
                      .map((result, idx) => {
                        const gradeInfo = getGrade(result.marks, examDetails?.totalMarks);
                        const passed    = result.marks >= (examDetails?.passingMarks || 0);
                        return (
                          <tr
                            key={result.id || idx}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              background: !passed && result.marks !== undefined
                                ? '#fff5f5' : 'white',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                !passed && result.marks !== undefined ? '#fff5f5' : 'white';
                            }}
                          >
                            {/* Rank */}
                            <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8' }}>
                              {idx < 3 ? ['🥇','🥈','🥉'][idx] : idx + 1}
                            </td>

                            {/* Student */}
                            <td style={{ padding: '13px 16px' }}>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>
                                {result.studentName || '—'}
                              </div>
                            </td>

                            {/* Roll No */}
                            <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b' }}>
                              {result.rollNo || '—'}
                            </td>

                            {/* Marks */}
                            <td style={{ padding: '13px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                                  {result.marks ?? '—'}
                                </span>
                                {examDetails?.totalMarks && result.marks !== undefined && (
                                  <>
                                    <span style={{ color: '#94a3b8', fontSize: 13 }}>
                                      / {examDetails.totalMarks}
                                    </span>
                                    <span style={{ fontSize: 12, color: '#64748b' }}>
                                      ({((result.marks / examDetails.totalMarks) * 100).toFixed(1)}%)
                                    </span>
                                  </>
                                )}
                              </div>
                              {/* Mini progress bar */}
                              {examDetails?.totalMarks && result.marks !== undefined && (
                                <div style={{
                                  marginTop: 4, height: 4,
                                  background: '#f1f5f9', borderRadius: 99, overflow: 'hidden',
                                  width: 100,
                                }}>
                                  <div style={{
                                    width: `${Math.min((result.marks / examDetails.totalMarks) * 100, 100)}%`,
                                    height: '100%',
                                    background: passed ? '#16a34a' : '#dc2626',
                                    borderRadius: 99,
                                  }} />
                                </div>
                              )}
                            </td>

                            {/* Grade */}
                            <td style={{ padding: '13px 16px' }}>
                              {typeof gradeInfo === 'object' ? (
                                <span style={{
                                  fontSize: 15, fontWeight: 800,
                                  color: gradeInfo.color,
                                }}>
                                  {gradeInfo.grade}
                                </span>
                              ) : '—'}
                            </td>

                            {/* Pass/Fail */}
                            <td style={{ padding: '13px 16px' }}>
                              {result.marks !== undefined ? (
                                <Badge variant={passed ? 'success' : 'danger'} dot>
                                  {passed ? 'Pass' : 'Fail'}
                                </Badge>
                              ) : (
                                <Badge variant="default">Pending</Badge>
                              )}
                            </td>

                            {/* Remarks */}
                            <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b', maxWidth: 150 }}>
                              {result.remarks || '—'}
                            </td>

                            {/* Report Card */}
                            <td style={{ padding: '13px 16px' }}>
                              {examDetails?.status === 'published' && (
                                <button
                                  onClick={() => handleDownloadReportCard(result.studentId, result.studentName)}
                                  disabled={downloadingId === result.studentId}
                                  style={{
                                    background: '#eff6ff', color: '#2563eb',
                                    border: 'none', padding: '6px 12px',
                                    borderRadius: 6, cursor: downloadingId === result.studentId ? 'wait' : 'pointer',
                                    fontSize: 12, fontWeight: 600,
                                  }}
                                >
                                  {downloadingId === result.studentId ? '⏳' : '⬇️ PDF'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                pageSize={pagination.limit}
                onPageChange={(p) => fetchResults(p)}
                style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9' }}
              />
            </>
          )}
        </div>
      )}

      {/* ══════ ANALYTICS TAB ══════ */}
      {activeTab === 'analytics' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Pass / Fail Donut */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
              Pass / Fail Distribution
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
              {/* Donut (CSS) */}
              <div style={{ position: 'relative', width: 120, height: 120 }}>
                <svg viewBox="0 0 42 42" style={{ width: 120, height: 120 }}>
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#fee2e2" strokeWidth="6" />
                  <circle
                    cx="21" cy="21" r="15.9" fill="none"
                    stroke="#16a34a" strokeWidth="6"
                    strokeDasharray={`${(stats.passed / results.length) * 100} ${100 - (stats.passed / results.length) * 100}`}
                    strokeDashoffset="25"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#16a34a' }}>
                    {stats.passRate}%
                  </span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Pass</span>
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Passed', value: stats.passed,            color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Failed', value: stats.failed,            color: '#dc2626', bg: '#fee2e2' },
                  { label: 'Total',  value: results.length,           color: '#2563eb', bg: '#eff6ff' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 12, height: 12, borderRadius: 3, background: color,
                    }} />
                    <span style={{ fontSize: 14, color: '#475569' }}>{label}:</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
              Grade Distribution
            </h3>
            {['A+','A','B','C','D','F'].map((grade) => {
              const gradeRanges = {
                'A+': [90,100], A:[80,89], B:[70,79],
                C:[60,69], D:[50,59], F:[0,49],
              };
              const [min, max] = gradeRanges[grade];
              const count = results.filter((r) => {
                if (!r.marks || !examDetails?.totalMarks) return false;
                const pct = (r.marks / examDetails.totalMarks) * 100;
                return pct >= min && pct <= max;
              }).length;
              const pct = results.length > 0
                ? ((count / results.length) * 100).toFixed(0) : 0;

              const gradeColor = {
                'A+':'#16a34a', A:'#2563eb', B:'#0891b2',
                C:'#d97706', D:'#ea580c', F:'#dc2626',
              };

              return (
                <div key={grade} style={{ marginBottom: 12 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: 5, fontSize: 13,
                  }}>
                    <span style={{ fontWeight: 700, color: gradeColor[grade] }}>
                      Grade {grade}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {count} students ({pct}%)
                    </span>
                  </div>
                  <div style={{
                    background: '#f1f5f9', borderRadius: 99,
                    height: 8, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: gradeColor[grade], borderRadius: 99,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Performers */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
            gridColumn: '1 / -1',
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
              🏆 Top 5 Performers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[...results]
                .sort((a, b) => (b.marks || 0) - (a.marks || 0))
                .slice(0, 5)
                .map((r, i) => {
                  const pct = examDetails?.totalMarks
                    ? ((r.marks / examDetails.totalMarks) * 100).toFixed(1) : 0;
                  return (
                    <div key={r.id || i} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', background: '#f8fafc',
                      borderRadius: 8,
                    }}>
                      <div style={{ fontSize: 22 }}>
                        {['🥇','🥈','🥉','4️⃣','5️⃣'][i]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {r.studentName}
                        </div>
                        <div style={{
                          marginTop: 4, height: 6,
                          background: '#e2e8f0', borderRadius: 99, overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${pct}%`, height: '100%',
                            background: ['#f59e0b','#94a3b8','#92400e','#0ea5e9','#7c3aed'][i],
                            borderRadius: 99,
                          }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                          {r.marks} / {examDetails?.totalMarks || '?'}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{pct}%</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
