import React, { useState, useEffect } from 'react';
import {
  createClass, updateClass,
  createSection, updateSection,
  getClasses,
} from '../../api/classApi';

const ClassForm = ({ type = 'class', item, classes: classesProp, onClose }) => {
  const isEdit    = !!item;
  const isSection = type === 'section';

  /* ── class form state ─────────────────────────────────── */
  const [classData, setClassData] = useState({
    name        : '',
    description : '',
    classTeacher: '',
    capacity    : '',
    isActive    : true,
  });

  /* ── section form state ───────────────────────────────── */
  const [sectionData, setSectionData] = useState({
    name        : '',
    classId     : '',
    classTeacher: '',
    capacity    : '',
    isActive    : true,
  });

  const [classes, setClasses]   = useState(classesProp || []);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  /* ── prefill on edit ──────────────────────────────────── */
  useEffect(() => {
    if (!classesProp || classesProp.length === 0) {
      (async () => {
        try {
          const res = await getClasses();
          setClasses(res.data || []);
        } catch { /* silent */ }
      })();
    }

    if (isEdit && item) {
      if (!isSection) {
        setClassData({
          name        : item.name         || '',
          description : item.description  || '',
          classTeacher: item.classTeacher || '',
          capacity    : item.capacity     || '',
          isActive    : item.isActive     !== false,
        });
      } else {
        setSectionData({
          name        : item.name         || '',
          classId     : item.classId      || '',
          classTeacher: item.classTeacher || '',
          capacity    : item.capacity     || '',
          isActive    : item.isActive     !== false,
        });
      }
    }
  }, []);

  /* ── handlers ─────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const val = inputType === 'checkbox' ? checked : value;
    if (!isSection) setClassData((p) => ({ ...p, [name]: val }));
    else setSectionData((p) => ({ ...p, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isSection) {
        const payload = {
          ...classData,
          capacity: classData.capacity ? Number(classData.capacity) : undefined,
        };
        if (isEdit) await updateClass(item.id, payload);
        else        await createClass(payload);
      } else {
        const payload = {
          ...sectionData,
          capacity: sectionData.capacity ? Number(sectionData.capacity) : undefined,
        };
        if (isEdit) await updateSection(item.id, payload);
        else        await createSection(payload);
      }

      setSuccess(`${isSection ? 'Section' : 'Class'} ${isEdit ? 'updated' : 'created'} successfully! ✅`);
      setTimeout(() => onClose(true), 1200);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  /* ── styles ───────────────────────────────────────────── */
  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', marginBottom: 6,
    fontSize: 13, fontWeight: 600, color: '#374151',
  };

  const formValues  = isSection ? sectionData : classData;

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
            {isEdit
              ? `✏️ Edit ${isSection ? 'Section' : 'Class'}`
              : `➕ New ${isSection ? 'Section' : 'Class'}`}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {isEdit
              ? `Update ${isSection ? 'section' : 'class'} details`
              : `Create a new ${isSection ? 'section' : 'class'}`}
          </p>
        </div>
        <button
          onClick={() => onClose(false)}
          style={{
            background: '#f1f5f9', border: 'none', padding: '9px 18px',
            borderRadius: 8, cursor: 'pointer', fontSize: 14,
            color: '#475569', fontWeight: 600,
          }}
        >
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
          {success}
        </div>
      )}

      {/* Form Card */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 28,
      }}>
        <form onSubmit={handleSubmit}>

          {/* Section: Class selector */}
          {isSection && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Class *</label>
              <select
                name="classId"
                value={sectionData.classId}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              {isSection ? 'Section Name' : 'Class Name'} *
            </label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              required
              placeholder={isSection ? 'e.g. A, B, Rose, Lotus...' : 'e.g. Class 1, Grade 10...'}
              style={inputStyle}
            />
          </div>

          {/* Description — class only */}
          {!isSection && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={classData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Optional description..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          )}

          {/* Class Teacher + Capacity */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 16, marginBottom: 20,
          }}>
            <div>
              <label style={labelStyle}>Class Teacher</label>
              <input
                type="text"
                name="classTeacher"
                value={formValues.classTeacher}
                onChange={handleChange}
                placeholder="Teacher name or ID"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formValues.capacity}
                onChange={handleChange}
                min={1}
                placeholder="Max students (e.g. 40)"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Active toggle */}
          <div style={{
            marginBottom: 28, display: 'flex',
            alignItems: 'center', gap: 12,
          }}>
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
              <input
                type="checkbox"
                name="isActive"
                checked={formValues.isActive}
                onChange={handleChange}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute', cursor: 'pointer',
                top: 0, left: 0, right: 0, bottom: 0,
                background: formValues.isActive ? '#2563eb' : '#cbd5e1',
                borderRadius: 34, transition: '0.3s',
              }}>
                <span style={{
                  position: 'absolute', content: '',
                  height: 18, width: 18, left: formValues.isActive ? 22 : 3,
                  bottom: 3, background: 'white', borderRadius: '50%',
                  transition: '0.3s',
                }} />
              </span>
            </label>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
              {formValues.isActive ? 'Active' : 'Inactive'}
            </span>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              {isSection
                ? 'Inactive sections won\'t appear in dropdowns'
                : 'Inactive classes won\'t accept new students'}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => onClose(false)}
              style={{
                padding: '10px 24px', border: '1px solid #e2e8f0',
                borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                background: 'white', fontSize: 14, color: '#475569',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 28px',
                background: loading ? '#93c5fd' : '#2563eb',
                color: 'white', border: 'none', borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: 14,
              }}
            >
              {loading
                ? (isEdit ? 'Updating...' : 'Creating...')
                : (isEdit
                  ? `Update ${isSection ? 'Section' : 'Class'}`
                  : `Create ${isSection ? 'Section' : 'Class'}`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
