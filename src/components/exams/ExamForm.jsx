import React, { useState, useEffect } from 'react';
import { createExam, updateExam, addScheduleEntry, getExamSchedule } from '../../api/examApi';
import { getClasses, getSubjects } from '../../api/classApi';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';

const EXAM_TYPES = [
  { value: 'midterm',   label: '📘 Midterm'    },
  { value: 'final',     label: '📕 Final'      },
  { value: 'unit',      label: '📗 Unit Test'  },
  { value: 'practical', label: '🔬 Practical'  },
  { value: 'oral',      label: '🎤 Oral'       },
  { value: 'quiz',      label: '📝 Quiz'       },
];

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const ExamForm = ({ exam, onClose }) => {
  const isEdit = !!exam;

  const [activeTab, setActiveTab] = useState('basic');  // basic | schedule

  /* ── basic form ─────────────────────────────────────── */
  const [formData, setFormData] = useState({
    name        : '',
    type        : '',
    classId     : '',
    startDate   : '',
    endDate     : '',
    totalMarks  : '',
    passingMarks: '',
    description : '',
    status      : 'upcoming',
  });

  /* ── schedule form ───────────────────────────────────── */
  const [scheduleEntries, setScheduleEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    subjectId: '', date: '', startTime: '', endTime: '', venue: '',
  });

  const [classes, setClasses]   = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  /* ── init ────────────────────────────────────────────── */
  useEffect(() => {
    fetchDropdowns();
    if (isEdit && exam) {
      setFormData({
        name        : exam.name         || '',
        type        : exam.type         || '',
        classId     : exam.classId      || '',
        startDate   : exam.startDate    ? exam.startDate.split('T')[0] : '',
        endDate     : exam.endDate      ? exam.endDate.split('T')[0]   : '',
        totalMarks  : exam.totalMarks   || '',
        passingMarks: exam.passingMarks || '',
        description : exam.description  || '',
        status      : exam.status       || 'upcoming',
      });
      fetchSchedule(exam.id);
    }
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [classRes, subjectRes] = await Promise.all([
        getClasses(), getSubjects(),
      ]);
      setClasses(classRes.data || []);
      setSubjects(subjectRes.data || []);
    } catch { /* silent */ }
  };

  const fetchSchedule = async (id) => {
    try {
      const res = await getExamSchedule(id);
      setScheduleEntries(res.data || []);
    } catch { /* silent */ }
  };

  /* ── handlers ────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        totalMarks  : formData.totalMarks   ? Number(formData.totalMarks)   : undefined,
        passingMarks: formData.passingMarks ? Number(formData.passingMarks) : undefined,
      };
      if (isEdit) await updateExam(exam.id, payload);
      else        await createExam(payload);

      setSuccess(`Exam ${isEdit ? 'updated' : 'created'} successfully! ✅`);
      setTimeout(() => onClose(true), 1200);
    } catch (err) {
      setError(err.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!newEntry.subjectId || !newEntry.date || !newEntry.startTime) {
      setError('Subject, date and start time are required for schedule entry');
      return;
    }
    if (!isEdit) {
      setError('Please save the exam first before adding schedule entries');
      return;
    }
    setScheduleLoading(true);
    setError('');
    try {
      await addScheduleEntry(exam.id, newEntry);
      await fetchSchedule(exam.id);
      setNewEntry({ subjectId: '', date: '', startTime: '', endTime: '', venue: '' });
      setSuccess('Schedule entry added!');
    } catch (err) {
      setError(err.message || 'Failed to add schedule');
    } finally {
      setScheduleLoading(false);
    }
  };

  /* ── styles ──────────────────────────────────────────── */
  const fgStyle = { marginBottom: 20 };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {isEdit ? '✏️ Edit Exam' : '📖 Create Exam'}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {isEdit ? 'Update exam details and schedule' : 'Set up a new examination'}
          </p>
        </div>
        <Button variant="outline" onClick={() => onClose(false)}>← Back</Button>
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        borderBottom: '2px solid #f1f5f9',
      }}>
        {[
          { key: 'basic',    label: '📋 Basic Info' },
          { key: 'schedule', label: '📅 Schedule'   },
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

      {/* ══════ BASIC INFO TAB ══════ */}
      {activeTab === 'basic' && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 28,
        }}>
          <form onSubmit={handleSubmit}>
            {/* Name + Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, ...fgStyle }}>
              <div style={fgStyle}>
                <Input
                  label="Exam Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Mid Term Exam 2025"
                  required
                />
              </div>
              <div style={fgStyle}>
                <Select
                  label="Exam Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  options={EXAM_TYPES}
                  placeholder="Select type"
                  required
                />
              </div>
            </div>

            {/* Class + Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, ...fgStyle }}>
              <div style={fgStyle}>
                <Select
                  label="Class"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  options={classes.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="Select class"
                  required
                />
              </div>
              <div style={fgStyle}>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: 'upcoming',  label: '📅 Upcoming'  },
                    { value: 'ongoing',   label: '✏️ Ongoing'   },
                    { value: 'completed', label: '✅ Completed' },
                    { value: 'published', label: '📢 Published' },
                    { value: 'draft',     label: '📝 Draft'     },
                  ]}
                />
              </div>
            </div>

            {/* Start + End Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, ...fgStyle }}>
              <div style={fgStyle}>
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={fgStyle}>
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Total + Passing Marks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, ...fgStyle }}>
              <div style={fgStyle}>
                <Input
                  label="Total Marks"
                  name="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  min={0}
                />
              </div>
              <div style={fgStyle}>
                <Input
                  label="Passing Marks"
                  name="passingMarks"
                  type="number"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  placeholder="e.g. 35"
                  min={0}
                />
              </div>
            </div>

            {/* Description */}
            <div style={fgStyle}>
              <label style={{
                display: 'block', marginBottom: 6,
                fontSize: 13, fontWeight: 600, color: '#374151',
              }}>
                Description / Instructions
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Exam instructions, guidelines..."
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #e2e8f0', borderRadius: 8,
                  fontSize: 14, resize: 'vertical', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="outline" type="button" onClick={() => onClose(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {isEdit ? 'Update Exam' : 'Create Exam'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ══════ SCHEDULE TAB ══════ */}
      {activeTab === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Add entry form */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
              ➕ Add Schedule Entry
            </h3>
            {!isEdit && (
              <Alert
                type="warning"
                message="Save the exam first (Basic Info tab) before adding schedule entries."
                style={{ marginBottom: 16 }}
              />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
              <Select
                label="Subject *"
                value={newEntry.subjectId}
                onChange={(e) => setNewEntry((p) => ({ ...p, subjectId: e.target.value }))}
                options={subjects.map((s) => ({ value: s.id, label: s.name }))}
                placeholder="Select subject"
                disabled={!isEdit}
              />
              <Input
                label="Date *"
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry((p) => ({ ...p, date: e.target.value }))}
                disabled={!isEdit}
              />
              <Input
                label="Start Time *"
                type="time"
                value={newEntry.startTime}
                onChange={(e) => setNewEntry((p) => ({ ...p, startTime: e.target.value }))}
                disabled={!isEdit}
              />
              <Input
                label="End Time"
                type="time"
                value={newEntry.endTime}
                onChange={(e) => setNewEntry((p) => ({ ...p, endTime: e.target.value }))}
                disabled={!isEdit}
              />
              <Input
                label="Venue / Room"
                value={newEntry.venue}
                onChange={(e) => setNewEntry((p) => ({ ...p, venue: e.target.value }))}
                placeholder="e.g. Hall A, Room 101"
                disabled={!isEdit}
              />
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleAddSchedule}
                loading={scheduleLoading}
                disabled={!isEdit}
                icon="+"
              >
                Add Entry
              </Button>
            </div>
          </div>

          {/* Schedule table */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                📅 Exam Schedule ({scheduleEntries.length} entries)
              </h3>
            </div>

            {scheduleEntries.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
                <p style={{ fontWeight: 600 }}>No schedule entries yet</p>
                <p style={{ fontSize: 13 }}>Add subjects, dates and times above</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Subject', 'Date', 'Start Time', 'End Time', 'Venue'].map((h) => (
                        <th key={h} style={{
                          padding: '11px 16px', textAlign: 'left',
                          fontSize: 12, fontWeight: 700, color: '#64748b',
                          textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleEntries.map((entry, i) => (
                      <tr key={entry.id || i}
                        style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 14 }}>
                          {entry.subjectName || entry.subject?.name || '—'}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                          {entry.date
                            ? new Date(entry.date).toLocaleDateString('en-IN', {
                                weekday: 'short', day: '2-digit', month: 'short',
                              })
                            : '—'}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                          {entry.startTime || '—'}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                          {entry.endTime || '—'}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b' }}>
                          {entry.venue || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamForm;
