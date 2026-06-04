import React, { useState, useEffect } from 'react';
import { createAssignment, updateAssignment } from '../../api/assignmentApi';
import { getClasses } from '../../api/classApi';
import { getSubjects } from '../../api/classApi';

const AssignmentForm = ({ assignment, onClose }) => {
  const isEdit = !!assignment;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    dueDate: '',
    totalMarks: '',
    instructions: '',
    status: 'active',
  });

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDropdowns();
    if (isEdit && assignment) {
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        classId: assignment.classId || '',
        sectionId: assignment.sectionId || '',
        subjectId: assignment.subjectId || '',
        dueDate: assignment.dueDate
          ? new Date(assignment.dueDate).toISOString().slice(0, 16)
          : '',
        totalMarks: assignment.totalMarks || '',
        instructions: assignment.instructions || '',
        status: assignment.status || 'active',
      });
    }
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [classRes, subjectRes] = await Promise.all([
        getClasses(),
        getSubjects(),
      ]);
      setClasses(classRes.data || []);
      setSubjects(subjectRes.data || []);
    } catch (err) {
      console.error('Failed to load dropdowns:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Load sections when class changes
    if (name === 'classId' && value) {
      loadSections(value);
    }
  };

  const loadSections = async (classId) => {
    try {
      const { getClassSections } = await import('../../api/classApi');
      const res = await getClassSections(classId);
      setSections(res.data || []);
    } catch {
      setSections([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        totalMarks: formData.totalMarks ? Number(formData.totalMarks) : undefined,
      };

      if (isEdit) {
        await updateAssignment(assignment.id, payload);
        setSuccess('Assignment updated successfully!');
      } else {
        await createAssignment(payload);
        setSuccess('Assignment created successfully!');
      }

      setTimeout(() => onClose(true), 1200);
    } catch (err) {
      setError(err.message || 'Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', marginBottom: 6,
    fontSize: 13, fontWeight: 600, color: '#374151',
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            {isEdit ? '✏️ Edit Assignment' : '📝 New Assignment'}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {isEdit ? 'Update assignment details' : 'Create a new assignment for students'}
          </p>
        </div>
        <button onClick={() => onClose(false)}
          style={{
            background: '#f1f5f9', border: 'none', padding: '8px 16px',
            borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#475569',
          }}>
          ← Back
        </button>
      </div>

      {/* Alerts */}
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
          ✅ {success}
        </div>
      )}

      {/* Form */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 28,
      }}>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Assignment Title *</label>
            <input
              type="text" name="title" value={formData.title}
              onChange={handleChange} required placeholder="e.g. Chapter 5 Exercise"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} rows={3}
              placeholder="Brief description of the assignment..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Class + Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Class *</label>
              <select name="classId" value={formData.classId}
                onChange={handleChange} required style={inputStyle}>
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Section</label>
              <select name="sectionId" value={formData.sectionId}
                onChange={handleChange} style={inputStyle}
                disabled={!formData.classId}>
                <option value="">All Sections</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject + Marks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Subject *</label>
              <select name="subjectId" value={formData.subjectId}
                onChange={handleChange} required style={inputStyle}>
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Total Marks</label>
              <input
                type="number" name="totalMarks" value={formData.totalMarks}
                onChange={handleChange} min={0} placeholder="e.g. 100"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Due Date + Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Due Date & Time *</label>
              <input
                type="datetime-local" name="dueDate" value={formData.dueDate}
                onChange={handleChange} required style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" value={formData.status}
                onChange={handleChange} style={inputStyle}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Instructions</label>
            <textarea
              name="instructions" value={formData.instructions}
              onChange={handleChange} rows={4}
              placeholder="Detailed instructions for students..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => onClose(false)}
              style={{
                padding: '10px 24px', border: '1px solid #e2e8f0',
                borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                background: 'white', fontSize: 14, color: '#475569',
              }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{
                padding: '10px 28px', background: loading ? '#93c5fd' : '#2563eb',
                color: 'white', border: 'none', borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 600, fontSize: 14,
              }}>
              {loading
                ? (isEdit ? 'Updating...' : 'Creating...')
                : (isEdit ? 'Update Assignment' : 'Create Assignment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
