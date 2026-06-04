import React, { useState, useEffect } from 'react';
import {
  getClassAttendance,
  markAttendance,
  bulkMarkAttendance,
  updateAttendance,
} from '../../api/attendanceApi';
import { getClasses } from '../../api/classApi';
import { getClassStudents } from '../../api/classApi';

const STATUS_OPTIONS = ['present', 'absent', 'late', 'halfday'];

const AttendanceForm = ({ classes: classesProp, onClose }) => {
  const [classes, setClasses]         = useState(classesProp || []);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [sections, setSections]       = useState([]);
  const [date, setDate]               = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents]       = useState([]);   // [{ id, name, rollNo, status, remarks }]
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [step, setStep]               = useState(1);    // 1=select class, 2=mark attendance
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [existingRecords, setExistingRecords] = useState([]);
  const [bulkStatus, setBulkStatus]   = useState('');

  /* ─── load classes if not passed ────────────────────── */
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

  /* ─── load sections on class change ─────────────────── */
  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    setSelectedSection('');
    setSections([]);
    if (!classId) return;
    try {
      const { getClassSections } = await import('../../api/classApi');
      const res = await getClassSections(classId);
      setSections(res.data || []);
    } catch { setSections([]); }
  };

  /* ─── step 2: load students + existing records ───────── */
  const handleProceed = async () => {
    if (!selectedClass || !date) {
      setError('Please select a class and date.');
      return;
    }
    setError('');
    setLoadingStudents(true);
    try {
      const [studentsRes, existingRes] = await Promise.all([
        getClassStudents(selectedClass, { sectionId: selectedSection || undefined }),
        getClassAttendance(selectedClass, date).catch(() => ({ data: [] })),
      ]);

      const existingMap = {};
      (existingRes.data || []).forEach((r) => {
        existingMap[r.studentId] = r;
      });
      setExistingRecords(existingRes.data || []);

      const mapped = (studentsRes.data || []).map((s) => ({
        id        : s.id,
        name      : `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name || 'Unknown',
        rollNo    : s.rollNo || '—',
        status    : existingMap[s.id]?.status    || 'present',
        remarks   : existingMap[s.id]?.remarks   || '',
        recordId  : existingMap[s.id]?.id        || null,
      }));

      setStudents(mapped);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  /* ─── update single student status ──────────────────── */
  const updateStudentField = (idx, field, value) => {
    setStudents((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  /* ─── apply bulk status to all ───────────────────────── */
  const applyBulkStatus = (status) => {
    setBulkStatus(status);
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  /* ─── submit ─────────────────────────────────────────── */
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        classId   : selectedClass,
        sectionId : selectedSection || undefined,
        date,
        attendance: students.map((s) => ({
          studentId : s.id,
          status    : s.status,
          remarks   : s.remarks,
        })),
      };
      await markAttendance(payload);
      setSuccess('Attendance marked successfully! ✅');
      setTimeout(() => onClose(true), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save attendance');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── helpers ────────────────────────────────────────── */
  const statusColor = {
    present : '#16a34a',
    absent  : '#dc2626',
    late    : '#d97706',
    halfday : '#0284c7',
  };

  const presentCount = students.filter((s) => s.status === 'present').length;
  const absentCount  = students.filter((s) => s.status === 'absent').length;
  const lateCount    = students.filter((s) => s.status === 'late').length;

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {step === 1 ? '📋 Mark Attendance' : '✅ Mark Attendance'}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {step === 1
              ? 'Select class and date to proceed'
              : `${students.length} students • ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
          </p>
        </div>
        <button
          onClick={() => step === 2 ? setStep(1) : onClose(false)}
          style={{
            background: '#f1f5f9', border: 'none', padding: '9px 18px',
            borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#475569', fontWeight: 600,
          }}
        >
          {step === 2 ? '← Change Class' : '← Back'}
        </button>
      </div>

      {/* ── Alerts ── */}
      {error && (
        <div style={{
          background: '#fee2e2', color: '#991b1b', padding: '12px 16px',
          borderRadius: 8, marginBottom: 20, fontSize: 14,
        }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{
          background: '#dcfce7', color: '#166534', padding: '12px 16px',
          borderRadius: 8, marginBottom: 20, fontSize: 14,
        }}>
          {success}
        </div>
      )}

      {/* ══════ STEP 1 — Select Class & Date ══════ */}
      {step === 1 && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 28,
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
            gap: 20, marginBottom: 28,
          }}>
            {/* Date */}
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#374151' }}>
                Date *
              </label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              />
            </div>

            {/* Class */}
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#374151' }}>
                Class *
              </label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: '#374151' }}>
                Section (optional)
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                  opacity: !selectedClass ? 0.5 : 1,
                }}
              >
                <option value="">All Sections</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              onClick={handleProceed}
              disabled={!selectedClass || !date || loadingStudents}
              style={{
                background: !selectedClass || !date ? '#93c5fd' : '#2563eb',
                color: 'white', border: 'none', padding: '11px 28px',
                borderRadius: 8, cursor: !selectedClass || !date ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: 15,
              }}
            >
              {loadingStudents ? '⏳ Loading Students...' : 'Proceed →'}
            </button>
          </div>
        </div>
      )}

      {/* ══════ STEP 2 — Mark Attendance ══════ */}
      {step === 2 && (
        <>
          {/* ── Live Counter ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: 12, marginBottom: 20,
          }}>
            {[
              { label: 'Total',   value: students.length, color: '#2563eb', bg: '#eff6ff'  },
              { label: 'Present', value: presentCount,    color: '#16a34a', bg: '#dcfce7'  },
              { label: 'Absent',  value: absentCount,     color: '#dc2626', bg: '#fee2e2'  },
              { label: 'Late',    value: lateCount,       color: '#d97706', bg: '#fef9c3'  },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{
                background: bg, borderRadius: 10,
                padding: '14px 18px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 12, color, fontWeight: 600, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Bulk Actions ── */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '14px 20px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>
              Mark All:
            </span>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => applyBulkStatus(s)}
                style={{
                  padding: '6px 16px',
                  background: bulkStatus === s ? statusColor[s] : '#f1f5f9',
                  color: bulkStatus === s ? 'white' : statusColor[s],
                  border: `1px solid ${statusColor[s]}`,
                  borderRadius: 6, cursor: 'pointer',
                  fontWeight: 600, fontSize: 13,
                  textTransform: 'capitalize',
                }}
              >
                {s}
              </button>
            ))}
            {bulkStatus && (
              <button
                onClick={() => { setBulkStatus(''); }}
                style={{
                  padding: '6px 14px', background: '#f1f5f9',
                  border: 'none', borderRadius: 6,
                  cursor: 'pointer', fontSize: 13, color: '#475569',
                }}
              >
                Reset
              </button>
            )}
          </div>

          {/* ── Student Rows ── */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
            marginBottom: 20,
          }}>
            {/* Table head */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr 100px 200px 1fr',
              gap: 12, padding: '12px 20px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            }}>
              {['#', 'Student', 'Roll No', 'Status', 'Remarks'].map((h) => (
                <div key={h} style={{
                  fontSize: 12, fontWeight: 700,
                  color: '#64748b', textTransform: 'uppercase',
                }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Student rows */}
            <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
              {students.map((student, idx) => (
                <div
                  key={student.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 100px 200px 1fr',
                    gap: 12, padding: '12px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    alignItems: 'center',
                    background: student.status === 'absent'
                      ? '#fff5f5'
                      : student.status === 'late'
                      ? '#fffbeb'
                      : 'white',
                    transition: 'background 0.2s',
                  }}
                >
                  {/* # */}
                  <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
                    {idx + 1}
                  </div>

                  {/* Name */}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{student.name}</div>
                  </div>

                  {/* Roll No */}
                  <div style={{ fontSize: 13, color: '#64748b' }}>{student.rollNo}</div>

                  {/* Status buttons */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStudentField(idx, 'status', s)}
                        title={s.charAt(0).toUpperCase() + s.slice(1)}
                        style={{
                          padding: '4px 8px', fontSize: 11,
                          borderRadius: 5, cursor: 'pointer', fontWeight: 700,
                          border: student.status === s
                            ? `2px solid ${statusColor[s]}`
                            : '1px solid #e2e8f0',
                          background: student.status === s ? statusColor[s] : 'white',
                          color: student.status === s ? 'white' : '#94a3b8',
                          textTransform: 'capitalize',
                          transition: 'all 0.15s',
                        }}
                      >
                        {s === 'halfday' ? 'H/D' : s.slice(0, 1).toUpperCase() + s.slice(1, 3)}
                      </button>
                    ))}
                  </div>

                  {/* Remarks */}
                  <input
                    type="text"
                    placeholder="Optional remark..."
                    value={student.remarks}
                    onChange={(e) => updateStudentField(idx, 'remarks', e.target.value)}
                    style={{
                      width: '100%', padding: '6px 10px',
                      border: '1px solid #e2e8f0', borderRadius: 6,
                      fontSize: 13, outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Submit Bar ── */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              <strong style={{ color: '#16a34a' }}>{presentCount} Present</strong>
              {' • '}
              <strong style={{ color: '#dc2626' }}>{absentCount} Absent</strong>
              {' • '}
              <strong style={{ color: '#d97706' }}>{lateCount} Late</strong>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => onClose(false)}
                style={{
                  padding: '10px 22px', border: '1px solid #e2e8f0',
                  borderRadius: 8, cursor: 'pointer',
                  fontWeight: 600, background: 'white', fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || students.length === 0}
                style={{
                  padding: '10px 28px',
                  background: submitting ? '#93c5fd' : '#2563eb',
                  color: 'white', border: 'none', borderRadius: 8,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: 14,
                }}
              >
                {submitting ? '⏳ Saving...' : `✅ Save Attendance (${students.length})`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceForm;
