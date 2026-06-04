import React, { useState, useEffect } from 'react';
import {
  createTimetableEntry,
  updateTimetableEntry,
} from '../../api/timetableApi';
import { getClasses }   from '../../api/classApi';
import { getSubjects }  from '../../api/subjectApi';
import { getTeachers }  from '../../api/teacherApi';
import Button from '../common/Button';
import Input  from '../common/Input';
import Select from '../common/Select';
import Alert  from '../common/Alert';

const DAYS    = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const PERIODS = [1,2,3,4,5,6,7,8];

/* Pre-built period time slots */
const PERIOD_TIMES = {
  1: { start: '07:30', end: '08:15' },
  2: { start: '08:15', end: '09:00' },
  3: { start: '09:00', end: '09:45' },
  4: { start: '10:00', end: '10:45' },
  5: { start: '10:45', end: '11:30' },
  6: { start: '11:30', end: '12:15' },
  7: { start: '13:00', end: '13:45' },
  8: { start: '13:45', end: '14:30' },
};

const PERIOD_TYPES = [
  { value: 'regular',  label: '📚 Regular Period'  },
  { value: 'lab',      label: '🔬 Lab Session'      },
  { value: 'break',    label: '☕ Break'             },
  { value: 'assembly', label: '🎤 Assembly'          },
  { value: 'sports',   label: '⚽ Sports'            },
  { value: 'library',  label: '📖 Library'           },
  { value: 'free',     label: '🆓 Free Period'       },
];

const emptyForm = {
  day          : '',
  period       : '',
  periodType   : 'regular',
  classId      : '',
  section      : '',
  subjectId    : '',
  teacherId    : '',
  room         : '',
  startTime    : '',
  endTime      : '',
  academicYear : `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  notes        : '',
};

const TimetableForm = ({
  entry,
  classId: prefillClassId,
  section: prefillSection,
  academicYear: prefillYear,
  userRole,
  onClose,
}) => {
  const isEdit = !!(entry && entry.id);

  const [formData, setFormData]     = useState(emptyForm);
  const [classes, setClasses]       = useState([]);
  const [subjects, setSubjects]     = useState([]);
  const [teachers, setTeachers]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [errors, setErrors]         = useState({});
  const [conflictWarning, setConflictWarning] = useState('');

  /* ─── init ───────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const [classRes, subjRes, teachRes] = await Promise.all([
          getClasses(),
          getSubjects(),
          getTeachers({ status: 'active' }),
        ]);
        setClasses(classRes.data  || []);
        setSubjects(subjRes.data  || []);
        setTeachers(teachRes.data || []);
      } catch { /* silent */ }
    })();

    if (isEdit && entry) {
      setFormData({
        day          : entry.day         || '',
        period       : entry.period      || '',
        periodType   : entry.periodType  || 'regular',
        classId      : entry.classId     || '',
        section      : entry.section     || '',
        subjectId    : entry.subjectId   || entry.subject?.id || '',
        teacherId    : entry.teacherId   || entry.teacher?.id || '',
        room         : entry.room        || entry.roomNo     || '',
        startTime    : entry.startTime   || '',
        endTime      : entry.endTime     || '',
        academicYear : entry.academicYear || prefillYear || emptyForm.academicYear,
        notes        : entry.notes       || '',
      });
    } else {
      /* Pre-fill from props when adding to specific slot */
      setFormData((p) => ({
        ...p,
        classId      : prefillClassId  || '',
        section      : prefillSection  || '',
        academicYear : prefillYear     || p.academicYear,
        day          : entry?.day      || '',
        period       : entry?.period   || '',
        startTime    : entry?.period ? PERIOD_TIMES[entry.period]?.start || '' : '',
        endTime      : entry?.period ? PERIOD_TIMES[entry.period]?.end   || '' : '',
      }));
    }
  }, []);

  /* ─── auto-fill time on period change ───────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => {
      const updated = { ...p, [name]: value };
      if (name === 'period' && PERIOD_TIMES[value]) {
        updated.startTime = PERIOD_TIMES[value].start;
        updated.endTime   = PERIOD_TIMES[value].end;
      }
      return updated;
    });
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    setConflictWarning('');
  };

  /* ─── validate ───────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!formData.day)     e.day     = 'Day is required';
    if (!formData.period)  e.period  = 'Period is required';
    if (!formData.classId) e.classId = 'Class is required';
    if (formData.periodType === 'regular' && !formData.subjectId)
      e.subjectId = 'Subject is required for regular periods';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ─── submit ─────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    setConflictWarning('');
    try {
      if (isEdit) await updateTimetableEntry(entry.id, formData);
      else        await createTimetableEntry(formData);
      setSuccess(`Timetable ${isEdit ? 'updated' : 'created'} successfully! ✅`);
      setTimeout(() => onClose(true), 1100);
    } catch (err) {
      if (err.message?.toLowerCase().includes('conflict')) {
        setConflictWarning(err.message);
      } else {
        setError(err.message || 'Save failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const ip = (name, extra = {}) => ({
    name, value: formData[name], onChange: handleChange, error: errors[name], ...extra,
  });

  const selClass   = classes.find((c)  => c.id === formData.classId);
  const sections   = selClass?.sections || [];
  const isFreeType = ['break','assembly','free'].includes(formData.periodType);

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {isEdit ? '✏️ Edit Period' : '📅 Add Period'}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {isEdit
              ? 'Update timetable slot details'
              : 'Schedule a new period in the timetable'}
          </p>
        </div>
        <Button variant="outline" onClick={() => onClose(false)}>← Back</Button>
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* Conflict warning */}
      {conflictWarning && (
        <div style={{
          background: '#fef9c3', border: '1px solid #fde68a',
          borderRadius: 8, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#92400e' }}>
              Scheduling Conflict Detected
            </div>
            <div style={{ fontSize: 13, color: '#92400e', marginTop: 2 }}>
              {conflictWarning}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 28,
        }}>

          {/* ── Section 1: Slot Selector ── */}
          <div style={{
            background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)',
            borderRadius: 12, padding: 20, marginBottom: 24,
            border: '1px solid #bfdbfe',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1d4ed8', marginBottom: 16 }}>
              📍 Timetable Slot
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 16 }}>
              <Select
                label="Day" required
                {...ip('day')}
                options={DAYS.map((d) => ({ value: d, label: d }))}
                placeholder="Select day"
              />
              <Select
                label="Period" required
                {...ip('period')}
                options={PERIODS.map((p) => ({
                  value: p,
                  label: `Period ${p}${PERIOD_TIMES[p] ? ` (${PERIOD_TIMES[p].start})` : ''}`,
                }))}
                placeholder="Select period"
              />
              <Select
                label="Period Type"
                {...ip('periodType')}
                options={PERIOD_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              />
            </div>
          </div>

          {/* ── Section 2: Class & Subject ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 16 }}>
              🏫 Class & Subject
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16 }}>
              <Select
                label="Class" required
                {...ip('classId')}
                options={classes.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Select class"
              />
              {sections.length > 0 && (
                <Select
                  label="Section"
                  {...ip('section')}
                  options={sections.map((s) => ({ value: s, label: `Section ${s}` }))}
                  placeholder="All sections"
                />
              )}
              {!isFreeType && (
                <Select
                  label="Subject" required={!isFreeType}
                  {...ip('subjectId')}
                  options={subjects.map((s) => ({ value: s.id, label: s.name }))}
                  placeholder="Select subject"
                />
              )}
            </div>
          </div>

          {/* ── Section 3: Teacher & Room ── */}
          {!isFreeType && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 16 }}>
                👨‍🏫 Teacher & Room
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
                <Select
                  label="Assign Teacher"
                  {...ip('teacherId')}
                  options={teachers.map((t) => ({ value: t.id, label: t.name }))}
                  placeholder="Select teacher"
                />
                <Input
                  label="Room / Classroom"
                  placeholder="e.g. Room 101, Lab B"
                  {...ip('room')}
                />
              </div>
            </div>
          )}

          {/* ── Section 4: Timing ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 16 }}>
              ⏰ Timing
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 16 }}>
              <Input label="Start Time" type="time" {...ip('startTime')} />
              <Input label="End Time"   type="time" {...ip('endTime')}   />
              <Input
                label="Academic Year"
                placeholder="e.g. 2025-2026"
                {...ip('academicYear')}
              />
            </div>

            {/* Period time shortcuts */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
                Quick period presets:
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        period   : p,
                        startTime: PERIOD_TIMES[p]?.start || '',
                        endTime  : PERIOD_TIMES[p]?.end   || '',
                      }));
                    }}
                    style={{
                      padding: '5px 12px',
                      background: Number(formData.period) === p ? '#2563eb' : '#f8fafc',
                      color     : Number(formData.period) === p ? 'white'   : '#475569',
                      border    : `1px solid ${Number(formData.period) === p ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: 7, cursor: 'pointer',
                      fontSize: 12, fontWeight: 600,
                      transition: 'all 0.15s',
                    }}
                  >
                    P{p} · {PERIOD_TIMES[p]?.start}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 5: Notes ── */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
              📝 Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Any special notes for this period..."
              style={{
                width: '100%', padding: '10px 14px',
                border: '1.5px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, resize: 'vertical', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* ── Preview card ── */}
          {(formData.day && formData.period) && (
            <div style={{
              background: '#f8fafc', borderRadius: 10, padding: 16,
              border: '1px solid #e2e8f0', marginTop: 20,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Preview
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  background: '#2563eb', color: 'white',
                  padding: '4px 12px', borderRadius: 7, fontSize: 13, fontWeight: 700,
                }}>
                  {formData.day}
                </span>
                <span style={{
                  background: '#eff6ff', color: '#2563eb',
                  padding: '4px 12px', borderRadius: 7, fontSize: 13, fontWeight: 700,
                  border: '1px solid #bfdbfe',
                }}>
                  Period {formData.period}
                </span>
                {formData.startTime && formData.endTime && (
                  <span style={{ fontSize: 13, color: '#64748b' }}>
                    ⏰ {formData.startTime} – {formData.endTime}
                  </span>
                )}
                {formData.subjectId && (
                  <span style={{
                    background: '#dcfce7', color: '#166534',
                    padding: '4px 12px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                    border: '1px solid #bbf7d0',
                  }}>
                    📚 {subjects.find((s) => s.id === formData.subjectId)?.name || '—'}
                  </span>
                )}
                {formData.teacherId && (
                  <span style={{
                    background: '#f5f3ff', color: '#7c3aed',
                    padding: '4px 12px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                    border: '1px solid #e9d5ff',
                  }}>
                    👨‍🏫 {teachers.find((t) => t.id === formData.teacherId)?.name || '—'}
                  </span>
                )}
                {formData.room && (
                  <span style={{ fontSize: 13, color: '#64748b' }}>
                    🏠 {formData.room}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 12,
            paddingTop: 24, marginTop: 24, borderTop: '1px solid #f1f5f9',
          }}>
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEdit ? '💾 Update Period' : '✅ Add Period'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TimetableForm;
