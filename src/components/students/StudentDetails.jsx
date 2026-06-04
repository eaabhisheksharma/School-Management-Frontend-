import React, { useState, useEffect } from 'react';
import {
  getStudentById,
  getStudentAttendance,
  getStudentFees,
  getStudentExamResults,
  getStudentAssignments,
} from '../../api/studentApi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import Badge from '../common/Badge';

const TABS = [
  { key: 'overview',    label: '👤 Overview'     },
  { key: 'academic',    label: '📚 Academic'      },
  { key: 'attendance',  label: '📋 Attendance'    },
  { key: 'fees',        label: '💰 Fees'          },
  { key: 'results',     label: '📊 Results'       },
  { key: 'assignments', label: '📝 Assignments'   },
];

const StudentDetails = ({ studentId, userRole, onClose, onEdit }) => {
  const [student, setStudent]         = useState(null);
  const [attendance, setAttendance]   = useState(null);
  const [fees, setFees]               = useState([]);
  const [results, setResults]         = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab]     = useState('overview');
  const [loading, setLoading]         = useState(true);
  const [tabLoading, setTabLoading]   = useState(false);
  const [error, setError]             = useState('');

  const isPrincipalOrTeacher = ['principal', 'teacher'].includes(userRole);

  /* ─── fetch student ──────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getStudentById(studentId);
        setStudent(res.data || res);
      } catch (err) {
        setError(err.message || 'Failed to load student');
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  /* ─── fetch tab data on switch ───────────────────────── */
  useEffect(() => {
    if (!studentId) return;
    const fetchTab = async () => {
      setTabLoading(true);
      try {
        if (activeTab === 'attendance' && !attendance) {
          const r = await getStudentAttendance(studentId);
          setAttendance(r.data || r);
        } else if (activeTab === 'fees' && fees.length === 0) {
          const r = await getStudentFees(studentId);
          setFees(r.data || []);
        } else if (activeTab === 'results' && results.length === 0) {
          const r = await getStudentExamResults(studentId);
          setResults(r.data || []);
        } else if (activeTab === 'assignments' && assignments.length === 0) {
          const r = await getStudentAssignments(studentId);
          setAssignments(r.data || []);
        }
      } catch { /* silent — show empty state */ }
      finally { setTabLoading(false); }
    };
    fetchTab();
  }, [activeTab, studentId]);

  /* ─── helpers ────────────────────────────────────────── */
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : '—';

  const fmtCurrency = (n) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(n || 0);

  const age = student?.dateOfBirth
    ? Math.floor((Date.now() - new Date(student.dateOfBirth)) / 31557600000)
    : null;

  const avatarBg = student?.gender === 'female'
    ? 'linear-gradient(135deg,#9333ea,#c026d3)'
    : 'linear-gradient(135deg,#2563eb,#0284c7)';

  if (loading) return (
    <div style={{
      background: 'white', borderRadius: 10,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <Loading text="Loading student profile..." />
    </div>
  );

  if (error || !student) return (
    <div>
      <Button variant="outline" onClick={onClose} style={{ marginBottom: 16 }}>← Back</Button>
      <Alert type="error" message={error || 'Student not found'} />
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
        <Button variant="outline" onClick={onClose}>← Back to Students</Button>
        {isPrincipalOrTeacher && (
          <Button icon="✏️" onClick={onEdit}>Edit Student</Button>
        )}
      </div>

      {/* ── Hero Profile Card ── */}
      <div style={{
        background     : 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
        borderRadius   : 14, marginBottom: 24,
        overflow       : 'hidden',
        boxShadow      : '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        {/* Cover */}
        <div style={{ height: 80, background: avatarBg, opacity: 0.4 }} />
        <div style={{ padding: '0 28px 28px', marginTop: -40 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 88, height: 88, borderRadius: 18,
              background: student.profilePhoto ? 'transparent' : avatarBg,
              border: '4px solid #1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 800, color: 'white',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {student.profilePhoto
                ? <img src={student.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (student.name || 'S').charAt(0).toUpperCase()
              }
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'white' }}>
                  {student.name}
                </h2>
                <span style={{
                  background: student.status === 'active' ? '#22c55e' : '#94a3b8',
                  color: 'white', fontSize: 11, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 20,
                  textTransform: 'capitalize',
                }}>
                  {student.status || 'active'}
                </span>
              </div>
              <div style={{
                display: 'flex', gap: 18, marginTop: 8, flexWrap: 'wrap',
                fontSize: 13, color: '#94a3b8',
              }}>
                {[
                  { icon: '🏫', val: student.className || student.class?.name },
                  { icon: '📋', val: student.rollNo ? `Roll: ${student.rollNo}` : null },
                  { icon: '🎂', val: age ? `${age} years` : null },
                  { icon: '💉', val: student.bloodGroup },
                  { icon: '📧', val: student.email },
                  { icon: '📞', val: student.phone },
                ].filter((i) => i.val).map(({ icon, val }) => (
                  <span key={val} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>{icon}</span>
                    <span style={{ color: '#cbd5e1' }}>{val}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Admission badge */}
            <div style={{
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '12px 18px',
              textAlign: 'center', flexShrink: 0,
            }}>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Admission No
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginTop: 2 }}>
                {student.admissionNo || '—'}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                {fmtDate(student.admissionDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: '2px solid #f1f5f9',
        overflowX: 'auto',
      }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
              background: 'none',
              fontWeight: activeTab === key ? 700 : 500,
              color: activeTab === key ? '#2563eb' : '#64748b',
              borderBottom: activeTab === key
                ? '2px solid #2563eb' : '2px solid transparent',
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

              {/* Personal Info */}
              <InfoCard title="👤 Personal Info">
                <InfoRow label="Full Name"    value={student.name}        />
                <InfoRow label="Date of Birth"value={fmtDate(student.dateOfBirth)} />
                <InfoRow label="Age"          value={age ? `${age} years` : '—'} />
                <InfoRow label="Gender"       value={student.gender}      textTransform="capitalize" />
                <InfoRow label="Blood Group"  value={student.bloodGroup}  />
                <InfoRow label="Nationality"  value={student.nationality} />
                <InfoRow label="Religion"     value={student.religion}    />
                <InfoRow label="Phone"        value={student.phone}       />
                <InfoRow label="Email"        value={student.email}       />
              </InfoCard>

              {/* Academic Info */}
              <InfoCard title="📚 Academic Info">
                <InfoRow label="Class"        value={student.className || student.class?.name} />
                <InfoRow label="Section"      value={student.section}     />
                <InfoRow label="Roll Number"  value={student.rollNo}      />
                <InfoRow label="Admission No" value={student.admissionNo} />
                <InfoRow label="Admission Date" value={fmtDate(student.admissionDate)} />
                <InfoRow label="Academic Year" value={student.academicYear} />
                <InfoRow label="Previous School" value={student.previousSchool} />
              </InfoCard>

              {/* Parent Info */}
              <InfoCard title="👨‍👩‍👧 Parent / Guardian">
                {student.fatherName && <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', marginBottom: 8, marginTop: 4 }}>FATHER</div>
                  <InfoRow label="Name"       value={student.fatherName}       />
                  <InfoRow label="Phone"      value={student.fatherPhone}      />
                  <InfoRow label="Email"      value={student.fatherEmail}      />
                  <InfoRow label="Occupation" value={student.fatherOccupation} />
                </>}
                {student.motherName && <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9333ea', marginBottom: 8, marginTop: 12 }}>MOTHER</div>
                  <InfoRow label="Name"       value={student.motherName}       />
                  <InfoRow label="Phone"      value={student.motherPhone}      />
                  <InfoRow label="Occupation" value={student.motherOccupation} />
                </>}
                {student.guardianName && <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8, marginTop: 12 }}>GUARDIAN</div>
                  <InfoRow label="Name"     value={student.guardianName}     />
                  <InfoRow label="Phone"    value={student.guardianPhone}    />
                  <InfoRow label="Relation" value={student.guardianRelation} />
                </>}
              </InfoCard>

              {/* Address */}
              <InfoCard title="🏠 Address">
                <InfoRow label="Address" value={student.address}  />
                <InfoRow label="City"    value={student.city}     />
                <InfoRow label="State"   value={student.state}    />
                <InfoRow label="Pincode" value={student.pincode}  />
                <InfoRow label="Country" value={student.country}  />
              </InfoCard>
            </div>
          )}

          {/* ════ ACADEMIC ════ */}
          {activeTab === 'academic' && (
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
            }}>
              <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                📚 Academic Summary
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
                gap: 16, marginBottom: 28,
              }}>
                {[
                  { label: 'Current Class',   value: student.className || '—',    icon: '🏫', color: '#2563eb', bg: '#eff6ff' },
                  { label: 'Roll Number',     value: student.rollNo || '—',       icon: '📋', color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Section',         value: student.section || '—',      icon: '🔤', color: '#7c3aed', bg: '#f5f3ff' },
                  { label: 'Academic Year',   value: student.academicYear || '—', icon: '📅', color: '#d97706', bg: '#fef9c3' },
                ].map(({ label, value, icon, color, bg }) => (
                  <div key={label} style={{
                    background: bg, borderRadius: 10,
                    padding: '16px 18px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
                  </div>
                ))}
              </div>
              {student.previousSchool && (
                <div style={{
                  background: '#f8fafc', borderRadius: 8,
                  padding: '12px 16px', fontSize: 14, color: '#475569',
                }}>
                  🏫 Previous School: <strong>{student.previousSchool}</strong>
                </div>
              )}
            </div>
          )}

          {/* ════ ATTENDANCE ════ */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {attendance ? (
                <>
                  {/* Attendance Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
                    gap: 14,
                  }}>
                    {[
                      { label: 'Total Days',  value: attendance.totalDays  ?? '—', icon: '📅', color: '#2563eb', bg: '#eff6ff' },
                      { label: 'Present',     value: attendance.present    ?? '—', icon: '✅', color: '#16a34a', bg: '#dcfce7' },
                      { label: 'Absent',      value: attendance.absent     ?? '—', icon: '❌', color: '#dc2626', bg: '#fee2e2' },
                      { label: 'Percentage',  value: attendance.percentage ? `${attendance.percentage}%` : '—', icon: '📊', color: '#7c3aed', bg: '#f5f3ff' },
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

                  {/* Percentage Bar */}
                  {attendance.percentage && (
                    <div style={{
                      background: 'white', borderRadius: 10,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      padding: 20,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: 10, fontSize: 14,
                      }}>
                        <span style={{ fontWeight: 600 }}>Attendance Rate</span>
                        <span style={{
                          fontWeight: 800,
                          color: attendance.percentage >= 75 ? '#16a34a' : '#dc2626',
                        }}>
                          {attendance.percentage}%
                        </span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: 99, height: 10 }}>
                        <div style={{
                          width: `${attendance.percentage}%`, height: '100%',
                          background: attendance.percentage >= 75 ? '#22c55e' : '#ef4444',
                          borderRadius: 99, transition: 'width 1s ease',
                        }} />
                      </div>
                      {attendance.percentage < 75 && (
                        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#dc2626' }}>
                          ⚠️ Below minimum 75% attendance requirement
                        </p>
                      )}
                    </div>
                  )}

                  {/* Monthly breakdown */}
                  {attendance.monthly && attendance.monthly.length > 0 && (
                    <div style={{
                      background: 'white', borderRadius: 10,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      padding: 20, overflowX: 'auto',
                    }}>
                      <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>
                        Monthly Breakdown
                      </h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['Month','Total','Present','Absent','%'].map((h) => (
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
                          {attendance.monthly.map((m, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '11px 14px', fontWeight: 600, fontSize: 14 }}>
                                {m.month}
                              </td>
                              <td style={{ padding: '11px 14px', fontSize: 14 }}>{m.total}</td>
                              <td style={{ padding: '11px 14px' }}>
                                <span style={{ color: '#16a34a', fontWeight: 700 }}>{m.present}</span>
                              </td>
                              <td style={{ padding: '11px 14px' }}>
                                <span style={{ color: '#dc2626', fontWeight: 700 }}>{m.absent}</span>
                              </td>
                              <td style={{ padding: '11px 14px' }}>
                                <span style={{
                                  fontWeight: 700,
                                  color: m.percentage >= 75 ? '#16a34a' : '#dc2626',
                                }}>
                                  {m.percentage}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState icon="📋" message="No attendance data available" />
              )}
            </div>
          )}

          {/* ════ FEES ════ */}
          {activeTab === 'fees' && (
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
              {fees.length === 0 ? (
                <EmptyState icon="💰" message="No fee records found" />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Invoice','Type','Amount','Due Date','Paid Date','Status'].map((h) => (
                          <th key={h} style={{
                            padding: '12px 16px', textAlign: 'left',
                            fontSize: 12, fontWeight: 700, color: '#64748b',
                            textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee, i) => (
                        <tr key={fee.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#2563eb', fontSize: 13 }}>
                            {fee.invoiceNumber || `INV-${String(fee.id).padStart(4,'0')}`}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, textTransform: 'capitalize' }}>
                            {fee.feeCategory?.replace('_',' ') || fee.type || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 14 }}>
                            {fmtCurrency(fee.amount)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13 }}>
                            {fmtDate(fee.dueDate)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13 }}>
                            {fmtDate(fee.paidDate)}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: 20,
                              fontSize: 12, fontWeight: 700,
                              background: fee.status === 'paid' ? '#dcfce7' : '#fee2e2',
                              color:      fee.status === 'paid' ? '#166534' : '#991b1b',
                            }}>
                              {fee.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════ RESULTS ════ */}
          {activeTab === 'results' && (
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
              {results.length === 0 ? (
                <EmptyState icon="📊" message="No exam results available" />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Exam','Subject','Max Marks','Marks Obtained','Percentage','Grade'].map((h) => (
                          <th key={h} style={{
                            padding: '12px 16px', textAlign: 'left',
                            fontSize: 12, fontWeight: 700, color: '#64748b',
                            textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => {
                        const pct = r.maxMarks
                          ? ((r.marksObtained / r.maxMarks) * 100).toFixed(1) : null;
                        return (
                          <tr key={r.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{r.examName || r.exam?.name || '—'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 14 }}>{r.subjectName || r.subject?.name || '—'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 14 }}>{r.maxMarks ?? '—'}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                                {r.marksObtained ?? '—'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                fontWeight: 700, fontSize: 14,
                                color: pct >= 75 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626',
                              }}>
                                {pct ? `${pct}%` : '—'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '4px 12px', borderRadius: 20,
                                fontSize: 13, fontWeight: 800,
                                background:
                                  r.grade === 'A+' || r.grade === 'A' ? '#dcfce7' :
                                  r.grade === 'B' ? '#dbeafe' :
                                  r.grade === 'C' ? '#fef9c3' : '#fee2e2',
                                color:
                                  r.grade === 'A+' || r.grade === 'A' ? '#166534' :
                                  r.grade === 'B' ? '#1d4ed8' :
                                  r.grade === 'C' ? '#854d0e' : '#991b1b',
                              }}>
                                {r.grade || '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════ ASSIGNMENTS ════ */}
          {activeTab === 'assignments' && (
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
              {assignments.length === 0 ? (
                <EmptyState icon="📝" message="No assignments found" />
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Assignment','Subject','Due Date','Submitted','Marks','Status'].map((h) => (
                          <th key={h} style={{
                            padding: '12px 16px', textAlign: 'left',
                            fontSize: 12, fontWeight: 700, color: '#64748b',
                            textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((a, i) => (
                        <tr key={a.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{a.title || '—'}</td>
                          <td style={{ padding: '12px 16px', fontSize: 14 }}>{a.subjectName || a.subject?.name || '—'}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13 }}>{fmtDate(a.dueDate)}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13 }}>{fmtDate(a.submittedDate)}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 14 }}>
                            {a.marksObtained != null ? `${a.marksObtained}/${a.maxMarks ?? '?'}` : '—'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: 20,
                              fontSize: 12, fontWeight: 700,
                              background:
                                a.submissionStatus === 'submitted' ? '#dcfce7' :
                                a.submissionStatus === 'late'      ? '#fef9c3' :
                                a.submissionStatus === 'missing'   ? '#fee2e2' : '#f1f5f9',
                              color:
                                a.submissionStatus === 'submitted' ? '#166534' :
                                a.submissionStatus === 'late'      ? '#854d0e' :
                                a.submissionStatus === 'missing'   ? '#991b1b' : '#475569',
                            }}>
                              {a.submissionStatus || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    padding: 20,
  }}>
    <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
      {title}
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value, textTransform }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: 12,
    padding: '6px 0', borderBottom: '1px solid #f8fafc',
    fontSize: 14,
  }}>
    <span style={{ color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>{label}</span>
    <span style={{
      color: '#0f172a', fontWeight: 600, textAlign: 'right',
      textTransform: textTransform || 'none',
    }}>
      {value || '—'}
    </span>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
    <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
    <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{message}</p>
  </div>
);

export default StudentDetails;
