import React, { useState, useEffect } from 'react';
import {
  getDailyReport,
  getMonthlyReport,
  getAttendanceDefaulters,
  getStudentReport,
} from '../../api/attendanceApi';
import { getClasses } from '../../api/classApi';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const AttendanceReport = ({ classes: classesProp, userRole, onBack }) => {
  const [reportType, setReportType]   = useState('daily');   // daily | monthly | defaulters | student
  const [classes, setClasses]         = useState(classesProp || []);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate]               = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth]             = useState(new Date().getMonth() + 1);
  const [year, setYear]               = useState(new Date().getFullYear());
  const [studentId, setStudentId]     = useState('');
  const [threshold, setThreshold]     = useState(75);
  const [reportData, setReportData]   = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [generated, setGenerated]     = useState(false);

  useEffect(() => {
    if (!classesProp || classesProp.length === 0) {
      (async () => {
        try {
          const res = await getClasses();
          setClasses(res.data || []);
        } catch { /* silent */ }
      })();
    }
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError('');
    setReportData(null);
    setGenerated(false);

    try {
      let res;
      switch (reportType) {
        case 'daily':
          res = await getDailyReport({
            date,
            ...(selectedClass && { classId: selectedClass }),
          });
          break;
        case 'monthly':
          res = await getMonthlyReport({
            month, year,
            ...(selectedClass && { classId: selectedClass }),
          });
          break;
        case 'defaulters':
          res = await getAttendanceDefaulters({
            threshold,
            month, year,
            ...(selectedClass && { classId: selectedClass }),
          });
          break;
        case 'student':
          if (!studentId) throw new Error('Please enter a Student ID');
          res = await getStudentReport(studentId, { month, year });
          break;
        default:
          break;
      }
      setReportData(res?.data || res || null);
      setGenerated(true);
    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  /* ─── helpers ────────────────────────────────────────── */
  const pct = (val, total) =>
    total > 0 ? `${((val / total) * 100).toFixed(1)}%` : '0%';

  const pctNum = (val, total) =>
    total > 0 ? ((val / total) * 100).toFixed(1) : 0;

  const ProgressBar = ({ value, max, color = '#2563eb' }) => {
    const pctVal = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
      <div style={{
        background: '#f1f5f9', borderRadius: 99, height: 8,
        overflow: 'hidden', marginTop: 4,
      }}>
        <div style={{
          width: `${pctVal}%`, height: '100%',
          background: color, borderRadius: 99,
          transition: 'width 0.4s ease',
        }} />
      </div>
    );
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <button onClick={onBack}
            style={{
              background: 'none', border: 'none', color: '#2563eb',
              cursor: 'pointer', fontSize: 14, padding: '0 0 8px',
            }}
          >
            ← Back to Attendance
          </button>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>📊 Attendance Reports</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Generate detailed attendance analytics
          </p>
        </div>
      </div>

      {/* ── Report Type Tabs ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 6, width: 'fit-content',
      }}>
        {[
          { key: 'daily',      label: '📅 Daily'      },
          { key: 'monthly',    label: '📆 Monthly'    },
          { key: 'defaulters', label: '⚠️ Defaulters' },
          { key: 'student',    label: '👤 Student'    },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setReportType(key); setGenerated(false); setReportData(null); }}
            style={{
              padding: '8px 18px', border: 'none', borderRadius: 7,
              cursor: 'pointer', fontWeight: 600, fontSize: 13,
              background: reportType === key ? '#2563eb' : 'transparent',
              color: reportType === key ? 'white' : '#64748b',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Filter Panel ── */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 24, marginBottom: 24,
      }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#374151' }}>
          Report Parameters
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {/* Class filter — all except student report */}
          {reportType !== 'student' && (
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date — daily */}
          {reportType === 'daily' && (
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                Date *
              </label>
              <input
                type="date" value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              />
            </div>
          )}

          {/* Month + Year — monthly / defaulters / student */}
          {['monthly', 'defaulters', 'student'].includes(reportType) && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                  }}
                >
                  {MONTHS.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                  }}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Student ID — student report */}
          {reportType === 'student' && (
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                Student ID *
              </label>
              <input
                type="text" value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student UUID..."
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              />
            </div>
          )}

          {/* Threshold — defaulters */}
          {reportType === 'defaulters' && (
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                Min Attendance % (below this = defaulter)
              </label>
              <input
                type="number" value={threshold} min={1} max={100}
                onChange={(e) => setThreshold(Number(e.target.value))}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              />
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b', padding: '10px 14px',
            borderRadius: 8, marginTop: 16, fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <button
            onClick={generateReport}
            disabled={loading}
            style={{
              background: loading ? '#93c5fd' : '#2563eb',
              color: 'white', border: 'none', padding: '11px 28px',
              borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: 14,
            }}
          >
            {loading ? '⏳ Generating...' : '📊 Generate Report'}
          </button>
        </div>
      </div>

      {/* ══════ REPORT OUTPUT ══════ */}
      {generated && !loading && (

        /* ── Daily Report ── */
        reportType === 'daily' ? (
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                Daily Report — {new Date(date).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </h3>
            </div>

            {/* Summary pills */}
            {reportData?.summary && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                gap: 16, padding: 24,
              }}>
                {[
                  { label: 'Total',   value: reportData.summary.total,   color: '#2563eb', bg: '#eff6ff' },
                  { label: 'Present', value: reportData.summary.present, color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Absent',  value: reportData.summary.absent,  color: '#dc2626', bg: '#fee2e2' },
                  { label: 'Late',    value: reportData.summary.late,    color: '#d97706', bg: '#fef9c3' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} style={{
                    background: bg, borderRadius: 10, padding: '16px 20px',
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color }}>{value ?? 0}</div>
                    <div style={{ fontSize: 13, color, fontWeight: 600, marginTop: 4 }}>{label}</div>
                    {label !== 'Total' && (
                      <ProgressBar
                        value={value ?? 0}
                        max={reportData.summary.total ?? 1}
                        color={color}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Per-class breakdown */}
            {Array.isArray(reportData?.classes) && reportData.classes.length > 0 && (
              <div style={{ padding: '0 24px 24px' }}>
                <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>
                  Class-wise Breakdown
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Class', 'Total', 'Present', 'Absent', 'Late', 'Attendance %'].map((h) => (
                          <th key={h} style={{
                            padding: '10px 14px', textAlign: 'left',
                            fontSize: 12, fontWeight: 700, color: '#64748b',
                            textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.classes.map((cls, i) => {
                        const attendPct = pctNum(cls.present, cls.total);
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 14 }}>
                              {cls.className || cls.name}
                            </td>
                            <td style={{ padding: '12px 14px', fontSize: 14 }}>{cls.total}</td>
                            <td style={{ padding: '12px 14px', fontSize: 14, color: '#16a34a', fontWeight: 600 }}>
                              {cls.present}
                            </td>
                            <td style={{ padding: '12px 14px', fontSize: 14, color: '#dc2626', fontWeight: 600 }}>
                              {cls.absent}
                            </td>
                            <td style={{ padding: '12px 14px', fontSize: 14, color: '#d97706', fontWeight: 600 }}>
                              {cls.late}
                            </td>
                            <td style={{ padding: '12px 14px', minWidth: 140 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{
                                  fontSize: 14, fontWeight: 700,
                                  color: attendPct >= 75 ? '#16a34a' : '#dc2626',
                                }}>
                                  {attendPct}%
                                </span>
                                <div style={{
                                  flex: 1, background: '#f1f5f9',
                                  borderRadius: 99, height: 7, overflow: 'hidden',
                                }}>
                                  <div style={{
                                    width: `${attendPct}%`, height: '100%',
                                    background: attendPct >= 75 ? '#16a34a' : '#dc2626',
                                    borderRadius: 99,
                                  }} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Fallback if no structured data */}
            {!reportData?.summary && !reportData?.classes && (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p>No data available for the selected date.</p>
              </div>
            )}
          </div>

        /* ── Monthly Report ── */
        ) : reportType === 'monthly' ? (
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                Monthly Report — {MONTHS[month - 1]} {year}
              </h3>
            </div>

            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Student', 'Class', 'Total Days', 'Present', 'Absent', 'Late', 'Attendance %'].map((h) => (
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
                    {reportData.map((row, i) => {
                      const ap = pctNum(row.present, row.totalDays);
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 14 }}>
                            {row.studentName || row.name}
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>
                              Roll: {row.rollNo || '—'}
                            </div>
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                            {row.className || '—'}
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14 }}>{row.totalDays}</td>
                          <td style={{ padding: '13px 16px', fontSize: 14, color: '#16a34a', fontWeight: 600 }}>
                            {row.present}
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14, color: '#dc2626', fontWeight: 600 }}>
                            {row.absent}
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14, color: '#d97706', fontWeight: 600 }}>
                            {row.late}
                          </td>
                          <td style={{ padding: '13px 16px', minWidth: 130 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{
                                fontWeight: 700, fontSize: 14,
                                color: ap >= 75 ? '#16a34a' : '#dc2626',
                              }}>
                                {ap}%
                              </span>
                              <div style={{
                                flex: 1, background: '#f1f5f9',
                                borderRadius: 99, height: 6, overflow: 'hidden',
                              }}>
                                <div style={{
                                  width: `${ap}%`, height: '100%',
                                  background: ap >= 75 ? '#16a34a' : '#dc2626',
                                  borderRadius: 99,
                                }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p>No records for {MONTHS[month - 1]} {year}.</p>
              </div>
            )}
          </div>

        /* ── Defaulters Report ── */
        ) : reportType === 'defaulters' ? (
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                ⚠️ Defaulters — below {threshold}% — {MONTHS[month - 1]} {year}
              </h3>
              {Array.isArray(reportData) && (
                <span style={{
                  background: '#fee2e2', color: '#991b1b',
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                }}>
                  {reportData.length} defaulters
                </span>
              )}
            </div>

            {Array.isArray(reportData) && reportData.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#fff5f5' }}>
                      {['#', 'Student', 'Class', 'Present', 'Total Days', 'Attendance %', 'Contact'].map((h) => (
                        <th key={h} style={{
                          padding: '12px 16px', textAlign: 'left',
                          fontSize: 12, fontWeight: 700, color: '#991b1b',
                          textTransform: 'uppercase', borderBottom: '1px solid #fecaca',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, i) => {
                      const ap = pctNum(row.present, row.totalDays);
                      return (
                        <tr key={i} style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: ap < 50 ? '#fff5f5' : 'white',
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = ap < 50 ? '#fff5f5' : 'white'}
                        >
                          <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: 13 }}>
                            {i + 1}
                          </td>
                          <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 14 }}>
                            {row.studentName || row.name}
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>
                              {row.rollNo || '—'}
                            </div>
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                            {row.className || '—'}
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14, color: '#dc2626', fontWeight: 600 }}>
                            {row.present}
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 14 }}>{row.totalDays}</td>
                          <td style={{ padding: '13px 16px' }}>
                            <span style={{
                              fontWeight: 800, fontSize: 16,
                              color: ap < 50 ? '#dc2626' : '#d97706',
                            }}>
                              {ap}%
                            </span>
                          </td>
                          <td style={{ padding: '13px 16px', fontSize: 13, color: '#475569' }}>
                            {row.parentPhone || row.phone || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#16a34a' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <p style={{ fontWeight: 600 }}>No defaulters found!</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>
                  All students are above {threshold}% attendance.
                </p>
              </div>
            )}
          </div>

        /* ── Student Report ── */
        ) : reportType === 'student' ? (
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 17, fontWeight: 700 }}>
              👤 Student Report — {MONTHS[month - 1]} {year}
            </h3>

            {reportData ? (
              <>
                {/* Student info */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 20, marginBottom: 24,
                }}>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Student Name</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {reportData.studentName || reportData.name || 'N/A'}
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Class</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {reportData.className || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                  gap: 16, marginBottom: 24,
                }}>
                  {[
                    { label: 'Working Days', value: reportData.totalDays ?? 0, color: '#2563eb', bg: '#eff6ff' },
                    { label: 'Present',      value: reportData.present ?? 0,   color: '#16a34a', bg: '#dcfce7' },
                    { label: 'Absent',       value: reportData.absent ?? 0,    color: '#dc2626', bg: '#fee2e2' },
                    { label: 'Late',         value: reportData.late ?? 0,      color: '#d97706', bg: '#fef9c3' },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{
                      background: bg, borderRadius: 10, padding: '18px 20px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
                      <div style={{ fontSize: 13, color, fontWeight: 600, marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Attendance % */}
                {reportData.totalDays > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: 8, fontSize: 15, fontWeight: 700,
                    }}>
                      <span>Overall Attendance</span>
                      <span style={{
                        color: pctNum(reportData.present, reportData.totalDays) >= 75
                          ? '#16a34a' : '#dc2626',
                      }}>
                        {pctNum(reportData.present, reportData.totalDays)}%
                      </span>
                    </div>
                    <div style={{
                      background: '#f1f5f9', borderRadius: 99,
                      height: 14, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${pctNum(reportData.present, reportData.totalDays)}%`,
                        height: '100%',
                        background: pctNum(reportData.present, reportData.totalDays) >= 75
                          ? '#16a34a' : '#dc2626',
                        borderRadius: 99,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                      Minimum required: 75%
                    </div>
                  </div>
                )}

                {/* Day-wise records */}
                {Array.isArray(reportData.records) && reportData.records.length > 0 && (
                  <>
                    <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>
                      Day-wise Records
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                      gap: 8,
                    }}>
                      {reportData.records.map((rec, i) => {
                        const colorMap = {
                          present: '#16a34a', absent: '#dc2626',
                          late: '#d97706', halfday: '#0284c7',
                        };
                        const bgMap = {
                          present: '#dcfce7', absent: '#fee2e2',
                          late: '#fef9c3', halfday: '#e0f2fe',
                        };
                        return (
                          <div key={i} style={{
                            background: bgMap[rec.status] || '#f8fafc',
                            borderRadius: 8, padding: '10px 14px',
                            border: `1px solid ${colorMap[rec.status] || '#e2e8f0'}20`,
                          }}>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                              {new Date(rec.date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short',
                              })}
                            </div>
                            <div style={{
                              fontSize: 13, fontWeight: 700,
                              color: colorMap[rec.status] || '#475569',
                              textTransform: 'capitalize',
                            }}>
                              {rec.status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p>No data found for this student.</p>
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
};

export default AttendanceReport;
