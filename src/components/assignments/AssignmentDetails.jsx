import React, { useState, useEffect } from 'react';
import {
  getAssignmentById,
  getSubmissions,
  evaluateSubmission,
  submitAssignment,
} from '../../api/assignmentApi';

const AssignmentDetails = ({ assignment, userRole, onBack, onEdit, onRefresh }) => {
  const [details, setDetails] = useState(assignment || null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [evaluateModal, setEvaluateModal] = useState(null);
  const [submitModal, setSubmitModal] = useState(false);
  const [submitFile, setSubmitFile] = useState(null);
  const [submitNotes, setSubmitNotes] = useState('');
  const [evalData, setEvalData] = useState({ marks: '', feedback: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const isTeacherOrPrincipal = ['teacher', 'principal'].includes(userRole);

  useEffect(() => {
    if (assignment?.id) fetchDetails();
  }, []);

  useEffect(() => {
    if (activeTab === 'submissions' && isTeacherOrPrincipal) {
      fetchSubmissions();
    }
  }, [activeTab]);

  const fetchDetails = async () => {
    try {
      const res = await getAssignmentById(assignment.id);
      setDetails(res.data || assignment);
    } catch {
      setDetails(assignment);
    }
  };

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await getSubmissions(assignment.id);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleEvaluate = async () => {
    if (!evaluateModal) return;
    setActionLoading(true);
    try {
      await evaluateSubmission(assignment.id, {
        submissionId: evaluateModal.id,
        marks: Number(evalData.marks),
        feedback: evalData.feedback,
      });
      setActionMsg({ type: 'success', text: 'Submission evaluated successfully!' });
      setEvaluateModal(null);
      fetchSubmissions();
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Evaluation failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submitFile) return;
    setActionLoading(true);
    const formData = new FormData();
    formData.append('file', submitFile);
    formData.append('notes', submitNotes);
    try {
      await submitAssignment(assignment.id, formData);
      setActionMsg({ type: 'success', text: 'Assignment submitted successfully!' });
      setSubmitModal(false);
      onRefresh && onRefresh();
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message || 'Submission failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }) : 'N/A';

  const isOverdue = details?.dueDate && new Date(details.dueDate) < new Date();

  if (!details) return (
    <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
      Loading assignment details...
    </div>
  );

  return (
    <div style={{ padding: 0 }}>
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
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            ← Back to Assignments
          </button>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>
            {details.title}
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
            {details.subjectName || details.subject} •{' '}
            {details.className || details.class}
            {details.sectionName && ` - ${details.sectionName}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isTeacherOrPrincipal && (
            <button onClick={() => onEdit(details)}
              style={{
                background: '#f0fdf4', color: '#166534', border: 'none',
                padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
                fontWeight: 600, fontSize: 14,
              }}>
              ✏️ Edit
            </button>
          )}
          {!isTeacherOrPrincipal && !isOverdue && (
            <button onClick={() => setSubmitModal(true)}
              style={{
                background: '#2563eb', color: 'white', border: 'none',
                padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
                fontWeight: 600, fontSize: 14,
              }}>
              📤 Submit
            </button>
          )}
        </div>
      </div>

      {/* Alert */}
      {actionMsg.text && (
        <div style={{
          background: actionMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: actionMsg.type === 'success' ? '#166534' : '#991b1b',
          padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14,
        }}>
          {actionMsg.type === 'success' ? '✅' : '⚠️'} {actionMsg.text}
        </div>
      )}

      {/* Overdue Banner */}
      {isOverdue && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          color: '#dc2626', padding: '10px 16px', borderRadius: 8,
          marginBottom: 20, fontSize: 14, fontWeight: 500,
        }}>
          ⏰ This assignment is overdue. Due date was {formatDate(details.dueDate)}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: '2px solid #f1f5f9',
      }}>
        {['details', ...(isTeacherOrPrincipal ? ['submissions'] : [])].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
              background: 'none', fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? '#2563eb' : '#64748b',
              borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
              fontSize: 14, marginBottom: -2, textTransform: 'capitalize',
            }}>
            {tab === 'submissions' ? `📋 Submissions` : '📄 Details'}
          </button>
        ))}
      </div>

      {/* ── Details Tab ─────────────────────────────────────── */}
      {activeTab === 'details' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Left */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
              Description
            </h3>
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7, margin: '0 0 24px' }}>
              {details.description || 'No description provided.'}
            </p>

            {details.instructions && (
              <>
                <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>
                  📋 Instructions
                </h3>
                <div style={{
                  background: '#f8fafc', borderRadius: 8, padding: 16,
                  color: '#475569', fontSize: 14, lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>
                  {details.instructions}
                </div>
              </>
            )}
          </div>

          {/* Right — Info Card */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
            height: 'fit-content',
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
              Assignment Info
            </h3>
            {[
              { label: 'Status', value: details.status, isStatus: true },
              { label: 'Due Date', value: formatDate(details.dueDate), isDate: true },
              { label: 'Total Marks', value: details.totalMarks || 'N/A' },
              { label: 'Subject', value: details.subjectName || details.subject || 'N/A' },
              { label: 'Class', value: `${details.className || 'N/A'}${details.sectionName ? ` - ${details.sectionName}` : ''}` },
              { label: 'Created By', value: details.teacherName || details.createdBy || 'N/A' },
              { label: 'Created On', value: formatDate(details.createdAt) },
            ].map(({ label, value, isDate }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #f1f5f9',
                fontSize: 14,
              }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>{label}</span>
                <span style={{
                  color: isDate && isOverdue ? '#dc2626' : '#0f172a',
                  fontWeight: isDate && isOverdue ? 700 : 500,
                  textAlign: 'right', maxWidth: '60%',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Submissions Tab ──────────────────────────────────── */}
      {activeTab === 'submissions' && isTeacherOrPrincipal && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          {loadingSubmissions ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              Loading submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ fontWeight: 600 }}>No submissions yet</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Student', 'Submitted On', 'Notes', 'Marks', 'Status', 'Actions'].map((h) => (
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
                {submissions.map((sub, idx) => (
                  <tr key={sub.id || idx}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>
                      {sub.studentName || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>
                      {formatDate(sub.submittedAt)}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>
                      {sub.notes || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600 }}>
                      {sub.marks !== undefined && sub.marks !== null
                        ? `${sub.marks} / ${details.totalMarks || '?'}`
                        : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: sub.evaluated ? '#dcfce7' : '#fef9c3',
                        color: sub.evaluated ? '#166534' : '#854d0e',
                        padding: '3px 10px', borderRadius: 12,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {sub.evaluated ? 'Evaluated' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => {
                          setEvaluateModal(sub);
                          setEvalData({ marks: sub.marks || '', feedback: sub.feedback || '' });
                        }}
                        style={{
                          background: '#eff6ff', color: '#2563eb', border: 'none',
                          padding: '6px 14px', borderRadius: 6,
                          cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        }}>
                        {sub.evaluated ? 'Re-Evaluate' : 'Evaluate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Evaluate Modal ───────────────────────────────────── */}
      {evaluateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: 32,
            width: 460, maxWidth: '90%',
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>
              ✏️ Evaluate Submission
            </h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              Student: <strong>{evaluateModal.studentName}</strong>
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                Marks (out of {details.totalMarks || '?'}) *
              </label>
              <input
                type="number" value={evalData.marks} min={0}
                max={details.totalMarks || undefined}
                onChange={(e) => setEvalData((p) => ({ ...p, marks: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                Feedback
              </label>
              <textarea
                value={evalData.feedback} rows={3}
                onChange={(e) => setEvalData((p) => ({ ...p, feedback: e.target.value }))}
                placeholder="Provide feedback to the student..."
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8,
                  fontSize: 14, resize: 'vertical',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setEvaluateModal(null)}
                style={{
                  padding: '10px 20px', border: '1px solid #e2e8f0',
                  borderRadius: 8, cursor: 'pointer', fontWeight: 600, background: 'white',
                }}>
                Cancel
              </button>
              <button onClick={handleEvaluate} disabled={actionLoading || !evalData.marks}
                style={{
                  padding: '10px 24px',
                  background: actionLoading || !evalData.marks ? '#93c5fd' : '#2563eb',
                  color: 'white', border: 'none', borderRadius: 8,
                  cursor: actionLoading || !evalData.marks ? 'not-allowed' : 'pointer',
                  fontWeight: 600, fontSize: 14,
                }}>
                {actionLoading ? 'Saving...' : 'Save Evaluation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submit Assignment Modal (Student) ────────────────── */}
      {submitModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: 32,
            width: 460, maxWidth: '90%',
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>📤 Submit Assignment</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
              {details.title}
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                Upload File *
              </label>
              <input
                type="file"
                onChange={(e) => setSubmitFile(e.target.files[0])}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
                Notes
              </label>
              <textarea
                value={submitNotes} rows={3}
                onChange={(e) => setSubmitNotes(e.target.value)}
                placeholder="Add any notes for your teacher..."
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8,
                  fontSize: 14, resize: 'vertical',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setSubmitModal(false)}
                style={{
                  padding: '10px 20px', border: '1px solid #e2e8f0',
                  borderRadius: 8, cursor: 'pointer', fontWeight: 600, background: 'white',
                }}>
                Cancel
              </button>
              <button onClick={handleSubmitAssignment} disabled={actionLoading || !submitFile}
                style={{
                  padding: '10px 24px',
                  background: actionLoading || !submitFile ? '#93c5fd' : '#2563eb',
                  color: 'white', border: 'none', borderRadius: 8,
                  cursor: actionLoading || !submitFile ? 'not-allowed' : 'pointer',
                  fontWeight: 600, fontSize: 14,
                }}>
                {actionLoading ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetails;
