import React, { useState, useEffect } from 'react';
import {
  getClassById,
  getClassStudents,
  getClassSections,
  getClassSubjects,
} from '../../api/classApi';

const ClassDetails = ({ classData, userRole, onBack, onEdit }) => {
  const [details, setDetails]     = useState(classData || null);
  const [students, setStudents]   = useState([]);
  const [sections, setSections]   = useState([]);
  const [subjects, setSubjects]   = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading]     = useState({
    students: false, sections: false, subjects: false,
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [studentPage, setStudentPage]     = useState(1);
  const [studentPagination, setStudentPagination] = useState({
    total: 0, pages: 1,
  });

  const isPrincipal = userRole === 'principal';

  /* ─── load full details ──────────────────────────────── */
  useEffect(() => {
    if (classData?.id) fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await getClassById(classData.id);
      setDetails(res.data || classData);
    } catch { setDetails(classData); }
  };

  /* ─── tab data loaders ───────────────────────────────── */
  useEffect(() => {
    if (!classData?.id) return;
    if (activeTab === 'students') fetchStudents(1);
    if (activeTab === 'sections') fetchSections();
    if (activeTab === 'subjects') fetchSubjects();
  }, [activeTab]);

  const fetchStudents = async (page = 1, search = '') => {
    setLoading((p) => ({ ...p, students: true }));
    try {
      const res = await getClassStudents(classData.id, {
        page, limit: 15,
        ...(search && { search }),
      });
      setStudents(res.data || []);
      if (res.pagination) {
        setStudentPagination({ total: res.pagination.total, pages: res.pagination.pages });
      }
      setStudentPage(page);
    } catch { /* silent */ }
    finally { setLoading((p) => ({ ...p, students: false })); }
  };

  const fetchSections = async () => {
    setLoading((p) => ({ ...p, sections: true }));
    try {
      const res = await getClassSections(classData.id);
      setSections(res.data || []);
    } catch { /* silent */ }
    finally { setLoading((p) => ({ ...p, sections: false })); }
  };

  const fetchSubjects = async () => {
    setLoading((p) => ({ ...p, subjects: true }));
    try {
      const res = await getClassSubjects(classData.id);
      setSubjects(res.data || []);
    } catch { /* silent */ }
    finally { setLoading((p) => ({ ...p, subjects: false })); }
  };

  /* ─── helpers ────────────────────────────────────────── */
  const TABS = [
    { key: 'overview',  label: '📋 Overview'  },
    { key: 'students',  label: '👥 Students'  },
    { key: 'sections',  label: '📂 Sections'  },
    { key: 'subjects',  label: '📚 Subjects'  },
  ];

  const SUBJECT_COLORS = [
    '#eff6ff', '#f0fdf4', '#fdf4ff', '#fff7ed',
    '#f0f9ff', '#fdf2f8', '#ecfdf5', '#fefce8',
  ];

  if (!details) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
      ⏳ Loading class details...
    </div>
  );

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 24,
      }}>
        <div>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', color: '#2563eb',
              cursor: 'pointer', fontSize: 14, padding: '0 0 8px',
            }}
          >
            ← Back to Classes
          </button>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
            🏫 {details.name}
          </h2>
          {details.description && (
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
              {details.description}
            </p>
          )}
        </div>
        {isPrincipal && (
          <button
            onClick={() => onEdit(details)}
            style={{
              background: '#2563eb', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: 8,
              cursor: 'pointer', fontWeight: 600, fontSize: 14,
            }}
          >
            ✏️ Edit Class
          </button>
        )}
      </div>

      {/* ── Quick Stats ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {[
          { label: 'Total Students', value: details.studentsCount ?? students.length ?? 0,  icon: '👥', color: '#2563eb', bg: '#eff6ff'  },
          { label: 'Sections',       value: details.sectionsCount ?? sections.length ?? 0,  icon: '📂', color: '#7c3aed', bg: '#f5f3ff'  },
          { label: 'Subjects',       value: details.subjectsCount ?? subjects.length ?? 0,  icon: '📚', color: '#d97706', bg: '#fef9c3'  },
          { label: 'Capacity',       value: details.capacity      ?? '—',                    icon: '🏷️', color: '#16a34a', bg: '#dcfce7'  },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
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
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
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

      {/* ══════ OVERVIEW TAB ══════ */}
      {activeTab === 'overview' && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
        }}>
          {/* Info card */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
          }}>
            <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700 }}>
              Class Information
            </h3>
            {[
              { label: 'Class Name',    value: details.name           || '—' },
              { label: 'Description',   value: details.description    || '—' },
              { label: 'Class Teacher', value: details.classTeacher   || '—' },
              { label: 'Capacity',      value: details.capacity       || '—' },
              { label: 'Academic Year', value: details.academicYear   || '—' },
              { label: 'Status',        value: details.isActive !== false ? '✅ Active' : '❌ Inactive' },
              { label: 'Created On',    value: details.createdAt
                ? new Date(details.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })
                : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #f1f5f9',
                fontSize: 14,
              }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>{label}</span>
                <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right', maxWidth: '60%' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Sections overview */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 24,
          }}>
            <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700 }}>
              Sections Overview
            </h3>
            {details.sections && details.sections.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {details.sections.map((sec, i) => (
                  <div key={sec.id || i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '12px 16px',
                    background: '#f8fafc', borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: '#e0e7ff', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 14, color: '#4338ca',
                      }}>
                        {sec.name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          Section {sec.name}
                        </div>
                        {sec.classTeacher && (
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>
                            {sec.classTeacher}
                          </div>
                        )}
                      </div>
                    </div>
                    <span style={{
                      background: '#eff6ff', color: '#2563eb',
                      padding: '3px 10px', borderRadius: 12,
                      fontSize: 12, fontWeight: 600,
                    }}>
                      {sec.studentsCount ?? 0} students
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
                <p style={{ fontSize: 14 }}>No sections yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ STUDENTS TAB ══════ */}
      {activeTab === 'students' && (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <form
              onSubmit={(e) => { e.preventDefault(); fetchStudents(1, studentSearch); }}
              style={{ display: 'flex', gap: 10 }}
            >
              <input
                type="text"
                placeholder="Search students by name, roll no..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{
                  flex: 1, padding: '9px 14px',
                  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                }}
              />
              <button type="submit" style={{
                background: '#2563eb', color: 'white', border: 'none',
                padding: '9px 20px', borderRadius: 8,
                cursor: 'pointer', fontWeight: 600, fontSize: 14,
              }}>
                Search
              </button>
            </form>
          </div>

          {loading.students ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              ⏳ Loading students...
            </div>
          ) : students.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <p style={{ fontWeight: 600 }}>No students in this class</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['#', 'Name', 'Roll No', 'Section', 'Status', 'Contact'].map((h) => (
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
                    {students.map((s, idx) => (
                      <tr
                        key={s.id || idx}
                        style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: 13 }}>
                          {(studentPage - 1) * 15 + idx + 1}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: '#eff6ff', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: 14, color: '#2563eb',
                            }}>
                              {(s.firstName || s.name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>
                                {s.firstName && s.lastName
                                  ? `${s.firstName} ${s.lastName}`
                                  : s.name || 'N/A'}
                              </div>
                              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                                {s.email || '—'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                          {s.rollNo || '—'}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 14, color: '#475569' }}>
                          {s.sectionName || s.section?.name || '—'}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{
                            background: s.status === 'active' ? '#dcfce7' : '#fee2e2',
                            color: s.status === 'active' ? '#166534' : '#991b1b',
                            padding: '3px 10px', borderRadius: 12,
                            fontSize: 12, fontWeight: 600,
                          }}>
                            {s.status || 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: '#64748b' }}>
                          {s.phone || s.parentPhone || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {studentPagination.pages > 1 && (
                <div style={{
                  padding: '14px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: '1px solid #f1f5f9',
                }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>
                    {studentPagination.total} students total
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      disabled={studentPage === 1}
                      onClick={() => fetchStudents(studentPage - 1, studentSearch)}
                      style={{
                        padding: '6px 14px', border: '1px solid #e2e8f0',
                        borderRadius: 6, cursor: studentPage === 1 ? 'not-allowed' : 'pointer',
                        background: 'white', fontSize: 13,
                        opacity: studentPage === 1 ? 0.5 : 1,
                      }}
                    >
                      ← Prev
                    </button>
                    <button
                      disabled={studentPage === studentPagination.pages}
                      onClick={() => fetchStudents(studentPage + 1, studentSearch)}
                      style={{
                        padding: '6px 14px', border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        cursor: studentPage === studentPagination.pages ? 'not-allowed' : 'pointer',
                        background: 'white', fontSize: 13,
                        opacity: studentPage === studentPagination.pages ? 0.5 : 1,
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════ SECTIONS TAB ══════ */}
      {activeTab === 'sections' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))',
          gap: 16,
        }}>
          {loading.sections ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8', gridColumn: '1/-1' }}>
              ⏳ Loading sections...
            </div>
          ) : sections.length === 0 ? (
            <div style={{
              padding: 60, textAlign: 'center', color: '#94a3b8',
              gridColumn: '1/-1',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
              <p style={{ fontWeight: 600 }}>No sections in this class</p>
            </div>
          ) : (
            sections.map((sec, i) => (
              <div key={sec.id || i} style={{
                background: 'white', borderRadius: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                padding: 20, border: '1px solid #e2e8f0',
              }}>
                {/* Section header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: '#f5f3ff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 800, color: '#7c3aed',
                  }}>
                    {sec.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                      Section {sec.name}
                    </h3>
                    <span style={{
                      background: sec.isActive !== false ? '#dcfce7' : '#fee2e2',
                      color: sec.isActive !== false ? '#166534' : '#991b1b',
                      padding: '2px 8px', borderRadius: 10,
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {sec.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Section stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 10, marginBottom: 14,
                }}>
                  {[
                    { label: 'Students', value: sec.studentsCount ?? 0, icon: '👥' },
                    { label: 'Capacity', value: sec.capacity ?? '—', icon: '🏷️' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{
                      background: '#f8fafc', borderRadius: 8,
                      padding: '10px 12px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{value}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
                    </div>
                  ))}
                </div>

                {sec.classTeacher && (
                  <div style={{
                    fontSize: 13, color: '#475569',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span>👨‍🏫</span>
                    <span>{sec.classTeacher}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ══════ SUBJECTS TAB ══════ */}
      {activeTab === 'subjects' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))',
          gap: 16,
        }}>
          {loading.subjects ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8', gridColumn: '1/-1' }}>
              ⏳ Loading subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div style={{
              padding: 60, textAlign: 'center', color: '#94a3b8',
              gridColumn: '1/-1',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
              <p style={{ fontWeight: 600 }}>No subjects assigned to this class</p>
            </div>
          ) : (
            subjects.map((sub, i) => (
              <div key={sub.id || i} style={{
                background: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
                borderRadius: 12, padding: 20,
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>
                  {sub.icon || '📖'}
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>
                  {sub.name}
                </h3>
                {sub.code && (
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                    Code: {sub.code}
                  </div>
                )}
                {sub.teacherName && (
                  <div style={{
                    fontSize: 13, color: '#475569',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span>👨‍🏫</span>
                    <span>{sub.teacherName}</span>
                  </div>
                )}
                {sub.weeklyClasses && (
                  <div style={{
                    marginTop: 10, fontSize: 12,
                    color: '#64748b', display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    📅 {sub.weeklyClasses} classes/week
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClassDetails;
