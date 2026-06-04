import React, { useState, useEffect, useRef } from 'react';
import {
  createNotice,
  updateNotice,
  publishNotice,
  saveDraft,
} from '../../api/noticeApi';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';

const CATEGORIES = [
  { value: 'general',     label: '📋 General'    },
  { value: 'academic',    label: '📚 Academic'    },
  { value: 'exam',        label: '📖 Exam'        },
  { value: 'holiday',     label: '🎉 Holiday'     },
  { value: 'event',       label: '🎭 Event'       },
  { value: 'fee',         label: '💰 Fee'         },
  { value: 'sports',      label: '⚽ Sports'      },
  { value: 'emergency',   label: '🚨 Emergency'   },
  { value: 'circular',    label: '📄 Circular'    },
];

const AUDIENCE_OPTIONS = [
  { value: 'all',       label: '🌐 Everyone'   },
  { value: 'teachers',  label: '👨‍🏫 Teachers'   },
  { value: 'students',  label: '👥 Students'   },
  { value: 'parents',   label: '👨‍👩‍👧 Parents'    },
  { value: 'principal', label: '🎓 Principal'  },
  { value: 'staff',     label: '🏢 All Staff'  },
];

const emptyForm = {
  title       : '',
  category    : 'general',
  content     : '',
  audience    : 'all',
  status      : 'draft',
  isUrgent    : false,
  isPinned    : false,
  expiryDate  : '',
  tags        : '',
  attachments : [],
};

const NoticeForm = ({ notice, userRole, user, onClose }) => {
  const isEdit    = !!notice;
  const isPrincipal = userRole === 'principal';

  const [formData, setFormData]   = useState(emptyForm);
  const [loading, setLoading]     = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [preview, setPreview]     = useState(false);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef              = useRef(null);

  /* ─── prefill on edit ────────────────────────────────── */
  useEffect(() => {
    if (isEdit && notice) {
      setFormData({
        title      : notice.title       || '',
        category   : notice.category    || 'general',
        content    : notice.content     || notice.description || '',
        audience   : notice.audience    || 'all',
        status     : notice.status      || 'draft',
        isUrgent   : notice.isUrgent    ?? false,
        isPinned   : notice.isPinned    ?? false,
        expiryDate : notice.expiryDate  ? notice.expiryDate.split('T')[0] : '',
        tags       : Array.isArray(notice.tags)
          ? notice.tags.join(', ') : (notice.tags || ''),
        attachments: notice.attachments || [],
      });
      setCharCount((notice.content || '').length);
    }
  }, []);

  /* ─── handlers ───────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((p) => ({ ...p, [name]: val }));
    if (name === 'content') setCharCount(value.length);
  };

  const buildPayload = () => ({
    ...formData,
    tags: formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    expiryDate: formData.expiryDate || undefined,
  });

  /* ─── save draft ─────────────────────────────────────── */
  const handleSaveDraft = async () => {
    if (!formData.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    try {
      const payload = { ...buildPayload(), status: 'draft' };
      if (isEdit) await updateNotice(notice.id, payload);
      else        await saveDraft(payload);
      setSuccess('Draft saved successfully! ✅');
      setTimeout(() => onClose(true), 1200);
    } catch (err) {
      setError(err.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  /* ─── publish ────────────────────────────────────────── */
  const handlePublish = async () => {
    if (!formData.title.trim())   { setError('Title is required');   return; }
    if (!formData.content.trim()) { setError('Content is required'); return; }
    if (!formData.category)       { setError('Category is required'); return; }
    setPublishing(true);
    setError('');
    try {
      const payload = { ...buildPayload(), status: 'published' };
      if (isEdit) {
        await updateNotice(notice.id, payload);
        if (notice.status !== 'published') await publishNotice(notice.id);
      } else {
        await createNotice(payload);
      }
      setSuccess(`Notice ${isEdit ? 'updated and ' : ''}published successfully! 📢`);
      setTimeout(() => onClose(true), 1200);
    } catch (err) {
      setError(err.message || 'Failed to publish notice');
    } finally {
      setPublishing(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const mapped = files.map((f) => ({ name: f.name, file: f, url: '' }));
    setFormData((p) => ({
      ...p, attachments: [...p.attachments, ...mapped],
    }));
  };

  const removeAttachment = (idx) => {
    setFormData((p) => ({
      ...p,
      attachments: p.attachments.filter((_, i) => i !== idx),
    }));
  };

  /* ─── styles ─────────────────────────────────────────── */
  const fgStyle = { marginBottom: 20 };

  const categoryInfo = CATEGORIES.find((c) => c.value === formData.category);
  const audienceInfo = AUDIENCE_OPTIONS.find((a) => a.value === formData.audience);

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
            {isEdit ? '✏️ Edit Notice' : '📢 Create Notice'}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {isEdit
              ? 'Update notice content and settings'
              : 'Draft and publish a new announcement'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="ghost"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? '✏️ Edit' : '👁️ Preview'}
          </Button>
          <Button variant="outline" onClick={() => onClose(false)}>
            ← Back
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 20 }}>

        {/* ══════ FORM PANEL ══════ */}
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 28,
        }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
            📝 Notice Details
          </h3>

          {/* Title */}
          <div style={fgStyle}>
            <Input
              label="Notice Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a clear and descriptive title..."
              required
            />
          </div>

          {/* Category + Audience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, ...fgStyle }}>
            <div>
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={CATEGORIES}
                required
              />
            </div>
            <div>
              <Select
                label="Target Audience"
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                options={AUDIENCE_OPTIONS}
                required
              />
            </div>
          </div>

          {/* Content */}
          <div style={fgStyle}>
            <label style={{
              display: 'block', marginBottom: 6,
              fontSize: 13, fontWeight: 600, color: '#374151',
            }}>
              Content <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              placeholder="Write the full notice content here. Be clear and concise..."
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, resize: 'vertical', outline: 'none',
                boxSizing: 'border-box', lineHeight: 1.7,
                fontFamily: 'inherit',
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e)  => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 5, fontSize: 12, color: '#94a3b8',
            }}>
              <span>Use simple, clear language</span>
              <span style={{ color: charCount > 2000 ? '#dc2626' : '#94a3b8' }}>
                {charCount} chars
              </span>
            </div>
          </div>

          {/* Expiry Date + Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, ...fgStyle }}>
            <div>
              <Input
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                hint="Leave blank for no expiry"
              />
            </div>
            <div>
              <Input
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. exam, holiday, important"
                hint="Comma separated tags"
              />
            </div>
          </div>

          {/* Flags */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 12, marginBottom: 24,
          }}>
            {[
              {
                name: 'isUrgent',
                label: '🚨 Mark as Urgent',
                hint: 'Will be highlighted in red',
                value: formData.isUrgent,
              },
              {
                name: 'isPinned',
                label: '📌 Pin to Top',
                hint: 'Appears in pinned notices banner',
                value: formData.isPinned,
                onlyPrincipal: true,
              },
            ]
              .filter((f) => !f.onlyPrincipal || isPrincipal)
              .map(({ name, label, hint, value }) => (
                <label
                  key={name}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 14px',
                    background: value ? '#f0f9ff' : '#f8fafc',
                    border: `1.5px solid ${value ? '#bfdbfe' : '#e2e8f0'}`,
                    borderRadius: 8, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={value}
                    onChange={handleChange}
                    style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {hint}
                    </div>
                  </div>
                </label>
              ))}
          </div>

          {/* Attachments */}
          <div style={fgStyle}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 10,
            }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                📎 Attachments
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: '#eff6ff', color: '#2563eb',
                  border: '1px solid #bfdbfe', padding: '5px 12px',
                  borderRadius: 6, cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                }}
              >
                + Add File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {formData.attachments.length === 0 ? (
              <div style={{
                border: '2px dashed #e2e8f0', borderRadius: 8,
                padding: '20px', textAlign: 'center',
                color: '#94a3b8', fontSize: 13,
                cursor: 'pointer',
              }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
                Click to attach files (PDF, Word, Images...)
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {formData.attachments.map((att, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 14px',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: 7,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span>📄</span>
                      <span style={{ color: '#374151', fontWeight: 500 }}>
                        {att.name || att.filename || `File ${i + 1}`}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAttachment(i)}
                      style={{
                        background: 'none', border: 'none',
                        color: '#dc2626', cursor: 'pointer',
                        fontSize: 16, fontWeight: 700,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex', gap: 12,
            justifyContent: 'flex-end',
            borderTop: '1px solid #f1f5f9',
            paddingTop: 20, marginTop: 4,
          }}>
            <Button
              variant="outline"
              type="button"
              onClick={() => onClose(false)}
              disabled={loading || publishing}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              loading={loading}
              disabled={publishing}
              onClick={handleSaveDraft}
            >
              💾 Save Draft
            </Button>
            <Button
              loading={publishing}
              disabled={loading}
              onClick={handlePublish}
            >
              📢 {isEdit && notice?.status === 'published'
                ? 'Update Notice'
                : 'Publish Now'}
            </Button>
          </div>
        </div>

        {/* ══════ PREVIEW PANEL ══════ */}
        {preview && (
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: 28, position: 'sticky', top: 80, alignSelf: 'start',
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#374151' }}>
              👁️ Preview
            </h3>
            <PreviewCard formData={formData} categoryInfo={categoryInfo} audienceInfo={audienceInfo} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Preview Card ───────────────────────────────────────── */
const PreviewCard = ({ formData, categoryInfo, audienceInfo }) => {
  const catColors = {
    general    : '#f1f5f9',  academic  : '#dbeafe',
    exam       : '#ede9fe',  holiday   : '#dcfce7',
    event      : '#cffafe',  fee       : '#fef9c3',
    sports     : '#dcfce7',  emergency : '#fee2e2',
    circular   : '#e0f2fe',
  };
  const bg = catColors[formData.category] || '#f1f5f9';

  return (
    <div style={{
      border: '1px solid #e2e8f0', borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Card top */}
      <div style={{ background: bg, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'white', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}>
            {categoryInfo?.label?.split(' ')[0] || '📋'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <h4 style={{
                margin: 0, fontSize: 15, fontWeight: 800,
                color: formData.title ? '#0f172a' : '#94a3b8',
              }}>
                {formData.title || 'Notice Title Here'}
              </h4>
              {formData.isUrgent && (
                <span style={{
                  background: '#ef4444', color: 'white',
                  fontSize: 10, fontWeight: 800,
                  padding: '2px 7px', borderRadius: 10,
                }}>
                  URGENT
                </span>
              )}
              {formData.isPinned && (
                <span style={{ fontSize: 14 }}>📌</span>
              )}
            </div>
            <div style={{
              display: 'flex', gap: 8, marginTop: 5, flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#475569',
                background: 'rgba(255,255,255,0.7)',
                padding: '2px 8px', borderRadius: 10, textTransform: 'capitalize',
              }}>
                {categoryInfo?.label || 'General'}
              </span>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                {audienceInfo?.label || '🌐 Everyone'}
              </span>
              {formData.expiryDate && (
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Expires: {new Date(formData.expiryDate).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        <p style={{
          margin: 0, fontSize: 14, color: formData.content ? '#374151' : '#94a3b8',
          lineHeight: 1.7, whiteSpace: 'pre-wrap',
        }}>
          {formData.content || 'Notice content will appear here...'}
        </p>

        {/* Tags */}
        {formData.tags && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
            {formData.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
              <span key={tag} style={{
                background: '#f1f5f9', color: '#475569',
                padding: '2px 9px', borderRadius: 10,
                fontSize: 11, fontWeight: 600,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: 16, paddingTop: 12,
          borderTop: '1px solid #f1f5f9',
          fontSize: 12, color: '#94a3b8',
        }}>
          <span>
            {formData.status === 'published' ? '✅ Published' : '📝 Draft'}
          </span>
          <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;
