import React, { useState, useEffect } from 'react';
import {
  getTeacherById,
  getTeacherAttendance,
  getTeacherSchedule,
  getTeacherPerformance,
} from '../../api/teacherApi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';

const TABS = [
  { key: 'overview',     label: '👤 Overview'    },
  { key: 'professional', label: '💼 Professional' },
  { key: 'schedule',     label: '📅 Schedule'     },
  { key: 'attendance',   label: '📋 Attendance'   },
  { key: 'performance',  label: '📊 Performance'  },
];

const TeacherDetails = ({ teacherId, userRole, onClose, onEdit }) => {
  const [teacher, setTeacher]         = useState(null);
  const [attendance, setAttendance]   = useState(null);
  const [schedule, setSchedule]       = useState([]);
  const [performance, setPerformance] = useState(null);
  const [activeTab, setActiveTab]     = useState('overview');
  const [loading, setLoading]         = useState(true);
  const [tabLoading, setTabLoading]   = useState(false);
  const [error, setError]             = useState('');

  const isPrincipal = userRole === 'principal';

  /* ─── fetch teacher ──────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getTeacherById(teacherId);
        setTeacher(res.data || res);
      } catch (err) {
        setError(err.message || 'Failed to load teacher');
      } finally {
        setLoading(false);
      }
    })();
  }, [teacherId]);

  /* ─── lazy tab data ──────────────────────────────────── */
  useEffect(() => {
    if (!teacherId) return;
    const load = async () => {
      setTabLoading(true);
      try {
        if (activeTab === 'attendance' && !attendance) {
          const r = await getTeacherAttendance(teacherId);
          setAttendance(r.data || r);
        } else if (activeTab === 'schedule' && schedule.length === 0) {
          const r = await getTeacherSchedule(teacherId);
          setSchedule(r.data || []);
        } else if (activeTab === 'performance' && !performance) {
          const r = await getTeacherPerformance(teacherId);
          setPerformance(r.data || r);
        }
      } catch { /* silent */ }
      finally { setTabLoading(false); }
    };
    load();
  }, [activeTab, teacherId]);

  /* ─── helpers ────────────────────────────────────────── */
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : '—';

  const fmtCurrency = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(n || 0);

  const age = teacher?.dateOfBirth
    ? Math.floor((Date.now() - new Date(teacher.dateOfBirth)) / 31557600000)
    : null;

  const avatarBg = teacher?.gender === 'female'
    ? 'linear-gradient(135deg,#9333ea,#c026d3)'
    : 'linear-gradient(135deg,#2563eb,#0284c7)';

  const statusCfg = {
    active   : { bg: '#22c55e', label: 'Active'    },
    inactive : { bg: '#94a3b8', label: 'Inactive'  },
    on_leave : { bg: '#f59e0b', label: 'On Leave'  },
    resigned : { bg: '#ef4444', label: 'Resigned'  },
  };
  const sc = statusCfg[teacher?.status] || statusCfg.active;

  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  if (loading) return (
    <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <Loading text="Loading teacher profile..." />
    </div>
  );

  if (error || !teacher) return (
    <div>
      <Button variant="outline" onClick={onClose} style={{ marginBottom: 16 }}>← Back</Button>
      <Alert type="error" message={error || 'Teacher not found'} />
    </div>
  );

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* Back + Edit */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <Button variant="outline" onClick={onClose}>← Back to Teachers</Button>
        {isPrincipal && (
          <Button icon="✏️" onClick={onEdit}>Edit Teacher</Button>
        )}
      </div>

      {/* ── Hero Card ── */}
      <div style={{
        background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
        borderRadius: 14, marginBottom: 24, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ height: 80, background: avatarBg, opacity: 0.4 }} />
        <div style={{ padding: '0 28px 28px', marginTop: -44 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 90, height: 90, borderRadius: 18,
              background: teacher.profilePhoto ? 'transparent' : avatarBg,
              border: '4px solid #1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 800, color: 'white',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {teacher.profilePhoto
                ? <img src={teacher.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (teacher.name || 'T').charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'white' }}>
                  {teacher.name}
                </h2>
                <span style={{
                  background: sc.bg, color: 'white',
                  fontSize: 11, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 20,
                }}>
                  {sc.label}
                </span>
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
                {teacher.designation || 'Teacher'}
                {teacher.department ? ` • ${teacher.department}` : ''}
              </div>
              <div style={{
                display: 'flex', gap: 18, marginTop: 8, flexWrap: 'wrap',
                fontSize: 13, color: '#94a3b8',
              }}>
                {[
                  { icon: '📧', val: teacher.email },
                  { icon: '📞', val: teacher.phone },
                  { icon: '⭐', val: teacher.experience ? `${teacher.experience} yrs exp` : null },
                  { icon: '🎓', val: teacher.qualification },
                  { icon: '🎂', val: age ? `${age} years` : null },
                ].filter((i) => i.val).map(({ icon, val }) => (
                  <span key={val} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>{icon}</span>
                    <span style={{ color: '#cbd5e1' }}>{val}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Employee ID badge */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '12px 18px',
              textAlign: 'center', flexShrink: 0,
            }}>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Employee ID
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginTop: 2 }}>
                {teacher.employeeId || '—'}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Since {fmtDate(teacher.joiningDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: '2px solid #f1f5f9', overflowX: 'auto',
      }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
              background: 'none',
              fontWeight: activeTab === key ? 700 : 500,
              color: activeTab === key ? '#2563eb' : '#64748b',
              borderBottom: activeTab === key ? '2px solid #2563eb' : '2px solid transparent',
              fontSize: 14, marginBottom: -2, whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tabLoading ? (
        <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Loading type="dots" text="Loading..." />
        </div>
      ) : (
        <>
          {/* ════ OVERVIEW ════ */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <InfoCard title="👤 Personal Info">
                <InfoRow label="Full Name"    value={teacher.name}       />
                <InfoRow label="Date of Birth"value={fmtDate(teacher.dateOfBirth)} />
                <InfoRow label="Age"          value={age ? `${age} years` : '—'} />
                <InfoRow label="Gender"       value={teacher.gender} capitalize />
                <InfoRow label="Blood Group"  value={teacher.bloodGroup} />
                <InfoRow label="Nationality"  value={teacher.nationality} />
                <InfoRow label="Email"        value={teacher.email} />
                <InfoRow label="Phone"        value={teacher.phone} />
                <InfoRow label="Alt. Phone"   value={teacher.alternatePhone} />
              </InfoCard>

              <InfoCard title="📍 Address">
                <InfoRow label="Address" value={teacher.address} />
                <InfoRow label="City"    value={teacher.city} />
                <InfoRow label="State"   value={teacher.state} />
                <InfoRow label="Pincode" value={teacher.pincode} />
                <InfoRow label="Country" value={teacher.country} />
              </InfoCard>

              <InfoCard title="📚 Subjects Taught">
                {teacher.subjects && teacher.subjects.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {teacher.subjects.map((s) => (
                      <span key={s.id || s} style={{
                        background: '#eff6ff', color: '#2563eb',
                        padding: '6px 14px', borderRadius: 8,
                        fontSize: 13, fontWeight: 600, border: '1px solid #bfdbfe',
                      }}>
                        📚 {s.name || s}
                        {s.code ? ` (${s.code})` : ''}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
                    No subjects assigned
                  </p>
                )}
                {teacher.classAssignments && (
                  <div style={{ marginTop: 14, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    <strong>Class Assignments:</strong> {teacher.classAssignments}
                  </div>
                )}
              </InfoCard>

              <InfoCard title="📜 Certificates">
                {teacher.certificates ? (
                  <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {teacher.certificates}
                  </p>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>No certificates listed</p>
                )}
              </InfoCard>
            </div>
          )}

          {/* ════ PROFESSIONAL ════ */}
          {activeTab === 'professional' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <InfoCard title="💼 Employment Details">
                <InfoRow label="Employee ID"   value={teacher.employeeId}   />
                <InfoRow label="Designation"   value={teacher.designation}  />
                <InfoRow label="Department"    value={teacher.department}   />
                <InfoRow label="Qualification" value={teacher.qualification} />
                <InfoRow label="Experience"    value={teacher.experience ? `${teacher.experience} years` : '—'} />
                <InfoRow label="Joining Date"  value={fmtDate(teacher.joiningDate)} />
                <InfoRow label="Status"        value={(teacher.status || 'active').replace('_',' ')} capitalize />
              </InfoCard>

              {/* Salary (principal only) */}
              {isPrincipal && (
                <InfoCard title="💰 Salary & Banking">
                  <InfoRow label="Monthly Salary" value={fmtCurrency(teacher.salary)} />
                  <InfoRow label="Bank Name"       value={teacher.bankName}    />
                  <InfoRow label="Account Number"  value={teacher.bankAccount} />
                  <InfoRow label="IFSC Code"       value={teacher.ifscCode}    />
                  <InfoRow label="PAN Number"      value={teacher.panNumber}   />
                  <InfoRow label="Aadhar No"       value={teacher.aadharNo}    />
                </InfoCard>
              )}

              {/* Stats */}
              <div style={{
                gridColumn: isPrincipal ? '1 / -1' : 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
                gap: 16,
              }}>
                {[
                  { label: 'Experience',     value: teacher.experience ? `${teacher.experience} yrs` : '—', icon: '⭐', color: '#d97706', bg: '#fef9c3' },
                  { label: 'Subjects',       value: teacher.subjects?.length ?? 0,                          icon: '📚', color: '#2563eb', bg: '#eff6ff' },
                  { label: 'Qualification',  value: teacher.qualification || '—',                           icon: '🎓', color: '#7c3aed', bg: '#f5f3ff' },
                  { label: 'Years at School',value: teacher.joiningDate
                      ? `${Math.floor((Date.now() - new Date(teacher.joiningDate)) / 31557600000)} yrs`
                      : '—',                                                                                 icon: '🏫', color: '#16a34a', bg: '#dcfce7' },
                ].map(({ label, value, icon, color, bg }) => (
                  <div key={label} style={{
                    background: bg, borderRadius: 10, padding: '16px 18px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ SCHEDULE ════ */}
          {activeTab === 'schedule' && (
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                📅 Weekly Schedule
              </h3>
              {schedule.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
                  <p style={{ fontWeight: 600 }}>No schedule assigned yet</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Day', 'Period', 'Time', 'Subject', 'Class', 'Room'].map((h) => (
                          <th key={h} style={{
                            padding: '11px 16px', textAlign: 'left',
                            fontSize: 12, fontWeight: 700, color: '#64748b',
                            textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((s, i) => (
                        <tr key={s.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              background: '#eff6ff', color: '#2563eb',
                              padding: '3px 9px', borderRadius: 6,
                              fontSize: 12, fontWeight: 700,
                            }}>
                              {s.day || DAYS[i % 6]}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 14, color: '#475569' }}>
                            Period {s.period || (i + 1)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                            {s.startTime || '—'} {s.endTime ? `– ${s.endTime}` : ''}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>
                            {s.subjectName || s.subject?.name || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 14, color: '#475569' }}>
                            {s.className || s.class?.name || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                            {s.room || s.roomNo || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════ ATTENDANCE ════ */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {attendance ? (
                <>
                  {/* Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
                    gap: 14,
                  }}>
                    {[
                      { label: 'Total Days',   value: attendance.totalDays  ?? '—', icon: '📅', color: '#2563eb', bg: '#eff6ff' },
                      { label: 'Present',      value: attendance.present    ?? '—', icon: '✅', color: '#16a34a', bg: '#dcfce7' },
                      { label: 'Absent',       value: attendance.absent     ?? '—', icon: '❌', color: '#dc2626', bg: '#fee2e2' },
                      { label: 'Leave Taken',  value: attendance.leaveTaken ?? '—', icon: '🏖', color: '#d97706', bg: '#fef9c3' },
                      { label: 'Percentage',   value: attendance.percentage ? `${attendance.percentage}%` : '—', icon: '📊', color: '#7c3aed', bg: '#f5f3ff' },
                    ].map(({ label, value, icon, color, bg }) => (
                      <div key={label} style={{
                        background: 'white', borderRadius: 10,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        padding: '16px 18px',
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
                          <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  {attendance.percentage && (
                    <div style={{
                      background: 'white', borderRadius: 10,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 20,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: 10, fontSize: 14,
                      }}>
                        <span style={{ fontWeight: 600 }}>Attendance Rate</span>
                        <span style={{
                          fontWeight: 800,
                          color: attendance.percentage >= 90 ? '#16a34a' : '#d97706',
                        }}>
                          {attendance.percentage}%
                        </span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: 99, height: 10 }}>
                        <div style={{
                          width: `${attendance.percentage}%`, height: '100%',
                          background: attendance.percentage >= 90 ? '#22c55e' : '#f59e0b',
                          borderRadius: 99, transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Monthly table */}
                  {attendance.monthly && attendance.monthly.length > 0 && (
                    <div style={{
                      background: 'white', borderRadius: 10,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
                    }}>
                      <div style={{ padding: '16px 20px 0', fontWeight: 700, fontSize: 15 }}>
                        Monthly Breakdown
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              {['Month','Total','Present','Absent','Leave','%'].map((h) => (
                                <th key={h} style={{
                                  padding: '10px 16px', textAlign: 'left',
                                  fontSize: 12, fontWeight: 700, color: '#64748b',
                                  textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0',
                                }}>
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {attendance.monthly.map((m, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '11px 16px', fontWeight: 600, fontSize: 14 }}>{m.month}</td>
                                <td style={{ padding: '11px 16px', fontSize: 14 }}>{m.total}</td>
                                <td style={{ padding: '11px 16px' }}>
                                  <span style={{ color: '#16a34a', fontWeight: 700 }}>{m.present}</span>
                                </td>
                                <td style={{ padding: '11px 16px' }}>
                                  <span style={{ color: '#dc2626', fontWeight: 700 }}>{m.absent}</span>
                                </td>
                                <td style={{ padding: '11px 16px' }}>
                                  <span style={{ color: '#d97706', fontWeight: 700 }}>{m.leave ?? 0}</span>
                                </td>
                                <td style={{ padding: '11px 16px' }}>
                                  <span style={{
                                    fontWeight: 700,
                                    color: m.percentage >= 90 ? '#16a34a' : '#d97706',
                                  }}>
                                    {m.percentage}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
                    <p style={{ fontWeight: 600 }}>No attendance data available</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ PERFORMANCE ════ */}
          {activeTab === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {performance ? (
                <>
                  {/* KPIs */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
                    gap: 16,
                  }}>
                    {[
                      { label: 'Student Pass Rate', value: performance.passRate       ? `${performance.passRate}%`       : '—', icon: '✅', color: '#16a34a', bg: '#dcfce7' },
                      { label: 'Avg Student Score', value: performance.avgStudentScore ? `${performance.avgStudentScore}%` : '—', icon: '📊', color: '#2563eb', bg: '#eff6ff' },
                      { label: 'Classes Taken',     value: performance.classesTaken   ?? '—',                                   icon: '🏫', color: '#7c3aed', bg: '#f5f3ff' },
                      { label: 'Rating',            value: performance.rating         ? `${performance.rating}/5`         : '—', icon: '⭐', color: '#d97706', bg: '#fef9c3' },
                    ].map(({ label, value, icon, color, bg }) => (
                      <div key={label} style={{
                        background: bg, borderRadius: 10, padding: '18px 20px',
                        display: 'flex', alignItems: 'center', gap: 14,
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10, background: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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

                  {/* Subject-wise performance */}
                  {performance.subjectWise && performance.subjectWise.length > 0 && (
                    <div style={{
                      background: 'white', borderRadius: 10,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
                    }}>
                      <h4 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>
                        📚 Subject-wise Student Performance
                      </h4>
                      {performance.subjectWise.map((s) => {
                        const pct = s.avgScore || 0;
                        return (
                          <div key={s.subject} style={{ marginBottom: 16 }}>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              marginBottom: 6, fontSize: 14,
                            }}>
                              <span style={{ fontWeight: 600 }}>{s.subject}</span>
                              <span style={{
                                fontWeight: 800,
                                color: pct >= 75 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626',
                              }}>
                                {pct}%
                              </span>
                            </div>
                            <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8 }}>
                              <div style={{
                                width: `${pct}%`, height: '100%',
                                background: pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444',
                                borderRadius: 99, transition: 'width 1s ease',
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Feedback */}
                  {performance.feedback && (
                    <div style={{
                      background: 'white', borderRadius: 10,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
                    }}>
                      <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>
                        💬 Principal's Feedback
                      </h4>
                      <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
                        {performance.feedback}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ background: 'white', borderRadius: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
                    <p style={{ fontWeight: 600 }}>No performance data available</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ─── Reusable sub-components ─────────────────────────────── */
const InfoCard = ({ title, children }) => (
  <div style={{
    background: 'white', borderRadius: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 20,
  }}>
    <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
  </div>
);

const InfoRow = ({ label, value, capitalize }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: 12,
    padding: '6px 0', borderBottom: '1px solid #f8fafc', fontSize: 14,
  }}>
    <span style={{ color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>{label}</span>
    <span style={{
      color: '#0f172a', fontWeight: 600, textAlign: 'right',
      textTransform: capitalize ? 'capitalize' : 'none',
    }}>
      {value || '—'}
    </span>
  </div>
);

export default TeacherDetails;
