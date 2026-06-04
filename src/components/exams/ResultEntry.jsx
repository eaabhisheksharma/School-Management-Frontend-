import React, { useState, useEffect } from 'react';
import { getClassStudents } from '../../api/classApi';
import { enterResults, updateResult, getExamResults } from '../../api/examApi';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ResultEntry = ({ exam, onClose }) => {
  const [students, setStudents]   = useState([]);   // [{ id, name, rollNo, marks, remarks, resultId }]
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [searchText, setSearchText] = useState('');
  const [stats, setStats]         = useState({ entered: 0, remaining: 0 });

  /* ─── load students + existing results ───────────────── */
  useEffect(() => { loadStudentsAndResults(); }, []);

  const loadStudentsAndResults = async () => {
    setLoading(true);
    setError('');
    try {
      const [studentRes, resultRes] = await Promise.all([
        getClassStudents(exam.classId, {}),
        getExamResults(exam.id, { limit: 500 }).catch(() => ({ data: [] })),
      ]);

      const existingMap = {};
      (resultRes.data || []).forEach((r) => {
        existingMap[r.studentId] = r;
      });

      const mapped = (studentRes.data || []).map((s) => ({
        id      : s.id,
        name    : `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.name || 'Unknown',
        rollNo  : s.rollNo || '—',
        marks   : existingMap[s.id]?.marks   ?? '',
        remarks : existingMap[s.id]?.remarks ?? '',
        absent  : existingMap[s.id]?.absent  ?? false,
        resultId: existingMap[s.id]?.id      ?? null,
      }));

      setStudents(mapped);
      updateStats(mapped);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data) => {
    const entered = data.filter((s) => s.marks !== '' || s.absent).length;
    setStats({ entered, remaining: data.length - entered });
  };

  /* ─── field updater ──────────────────────────────────── */
  const updateField = (idx, field, value) => {
    setStudents((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      if (field === 'absent' && value) copy[idx].marks = '';
      updateStats(copy);
      return copy;
    });
  };

  /* ─── bulk fill ──────────────────────────────────────── */
  const bulkFill = (marks) => {
    setStudents((prev) => {
      const updated = prev.map((s) =>
        s.absent ? s : { ...s, marks: String(marks) }
      );
      updateStats(updated);
      return updated;
    });
  };

  /* ─── validate ───────────────────────────────────────── */
  const validate = () => {
    const maxMarks = exam.totalMarks;
    for (const s of students) {
      if (s.absent) continue;
      if (s.marks === '') continue;
      if (isNaN(Number(s.marks)) || Number(s.marks) < 0) {
        setError(`Invalid marks for ${s.name}`);
        return false;
      }
      if (maxMarks && Number(s.marks) > maxMarks) {
        setError(`Marks for ${s.name} exceed total marks (${maxMarks})`);
        return false;
      }
    }
    return true;
  };

  /* ─── save results ───────────────────────────────────── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setError('');

    try {
      const resultsPayload = students
        .filter((s) => s.marks !== '' || s.absent)
        .map((s) => ({
          studentId: s.id,
          marks    : s.absent ? null : Number(s.marks),
          remarks  : s.remarks,
          absent   : s.absent,
        }));

      await enterResults(exam.id, { results: resultsPayload });
      setSuccess(`Results saved for ${resultsPayload.length} students! ✅`);
      setTimeout(() => onClose(true), 1400);
    } catch (err) {
      setError(err.message || 'Failed to save results');
    } finally {
      setSaving(false);
    }
  };

  /* ─── helpers ────────────────────────────────────────── */
  const getMarksColor = (marks) => {
    if (marks === '' || marks === undefined) return '#94a3b8';
    const pct = (Number(marks) / (exam.totalMarks || 100)) * 100;
    if (pct >= 80) return '#16a34a';
    if (pct >= 60) return '#0891b2';
    if (pct >= (exam.passingMarks / exam.totalMarks * 100 || 35)) return '#d97706';
    return '#dc2626';
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchText.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchText.toLowerCase())
  );

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
            ✏️ Enter Results
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {exam.name} • {exam.className || 'Class'}
            {exam.totalMarks && (
              <span style={{ marginLeft: 8, color: '#2563eb', fontWeight: 600 }}>
                Max Marks: {exam.totalMarks}
              </span>
            )}
            {exam.passingMarks && (
              <span style={{ marginLeft: 8, color: '#dc2626', fontWeight: 600 }}>
                Pass: {exam.passingMarks}
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={() => onClose(false)}>← Back</Button>
      </div>

      {/* ── Alerts ── */}
      {error   && <Alert type="error"   message={error}   dismissible onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* ── Progress bar ── */}
      {!loading && students.length > 0 && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: '14px 20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 13, marginBottom: 6,
            }}>
              <span style={{ color: '#64748b' }}>
                <strong style={{ color: '#2563eb' }}>{stats.entered}</strong> of{' '}
                <strong>{students.length}</strong> entered
              </span>
              <span style={{ color: '#64748b' }}>
                {stats.remaining} remaining
              </span>
            </div>
            <div style={{
              background: '#f1f5f9', borderRadius: 99,
              height: 8, overflow: 'hidden',
            }}>
              <div style={{
                width: `${students.length > 0
                  ? (stats.entered / students.length) * 100 : 0}%`,
                height: '100%', background: '#2563eb',
                borderRadius: 99, transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#2563eb' }}>
            {students.length > 0
              ? `${((stats.entered / students.length) * 100).toFixed(0)}%`
              : '0%'}
          </div>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: '12px 20px', marginBottom: 16,
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search student..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: '8px 14px', border: '1px solid #e2e8f0',
            borderRadius: 7, fontSize: 13, width: 220, outline: 'none',
          }}
        />

        {/* Quick fill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
            Quick Fill All:
          </span>
          {exam.totalMarks && [
            { label: 'Full', value: exam.totalMarks },
            { label: 'Pass', value: exam.passingMarks || Math.ceil(exam.totalMarks * 0.35) },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => bulkFill(value)}
              style={{
                padding: '6px 12px', background: '#f1f5f9',
                border: '1px solid #e2e8f0', borderRadius: 6,
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                color: '#475569',
              }}
            >
              {label} ({value})
            </button>
          ))}
          <button
            onClick={() => bulkFill('')}
            style={{
              padding: '6px 12px', background: '#fff1f2',
              border: '1px solid #fecdd3', borderRadius: 6,
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              color: '#be123c',
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* ── Student Result Rows ── */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        overflow: 'hidden', marginBottom: 20,
      }}>
        {/* Table head */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr 90px 160px 80px 1fr',
          gap: 12, padding: '12px 20px',
          background: '#f8fafc', borderBottom: '2px solid #e2e8f0',
        }}>
          {['#', 'Student', 'Roll No', `Marks${exam.totalMarks ? ` (/${exam.totalMarks})` : ''}`, 'Absent', 'Remarks'].map((h) => (
            <div key={h} style={{
              fontSize: 12, fontWeight: 700,
              color: '#64748b', textTransform: 'uppercase',
            }}>
              {h}
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 50, textAlign: 'center', color: '#94a3b8' }}>
            ⏳ Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: 50, textAlign: 'center', color: '#94a3b8' }}>
            No students found
          </div>
        ) : (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {filteredStudents.map((student, idx) => {
              const realIdx = students.findIndex((s) => s.id === student.id);
              const marksNum = student.marks !== '' ? Number(student.marks) : null;
              const isPassing = marksNum !== null && exam.passingMarks
                ? marksNum >= exam.passingMarks : null;

              return (
                <div
                  key={student.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 90px 160px 80px 1fr',
                    gap: 12, padding: '11px 20px',
                    alignItems: 'center',
                    borderBottom: '1px solid #f1f5f9',
                    background: student.absent
                      ? '#fef2f2'
                      : isPassing === false
                      ? '#fffbeb'
                      : 'white',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!student.absent && isPassing !== false)
                      e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = student.absent
                      ? '#fef2f2'
                      : isPassing === false ? '#fffbeb' : 'white';
                  }}
                >
                  {/* Index */}
                  <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
                    {idx + 1}
                  </div>

                  {/* Student info */}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{student.name}</div>
                    {student.resultId && (
                      <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>
                        ✓ Saved
                      </div>
                    )}
                  </div>

                  {/* Roll No */}
                  <div style={{ fontSize: 13, color: '#64748b' }}>{student.rollNo}</div>

                  {/* Marks input */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={student.marks}
                      disabled={student.absent}
                      min={0}
                      max={exam.totalMarks || undefined}
                      onChange={(e) => updateField(realIdx, 'marks', e.target.value)}
                      placeholder={student.absent ? 'Absent' : '0'}
                      style={{
                        width: '100%', padding: '7px 40px 7px 12px',
                        border: `1.5px solid ${
                          student.marks !== ''
                            ? getMarksColor(student.marks)
                            : '#e2e8f0'
                        }`,
                        borderRadius: 7, fontSize: 14,
                        fontWeight: 700,
                        color: getMarksColor(student.marks),
                        background: student.absent ? '#f8fafc' : 'white',
                        outline: 'none', boxSizing: 'border-box',
                        opacity: student.absent ? 0.5 : 1,
                      }}
                    />
                    {/* Percentage display */}
                    {student.marks !== '' && !student.absent && exam.totalMarks && (
                      <span style={{
                        position: 'absolute', right: 8, top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 11, color: getMarksColor(student.marks),
                        fontWeight: 700, pointerEvents: 'none',
                      }}>
                        {((Number(student.marks) / exam.totalMarks) * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>

                  {/* Absent toggle */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label style={{
                      position: 'relative', display: 'inline-block',
                      width: 40, height: 22, cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={student.absent}
                        onChange={(e) => updateField(realIdx, 'absent', e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: student.absent ? '#dc2626' : '#cbd5e1',
                        borderRadius: 34, transition: '0.25s',
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: 16, width: 16,
                          left: student.absent ? 20 : 2,
                          bottom: 3,
                          background: 'white', borderRadius: '50%',
                          transition: '0.25s',
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Remarks */}
                  <input
                    type="text"
                    value={student.remarks}
                    onChange={(e) => updateField(realIdx, 'remarks', e.target.value)}
                    placeholder="Optional remark..."
                    style={{
                      width: '100%', padding: '7px 10px',
                      border: '1px solid #e2e8f0', borderRadius: 7,
                      fontSize: 13, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Save Bar ── */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: 14, color: '#64748b' }}>
          <strong style={{ color: '#16a34a' }}>{stats.entered}</strong> results entered •{' '}
          <strong style={{ color: '#d97706' }}>{stats.remaining}</strong> remaining
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={stats.entered === 0}
          >
            💾 Save Results ({stats.entered})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultEntry;
