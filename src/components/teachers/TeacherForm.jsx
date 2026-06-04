import React, { useState, useEffect, useRef } from 'react';
import { createTeacher, updateTeacher, uploadProfilePhoto } from '../../api/teacherApi';
import { getSubjects } from '../../api/subjectApi';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';

const TABS = [
  { key: 'personal',     label: '👤 Personal'       },
  { key: 'professional', label: '💼 Professional'    },
  { key: 'subjects',     label: '📚 Subjects'        },
  { key: 'address',      label: '🏠 Address'         },
  { key: 'documents',    label: '📄 Documents'       },
];

const DESIGNATION_OPTIONS = [
  'Principal','Vice Principal','Head of Department',
  'Senior Teacher','Teacher','Assistant Teacher',
  'Lecturer','Lab Assistant','Sports Coach','Counselor',
];

const QUALIFICATION_OPTIONS = [
  'B.Ed','M.Ed','B.A + B.Ed','M.A + B.Ed',
  'B.Sc + B.Ed','M.Sc + B.Ed','PhD','Other',
];

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

const emptyForm = {
  /* personal */
  name            : '',
  dateOfBirth     : '',
  gender          : '',
  bloodGroup      : '',
  nationality     : 'Indian',
  religion        : '',
  email           : '',
  phone           : '',
  alternatePhone  : '',
  profilePhoto    : '',
  status          : 'active',
  /* professional */
  employeeId      : '',
  designation     : '',
  department      : '',
  qualification   : '',
  experience      : '',
  joiningDate     : new Date().toISOString().split('T')[0],
  salary          : '',
  bankAccount     : '',
  bankName        : '',
  ifscCode        : '',
  panNumber       : '',
  /* subjects */
  subjectIds      : [],
  classAssignments: '',
  /* address */
  address         : '',
  city            : '',
  state           : '',
  pincode         : '',
  country         : 'India',
  /* documents */
  aadharNo        : '',
  resumeUrl       : '',
  certificates    : '',
};

const TeacherForm = ({ teacher, userRole, onClose }) => {
  const isEdit = !!teacher;

  const [activeTab, setActiveTab]   = useState('personal');
  const [formData, setFormData]     = useState(emptyForm);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [errors, setErrors]         = useState({});
  const fileRef                     = useRef(null);

  /* ─── init ───────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try { const r = await getSubjects(); setAllSubjects(r.data || []); } catch { /* silent */ }
    })();

    if (isEdit && teacher) {
      setFormData({
        name           : teacher.name            || '',
        dateOfBirth    : teacher.dateOfBirth      ? teacher.dateOfBirth.split('T')[0] : '',
        gender         : teacher.gender           || '',
        bloodGroup     : teacher.bloodGroup       || '',
        nationality    : teacher.nationality      || 'Indian',
        religion       : teacher.religion         || '',
        email          : teacher.email            || '',
        phone          : teacher.phone            || '',
        alternatePhone : teacher.alternatePhone   || '',
        profilePhoto   : teacher.profilePhoto     || '',
        status         : teacher.status           || 'active',
        employeeId     : teacher.employeeId       || '',
        designation    : teacher.designation      || '',
        department     : teacher.department       || '',
        qualification  : teacher.qualification    || '',
        experience     : teacher.experience       || '',
        joiningDate    : teacher.joiningDate       ? teacher.joiningDate.split('T')[0] : '',
        salary         : teacher.salary           || '',
        bankAccount    : teacher.bankAccount      || '',
        bankName       : teacher.bankName         || '',
        ifscCode       : teacher.ifscCode         || '',
        panNumber      : teacher.panNumber        || '',
        subjectIds     : (teacher.subjects || []).map((s) => s.id || s),
        classAssignments: teacher.classAssignments|| '',
        address        : teacher.address          || '',
        city           : teacher.city             || '',
        state          : teacher.state            || '',
        pincode        : teacher.pincode          || '',
        country        : teacher.country          || 'India',
        aadharNo       : teacher.aadharNo         || '',
        resumeUrl      : teacher.resumeUrl        || '',
        certificates   : teacher.certificates     || '',
      });
      if (teacher.profilePhoto) setPhotoPreview(teacher.profilePhoto);
    }
  }, []);

  /* ─── handlers ───────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const toggleSubject = (id) => {
    setFormData((p) => ({
      ...p,
      subjectIds: p.subjectIds.includes(id)
        ? p.subjectIds.filter((x) => x !== id)
        : [...p.subjectIds, id],
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
    if (isEdit && teacher?.id) {
      setPhotoUploading(true);
      try {
        const res = await uploadProfilePhoto(teacher.id, file);
        setFormData((p) => ({ ...p, profilePhoto: res.url || res.data?.url || '' }));
        setSuccess('Photo uploaded!');
      } catch { setError('Photo upload failed'); }
      finally { setPhotoUploading(false); }
    }
  };

  /* ─── validate ───────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!formData.name.trim())     e.name        = 'Name is required';
    if (!formData.gender)          e.gender      = 'Gender is required';
    if (!formData.email.trim())    e.email       = 'Email is required';
    if (!formData.designation)     e.designation = 'Designation is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ─── submit ─────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setActiveTab('personal'); return; }
    setLoading(true);
    setError('');
    try {
      if (isEdit) await updateTeacher(teacher.id, formData);
      else        await createTeacher(formData);
      setSuccess(`Teacher ${isEdit ? 'updated' : 'added'} successfully! ✅`);
      setTimeout(() => onClose(true), 1200);
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const ip = (name, extra = {}) => ({
    name, value: formData[name], onChange: handleChange, error: errors[name], ...extra,
  });

  const textareaStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, resize: 'vertical', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6,
  };

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
            {isEdit ? '✏️ Edit Teacher' : '👨‍🏫 Add Teacher'}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {isEdit ? 'Update teacher profile and details' : 'Register a new teaching staff member'}
          </p>
        </div>
        <Button variant="outline" onClick={() => onClose(false)}>← Back</Button>
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>

          {/* ── Left sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Photo card */}
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              padding: 20, textAlign: 'center',
            }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 90, height: 90, borderRadius: '50%',
                  margin: '0 auto 12px',
                  background: photoPreview ? 'transparent'
                    : formData.gender === 'female'
                    ? 'linear-gradient(135deg,#9333ea,#c026d3)'
                    : 'linear-gradient(135deg,#2563eb,#0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden',
                  border: '3px solid #e2e8f0', position: 'relative',
                }}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 32, color: 'white' }}>
                    {formData.name ? formData.name.charAt(0).toUpperCase() : '👨‍🏫'}
                  </span>
                )}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s', fontSize: 20,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  📷
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={photoUploading}
                style={{
                  background: '#eff6ff', color: '#2563eb',
                  border: '1px solid #bfdbfe', padding: '6px 12px',
                  borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}
              >
                {photoUploading ? '⏳...' : '📷 Change Photo'}
              </button>
              {formData.name && (
                <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  {formData.name}
                </div>
              )}
              {formData.designation && (
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  {formData.designation}
                </div>
              )}
            </div>

            {/* Tab nav */}
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
            }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key} type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '12px 16px',
                    background: activeTab === tab.key ? '#eff6ff' : 'white',
                    border: 'none',
                    borderLeft: activeTab === tab.key ? '3px solid #2563eb' : '3px solid transparent',
                    cursor: 'pointer', fontSize: 13,
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    color: activeTab === tab.key ? '#2563eb' : '#475569',
                    textAlign: 'left', borderBottom: '1px solid #f8fafc',
                  }}
                >
                  {tab.label}
                  {tab.key === 'personal' &&
                    Object.keys(errors).some((k) => ['name','gender','email'].includes(k)) && (
                      <span style={{
                        marginLeft: 'auto', width: 8, height: 8,
                        borderRadius: '50%', background: '#ef4444', flexShrink: 0,
                      }} />
                  )}
                  {tab.key === 'professional' && errors.designation && (
                    <span style={{
                      marginLeft: 'auto', width: 8, height: 8,
                      borderRadius: '50%', background: '#ef4444', flexShrink: 0,
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Tab content ── */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 28,
          }}>

            {/* ══ PERSONAL ══ */}
            {activeTab === 'personal' && (
              <div>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                  👤 Personal Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Input label="Full Name" required placeholder="Teacher's full name" {...ip('name')} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Date of Birth" type="date" {...ip('dateOfBirth')} />
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                        Gender <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[
                          { value: 'male',   label: '👨 Male'   },
                          { value: 'female', label: '👩 Female' },
                        ].map(({ value, label }) => (
                          <label key={value} style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 6,
                            padding: '9px 12px',
                            border: `2px solid ${formData.gender === value ? '#2563eb' : '#e2e8f0'}`,
                            borderRadius: 8, cursor: 'pointer',
                            background: formData.gender === value ? '#eff6ff' : 'white',
                            fontSize: 13, fontWeight: formData.gender === value ? 700 : 500,
                            color: formData.gender === value ? '#2563eb' : '#475569',
                            transition: 'all 0.15s',
                          }}>
                            <input
                              type="radio" name="gender" value={value}
                              checked={formData.gender === value}
                              onChange={handleChange}
                              style={{ display: 'none' }}
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                      {errors.gender && (
                        <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.gender}</p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Email" type="email" required placeholder="teacher@school.com" {...ip('email')} />
                    <Input label="Phone" placeholder="+91 9876543210" {...ip('phone')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <Input label="Alternate Phone" placeholder="+91 9876543210" {...ip('alternatePhone')} />
                    <Select
                      label="Blood Group"
                      {...ip('bloodGroup')}
                      options={BLOOD_GROUPS.map((b) => ({ value: b, label: b }))}
                      placeholder="Select"
                    />
                    <Input label="Nationality" {...ip('nationality')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Religion" placeholder="e.g. Hindu" {...ip('religion')} />
                    <Select
                      label="Status"
                      {...ip('status')}
                      options={[
                        { value: 'active',   label: '✅ Active'      },
                        { value: 'inactive', label: '⏸ Inactive'    },
                        { value: 'on_leave', label: '🏖 On Leave'    },
                        { value: 'resigned', label: '🚪 Resigned'    },
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ══ PROFESSIONAL ══ */}
            {activeTab === 'professional' && (
              <div>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                  💼 Professional Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Employee ID" placeholder="e.g. EMP/2024/001" {...ip('employeeId')} />
                    <Select
                      label="Designation" required
                      {...ip('designation')}
                      options={DESIGNATION_OPTIONS.map((d) => ({ value: d, label: d }))}
                      placeholder="Select designation"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Department" placeholder="e.g. Science, Commerce" {...ip('department')} />
                    <Select
                      label="Qualification"
                      {...ip('qualification')}
                      options={QUALIFICATION_OPTIONS.map((q) => ({ value: q, label: q }))}
                      placeholder="Select"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <Input label="Experience (Years)" type="number" min={0} placeholder="e.g. 5" {...ip('experience')} />
                    <Input label="Joining Date"       type="date"   {...ip('joiningDate')} />
                    <Input label="Monthly Salary (₹)" type="number" min={0} placeholder="e.g. 25000" {...ip('salary')} />
                  </div>

                  {/* Bank Details */}
                  <div style={{
                    background: '#f0f9ff', borderRadius: 10,
                    padding: 18, border: '1px solid #bae6fd',
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0284c7', marginBottom: 14 }}>
                      🏦 Bank Details
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Input label="Account Number" placeholder="Bank account number" {...ip('bankAccount')} />
                      <Input label="Bank Name"      placeholder="e.g. SBI, HDFC"     {...ip('bankName')}    />
                      <Input label="IFSC Code"      placeholder="e.g. SBIN0001234"   {...ip('ifscCode')}    />
                      <Input label="PAN Number"     placeholder="e.g. ABCDE1234F"    {...ip('panNumber')}   />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ SUBJECTS ══ */}
            {activeTab === 'subjects' && (
              <div>
                <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>
                  📚 Subject Assignments
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>
                  Select one or more subjects this teacher will teach
                </p>
                {allSubjects.length === 0 ? (
                  <div style={{
                    padding: 40, textAlign: 'center', color: '#94a3b8',
                    border: '2px dashed #e2e8f0', borderRadius: 10,
                  }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
                    <p>No subjects found. Create subjects first.</p>
                  </div>
                ) : (
                  <>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))',
                      gap: 10, marginBottom: 24,
                    }}>
                      {allSubjects.map((subj) => {
                        const selected = formData.subjectIds.includes(subj.id);
                        return (
                          <label
                            key={subj.id}
                            onClick={() => toggleSubject(subj.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '12px 14px',
                              border: `2px solid ${selected ? '#2563eb' : '#e2e8f0'}`,
                              borderRadius: 10, cursor: 'pointer',
                              background: selected ? '#eff6ff' : 'white',
                              transition: 'all 0.15s',
                            }}
                          >
                            <div style={{
                              width: 20, height: 20, borderRadius: 5,
                              background: selected ? '#2563eb' : 'white',
                              border: `2px solid ${selected ? '#2563eb' : '#d1d5db'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, transition: 'all 0.15s',
                            }}>
                              {selected && <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>✓</span>}
                            </div>
                            <div>
                              <div style={{
                                fontSize: 13, fontWeight: selected ? 700 : 500,
                                color: selected ? '#2563eb' : '#374151',
                              }}>
                                {subj.name}
                              </div>
                              {subj.code && (
                                <div style={{ fontSize: 11, color: '#94a3b8' }}>{subj.code}</div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {formData.subjectIds.length > 0 && (
                      <div style={{
                        background: '#f0fdf4', border: '1px solid #bbf7d0',
                        borderRadius: 8, padding: '10px 14px',
                        fontSize: 13, color: '#166534',
                      }}>
                        ✅ {formData.subjectIds.length} subject
                        {formData.subjectIds.length > 1 ? 's' : ''} selected:{' '}
                        {allSubjects
                          .filter((s) => formData.subjectIds.includes(s.id))
                          .map((s) => s.name)
                          .join(', ')}
                      </div>
                    )}
                  </>
                )}

                <div style={{ marginTop: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                    Class Assignments
                  </label>
                  <textarea
                    name="classAssignments"
                    value={formData.classAssignments}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Class 9A - Maths, Class 10B - Physics..."
                    style={textareaStyle}
                  />
                </div>
              </div>
            )}

            {/* ══ ADDRESS ══ */}
            {activeTab === 'address' && (
              <div>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                  🏠 Address Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                      Street Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="House no, Street, Area..."
                      style={textareaStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <Input label="City"    placeholder="City"   {...ip('city')}    />
                    <Input label="State"   placeholder="State"  {...ip('state')}   />
                    <Input label="Pincode" placeholder="110001" {...ip('pincode')} />
                  </div>
                  <Input label="Country" {...ip('country')} />
                </div>
              </div>
            )}

            {/* ══ DOCUMENTS ══ */}
            {activeTab === 'documents' && (
              <div>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                  📄 Documents & IDs
                </h3>
                <div style={{
                  background: '#fef9c3', border: '1px solid #fde68a',
                  borderRadius: 8, padding: '10px 14px', marginBottom: 20,
                  fontSize: 13, color: '#92400e',
                }}>
                  🔒 Document information is confidential and only accessible to the Principal.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Aadhar Card Number"  placeholder="XXXX XXXX XXXX" {...ip('aadharNo')}  />
                    <Input label="Resume / CV URL"     placeholder="https://..."     {...ip('resumeUrl')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                      Certificates & Qualifications
                    </label>
                    <textarea
                      name="certificates"
                      value={formData.certificates}
                      onChange={handleChange}
                      rows={4}
                      placeholder="List any additional certificates, training, awards..."
                      style={textareaStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Footer navigation ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: 28,
              paddingTop: 20, borderTop: '1px solid #f1f5f9',
            }}>
              <Button
                type="button" variant="outline"
                disabled={activeTab === TABS[0].key}
                onClick={() => {
                  const idx = TABS.findIndex((t) => t.key === activeTab);
                  if (idx > 0) setActiveTab(TABS[idx - 1].key);
                }}
              >
                ← Previous
              </Button>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.key} type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      width: activeTab === tab.key ? 20 : 8, height: 8,
                      borderRadius: 99, border: 'none', cursor: 'pointer',
                      background: activeTab === tab.key ? '#2563eb' : '#e2e8f0',
                      transition: 'all 0.2s', padding: 0,
                    }}
                  />
                ))}
              </div>

              {activeTab === TABS[TABS.length - 1].key ? (
                <Button type="submit" loading={loading}>
                  {isEdit ? '💾 Update Teacher' : '✅ Add Teacher'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    const idx = TABS.findIndex((t) => t.key === activeTab);
                    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key);
                  }}
                >
                  Next →
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;
