import React, { useState, useEffect, useCallback } from 'react';
import {
  getClasses,
  deleteClass,
  getSections,
  deleteSection,
} from '../../api/classApi';
import ClassForm from './ClassForm';
import ClassDetails from './ClassDetails';

const ClassList = ({ userRole }) => {
  const [classes, setClasses]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [activeTab, setActiveTab]       = useState('classes');
  const [sections, setSections]         = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [search, setSearch]             = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [formType, setFormType]         = useState('class');  // 'class' | 'section'
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewClass, setViewClass]       = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteType, setDeleteType]     = useState('class');

  const isPrincipal = userRole === 'principal';

  /* ─── fetch classes ──────────────────────────────────── */
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getClasses({ search: search || undefined });
      setClasses(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  }, [search]);

  /* ─── fetch sections ─────────────────────────────────── */
  const fetchSections = useCallback(async () => {
    setSectionsLoading(true);
    try {
      const res = await getSections();
      setSections(res.data || []);
    } catch { /* silent */ }
    finally { setSectionsLoading(false); }
  }, []);

  useEffect(() => { fetchClasses(); }, []);
  useEffect(() => {
    if (activeTab === 'sections') fetchSections();
  }, [activeTab]);

  /* ─── delete handlers ────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteType === 'class') {
        await deleteClass(deleteConfirm.id);
        fetchClasses();
      } else {
        await deleteSection(deleteConfirm.id);
        fetchSections();
      }
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || 'Delete failed');
      setDeleteConfirm(null);
    }
  };

  const openForm = (type, item = null) => {
    setFormType(type);
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setShowForm(false);
    setSelectedItem(null);
    if (refresh) {
      if (formType === 'class') fetchClasses();
      else fetchSections();
    }
  };

  /* ─── sub-views ──────────────────────────────────────── */
  if (viewClass) {
    return (
      <ClassDetails
        classData={viewClass}
        userRole={userRole}
        onBack={() => setViewClass(null)}
        onEdit={(c) => { setViewClass(null); openForm('class', c); }}
      />
    );
  }

  if (showForm) {
    return (
      <ClassForm
        type={formType}
        item={selectedItem}
        classes={classes}
        onClose={handleFormClose}
      />
    );
  }

  /* ─── filtered classes ───────────────────────────────── */
  const filteredClasses = classes.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>🏫 Classes & Sections</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            Manage classes, sections and academic structure
          </p>
        </div>
        {isPrincipal && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => openForm('section')}
              style={{
                background: '#f1f5f9', color: '#475569', border: 'none',
                padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
                fontWeight: 600, fontSize: 14,
              }}
            >
              + Add Section
            </button>
            <button
              onClick={() => openForm('class')}
              style={{
                background: '#2563eb', color: 'white', border: 'none',
                padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
                fontWeight: 600, fontSize: 14,
              }}
            >
              + Add Class
            </button>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          background: '#fee2e2', color: '#991b1b', padding: '12px 16px',
          borderRadius: 8, marginBottom: 20, fontSize: 14,
        }}>
          ⚠️ {error}
          <button
            onClick={() => setError('')}
            style={{
              float: 'right', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 16, color: '#991b1b',
            }}
          >×</button>
        </div>
      )}

      {/* ── Summary Stats ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          {
            label: 'Total Classes', value: classes.length,
            icon: '🏫', color: '#2563eb', bg: '#eff6ff',
          },
          {
            label: 'Total Sections',
            value: classes.reduce((acc, c) => acc + (c.sectionsCount || 0), 0),
            icon: '📂', color: '#7c3aed', bg: '#f5f3ff',
          },
          {
            label: 'Total Students',
            value: classes.reduce((acc, c) => acc + (c.studentsCount || 0), 0),
            icon: '👥', color: '#16a34a', bg: '#dcfce7',
          },
          {
            label: 'Total Subjects',
            value: classes.reduce((acc, c) => acc + (c.subjectsCount || 0), 0),
            icon: '📚', color: '#d97706', bg: '#fef9c3',
          },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: 20, display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: '2px solid #f1f5f9',
      }}>
        {[
          { key: 'classes',  label: '🏫 Classes'  },
          { key: 'sections', label: '📂 Sections' },
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

      {/* ══════ CLASSES TAB ══════ */}
      {activeTab === 'classes' && (
        <>
          {/* Search */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: 16, marginBottom: 20,
          }}>
            <input
              type="text"
              placeholder="🔍  Search classes by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Classes Grid */}
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
              Loading classes...
            </div>
          ) : filteredClasses.length === 0 ? (
            <div style={{
              padding: 60, textAlign: 'center', color: '#94a3b8',
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏫</div>
              <p style={{ fontWeight: 600, fontSize: 16 }}>No classes found</p>
              {isPrincipal && (
                <button
                  onClick={() => openForm('class')}
                  style={{
                    marginTop: 12, background: '#2563eb', color: 'white',
                    border: 'none', padding: '10px 24px', borderRadius: 8,
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  + Create First Class
                </button>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))',
              gap: 20,
            }}>
              {filteredClasses.map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  isPrincipal={isPrincipal}
                  onView={() => setViewClass(cls)}
                  onEdit={() => openForm('class', cls)}
                  onDelete={() => { setDeleteType('class'); setDeleteConfirm(cls); }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ══════ SECTIONS TAB ══════ */}
      {activeTab === 'sections' && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          {sectionsLoading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              ⏳ Loading sections...
            </div>
          ) : sections.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
              <p style={{ fontWeight: 600 }}>No sections found</p>
              {isPrincipal && (
                <button
                  onClick={() => openForm('section')}
                  style={{
                    marginTop: 12, background: '#2563eb', color: 'white',
                    border: 'none', padding: '10px 24px', borderRadius: 8,
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  + Create First Section
                </button>
              )}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Section Name', 'Class', 'Students', 'Class Teacher', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: 12, fontWeight: 700, color: '#64748b',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '1px solid #e2e8f0',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((sec, idx) => (
                  <tr
                    key={sec.id || idx}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 8,
                          background: '#f5f3ff', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, fontWeight: 700, color: '#7c3aed',
                        }}>
                          {sec.name?.charAt(0) || 'S'}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{sec.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569' }}>
                      {sec.className || sec.class?.name || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14 }}>
                      <span style={{
                        background: '#eff6ff', color: '#2563eb',
                        padding: '3px 10px', borderRadius: 12,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {sec.studentsCount ?? 0} students
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569' }}>
                      {sec.classTeacher || sec.teacher?.name || '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: sec.isActive !== false ? '#dcfce7' : '#fee2e2',
                        color: sec.isActive !== false ? '#166534' : '#991b1b',
                        padding: '3px 10px', borderRadius: 12,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {sec.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {isPrincipal && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => openForm('section', sec)}
                            style={{
                              background: '#f0fdf4', color: '#166534', border: 'none',
                              padding: '6px 12px', borderRadius: 6,
                              cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => { setDeleteType('section'); setDeleteConfirm(sec); }}
                            style={{
                              background: '#fff1f2', color: '#be123c', border: 'none',
                              padding: '6px 12px', borderRadius: 6,
                              cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: 32,
            maxWidth: 420, width: '90%',
          }}>
            <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: 18 }}>
              Delete {deleteType === 'class' ? 'Class' : 'Section'}?
            </h3>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 24 }}>
              Are you sure you want to delete{' '}
              <strong>"{deleteConfirm.name}"</strong>?
              {deleteType === 'class' && (
                <span style={{ display: 'block', marginTop: 8, color: '#dc2626' }}>
                  ⚠️ This will also remove all associated sections and data.
                </span>
              )}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 24px', border: '1px solid #e2e8f0',
                  borderRadius: 8, cursor: 'pointer',
                  fontWeight: 600, background: 'white',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 24px', background: '#dc2626',
                  color: 'white', border: 'none', borderRadius: 8,
                  cursor: 'pointer', fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Class Card Sub-component ───────────────────────────── */
const ClassCard = ({ cls, isPrincipal, onView, onEdit, onDelete }) => {
  const colors = [
    { bg: '#eff6ff', border: '#bfdbfe', accent: '#2563eb' },
    { bg: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a' },
    { bg: '#fdf4ff', border: '#e9d5ff', accent: '#9333ea' },
    { bg: '#fff7ed', border: '#fed7aa', accent: '#ea580c' },
    { bg: '#f0f9ff', border: '#bae6fd', accent: '#0284c7' },
    { bg: '#fdf2f8', border: '#fbcfe8', accent: '#db2777' },
  ];
  const scheme = colors[cls.name?.charCodeAt(0) % colors.length] || colors[0];

  return (
    <div style={{
      background: 'white', borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: `1px solid ${scheme.border}`,
      overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      {/* Card top color strip */}
      <div style={{ height: 6, background: scheme.accent }} />

      <div style={{ padding: 20 }}>
        {/* Class name + status */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 10,
              background: scheme.bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 800, color: scheme.accent,
            }}>
              {cls.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{cls.name}</h3>
              {cls.description && (
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94a3b8' }}>
                  {cls.description.length > 40
                    ? `${cls.description.slice(0, 40)}...`
                    : cls.description}
                </p>
              )}
            </div>
          </div>
          <span style={{
            background: cls.isActive !== false ? '#dcfce7' : '#fee2e2',
            color: cls.isActive !== false ? '#166534' : '#991b1b',
            padding: '3px 10px', borderRadius: 12,
            fontSize: 11, fontWeight: 700,
          }}>
            {cls.isActive !== false ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: 8, marginBottom: 18,
        }}>
          {[
            { label: 'Students', value: cls.studentsCount ?? 0, icon: '👥' },
            { label: 'Sections', value: cls.sectionsCount ?? 0, icon: '📂' },
            { label: 'Subjects', value: cls.subjectsCount ?? 0, icon: '📚' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{
              background: scheme.bg, borderRadius: 8, padding: '10px 8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: scheme.accent }}>{value}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Class teacher */}
        {cls.classTeacher && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 16, fontSize: 13, color: '#475569',
          }}>
            <span>👨‍🏫</span>
            <span>{cls.classTeacher}</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onView}
            style={{
              flex: 1, background: scheme.bg, color: scheme.accent,
              border: `1px solid ${scheme.border}`, padding: '8px 0',
              borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
            }}
          >
            View Details
          </button>
          {isPrincipal && (
            <>
              <button
                onClick={onEdit}
                style={{
                  background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0',
                  padding: '8px 14px', borderRadius: 8,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}
              >
                ✏️
              </button>
              <button
                onClick={onDelete}
                style={{
                  background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3',
                  padding: '8px 14px', borderRadius: 8,
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassList;
