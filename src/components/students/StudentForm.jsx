import React, { useState, useEffect, useRef } from 'react';
import {
  createStudent,
  updateStudent,
  uploadProfilePhoto,
} from '../../api/studentApi';
import { getClasses } from '../../api/classApi';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const TABS = [
  { key: 'basic',   label: '👤 Basic Info'     },
  { key: 'academic',label: '📚 Academic'        },
  { key: 'parent',  label: '👨‍👩‍👧 Parent/Guardian' },
  { key: 'address', label: '🏠 Address'         },
  { key: 'medical', label: '🏥 Medical'         },
];

const emptyForm = {
  /* basic */
  name           : '',
  dateOfBirth    : '',
  gender         : '',
  bloodGroup     : '',
  religion       : '',
  caste          : '',
  nationality    : 'Indian',
  email          : '',
  phone          : '',
  profilePhoto   : '',
  status         : 'active',
  /* academic */
  admissionNo    : '',
  admissionDate  : new Date().toISOString().split('T')[0],
  classId        : '',
  section        : '',
  rollNo         : '',
  academicYear   : new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
  previousSchool : '',
  /* parent */
  fatherName     : '',
  fatherPhone    : '',
  fatherEmail    : '',
  fatherOccupation:'',
  motherName     : '',
  motherPhone    : '',
  motherEmail    : '',
  motherOccupation:'',
  guardianName   : '',
  guardianPhone  : '',
  guardianRelation:'',
  /* address */
  address        : '',
  city           : '',
  state          : '',
  pincode        : '',
  country        : 'India',
  /* medical */
  medicalConditions:'',
  allergies      : '',
  emergencyContact:'',
  emergencyPhone : '',
};

const StudentForm = ({ student, userRole, onClose }) => {
  const isEdit      = !!student;
  const [activeTab, setActiveTab]   = useState('basic');
  const [formData, setFormData]     = useState(emptyForm);
  const [classes, setClasses]       = useState([]);
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
      try { const r = await getClasses(); setClasses(r.data || []); } catch { /* silent */ }
    })();
    if (isEdit && student) {
      setFormData({
        name           : student.name             || '',
        dateOfBirth    : student.dateOfBirth       ? student.dateOfBirth.split('T')[0] : '',
        gender         : student.gender            || '',
        bloodGroup     : student.bloodGroup        || '',
        religion       : student.religion          || '',
        caste          : student.caste             || '',
        nationality    : student.nationality       || 'Indian',
        email          : student.email             || '',
        phone          : student.phone             || '',
        profilePhoto   : student.profilePhoto      || '',
        status         : student.status            || 'active',
        admissionNo    : student.admissionNo       || '',
        admissionDate  : student.admissionDate      ? student.admissionDate.split('T')[0] : '',
        classId        : student.classId           || student.class?.id || '',
        section        : student.section           || '',
        rollNo         : student.rollNo            || '',
        academicYear   : student.academicYear      || emptyForm.academicYear,
        previousSchool : student.previousSchool    || '',
        fatherName     : student.fatherName        || '',
        fatherPhone    : student.fatherPhone       || '',
        fatherEmail    : student.fatherEmail       || '',
        fatherOccupation: student.fatherOccupation || '',
        motherName     : student.motherName        || '',
        motherPhone    : student.motherPhone       || '',
        motherEmail    : student.motherEmail       || '',
        motherOccupation: student.motherOccupation || '',
        guardianName   : student.guardianName      || '',
        guardianPhone  : student.guardianPhone     || '',
        guardianRelation:student.guardianRelation  || '',
        address        : student.address           || '',
        city           : student.city              || '',
        state          : student.state             || '',
        pincode        : student.pincode           || '',
        country        : student.country           || 'India',
        medicalConditions: student.medicalConditions || '',
        allergies      : student.allergies         || '',
        emergencyContact: student.emergencyContact || '',
        emergencyPhone : student.emergencyPhone    || '',
      });
      if (student.profilePhoto) setPhotoPreview(student.profilePhoto);
    }
  }, []);

  /* ─── handlers ───────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
    if (isEdit && student?.id) {
      setPhotoUploading(true);
      try {
        const res = await uploadProfilePhoto(student.id, file);
        setFormData((p) => ({ ...p, profilePhoto: res.url || res.data?.url || '' }));
        setSuccess('Photo uploaded!');
      } catch { setError('Photo upload failed'); }
      finally { setPhotoUploading(false); }
    }
  };

  /* ─── validate ───────────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (!formData.name.trim())    e.name    = 'Full name is required';
    if (!formData.gender)         e.gender  = 'Gender is required';
    if (!formData.classId)        e.classId = 'Class is required';
    if (!formData.dateOfBirth)    e.dateOfBirth = 'Date of birth is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      e.email = 'Invalid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ─── submit ─────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setActiveTab('basic');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEdit) await updateStudent(student.id, formData);
      else        await createStudent(formData);
      setSuccess(`Student ${isEdit ? 'updated' : 'enrolled'} successfully! ✅`);
      setTimeout(() => onClose(true), 1200);
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const inputProps = (name, extra = {}) => ({
    name, value: formData[name],
    onChange: handleChange,
    error: errors[name],
    ...extra,
  });

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
            {isEdit ? '✏️ Edit Student' : '👤 Enroll Student'}
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            {isEdit ? 'Update student profile and records' : 'Add a new student to the school'}
          </p>
        </div>
        <Button variant="outline" onClick={() => onClose(false)}>← Back</Button>
      </div>

      {/* Alerts */}
      {error   && <Alert type="error"   message={error}   dismissible onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>

          {/* ── Left sidebar: photo + tabs ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Photo */}
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              padding: 20, textAlign: 'center',
            }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 100, height: 100, borderRadius: '50%',
                  margin: '0 auto 12px',
                  background: photoPreview
                    ? 'transparent'
                    : formData.gender === 'female'
                    ? 'linear-gradient(135deg,#9333ea,#c026d3)'
                    : 'linear-gradient(135deg,#2563eb,#0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden',
                  border: '3px solid #e2e8f0',
                  position: 'relative',
                }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview} alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: 36, color: 'white' }}>
                    {formData.name ? formData.name.charAt(0).toUpperCase() : '👤'}
                  </span>
                )}
                {/* Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s',
                  fontSize: 20,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  📷
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={photoUploading}
                style={{
                  background: '#eff6ff', color: '#2563eb',
                  border: '1px solid #bfdbfe', padding: '6px 14px',
                  borderRadius: 7, cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                }}
              >
                {photoUploading ? '⏳ Uploading...' : '📷 Change Photo'}
              </button>
              {formData.name && (
                <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  {formData.name}
                </div>
              )}
              {formData.classId && (
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {classes.find((c) => c.id === formData.classId)?.name || ''}
                  {formData.section ? ` - ${formData.section}` : ''}
                </div>
              )}
            </div>

            {/* Tab nav */}
            <div style={{
              background: 'white', borderRadius: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '12px 16px',
                    background: activeTab === tab.key ? '#eff6ff' : 'white',
                    border: 'none', borderLeft:
                      activeTab === tab.key ? '3px solid #2563eb' : '3px solid transparent',
                    cursor: 'pointer', fontSize: 13,
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    color: activeTab === tab.key ? '#2563eb' : '#475569',
                    textAlign: 'left',
                    borderBottom: '1px solid #f8fafc',
                  }}
                >
                  {tab.label}
                  {/* Error indicator */}
                  {tab.key === 'basic' && Object.keys(errors).some(
                    (k) => ['name','gender','dateOfBirth','email'].includes(k)
                  ) && (
                    <span style={{
                      marginLeft: 'auto', width: 8, height: 8,
                      borderRadius: '50%', background: '#ef4444', flexShrink: 0,
                    }} />
                  )}
                  {tab.key === 'academic' && errors.classId && (
                    <span style={{
                      marginLeft: 'auto', width: 8, height: 8,
                      borderRadius: '50%', background: '#ef4444', flexShrink: 0,
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: tab content ── */}
          <div style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: 28,
          }}>

            {/* ══ BASIC INFO ══ */}
            {activeTab === 'basic' && (
              <div>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                  👤 Basic Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Input label="Full Name" placeholder="Student's full name" required {...inputProps('name', { placeholder: "Enter full name" })} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Date of Birth" type="date" required {...inputProps('dateOfBirth')} />
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                        Gender <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {[
                          { value: 'male',   label: '👦 Male'   },
                          { value: 'female', label: '👧 Female' },
                          { value: 'other',  label: '🧑 Other'  },
                        ].map(({ value, label }) => (
                          <label key={value} style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 6,
                            padding: '9px',
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <Select
                      label="Blood Group"
                      {...inputProps('bloodGroup')}
                      options={BLOOD_GROUPS.map((b) => ({ value: b, label: b }))}
                      placeholder="Select"
                    />
                    <Input label="Religion" placeholder="e.g. Hindu" {...inputProps('religion')} />
                    <Input label="Nationality" {...inputProps('nationality')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Email" type="email" placeholder="student@email.com" {...inputProps('email')} />
                    <Input label="Phone" placeholder="+91 9876543210" {...inputProps('phone')} />
                  </div>
                  <Select
                    label="Status"
                    {...inputProps('status')}
                    options={[
                      { value: 'active',      label: '✅ Active'      },
                      { value: 'inactive',    label: '⏸ Inactive'    },
                      { value: 'transferred', label: '🔄 Transferred' },
                      { value: 'graduated',   label: '🎓 Graduated'   },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* ══ ACADEMIC ══ */}
            {activeTab === 'academic' && (
              <div>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                  📚 Academic Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Admission No" placeholder="e.g. ADM/2024/001" {...inputProps('admissionNo')} />
                    <Input label="Admission Date" type="date" {...inputProps('admissionDate')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <Select
                      label="Class"
                      required
                      {...inputProps('classId')}
                      options={classes.map((c) => ({ value: c.id, label: c.name }))}
                      placeholder="Select class"
                    />
                    <Input label="Section" placeholder="e.g. A, B, C" {...inputProps('section')} />
                    <Input label="Roll Number" placeholder="e.g. 25" {...inputProps('rollNo')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Academic Year" placeholder="e.g. 2025-2026" {...inputProps('academicYear')} />
                    <Input label="Previous School" placeholder="Previous school name" {...inputProps('previousSchool')} />
                  </div>
                </div>
              </div>
            )}

            {/* ══ PARENT ══ */}
            {activeTab === 'parent' && (
              <div>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                  👨‍👩‍👧 Parent / Guardian Information
                </h3>
                {/* Father */}
                <div style={{
                  background: '#f0f9ff', borderRadius: 10,
                  padding: 18, marginBottom: 20,
                  border: '1px solid #bae6fd',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0284c7', marginBottom: 14 }}>
                    👨 Father's Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Input label="Father's Name"       {...inputProps('fatherName',       { placeholder: "Father's full name"    })} />
                    <Input label="Phone"               {...inputProps('fatherPhone',      { placeholder: "+91 9876543210"        })} />
                    <Input label="Email"  type="email" {...inputProps('fatherEmail',      { placeholder: "father@email.com"      })} />
                    <Input label="Occupation"          {...inputProps('fatherOccupation', { placeholder: "e.g. Engineer, Farmer" })} />
                  </div>
                </div>
                {/* Mother */}
                <div style={{
                  background: '#fdf4ff', borderRadius: 10,
                  padding: 18, marginBottom: 20,
                  border: '1px solid #e9d5ff',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#9333ea', marginBottom: 14 }}>
                    👩 Mother's Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Input label="Mother's Name"       {...inputProps('motherName',       { placeholder: "Mother's full name"    })} />
                    <Input label="Phone"               {...inputProps('motherPhone',      { placeholder: "+91 9876543210"        })} />
                    <Input label="Email"  type="email" {...inputProps('motherEmail',      { placeholder: "mother@email.com"      })} />
                    <Input label="Occupation"          {...inputProps('motherOccupation', { placeholder: "e.g. Teacher, Doctor"  })} />
                  </div>
                </div>
                {/* Guardian */}
                <div style={{
                  background: '#f8fafc', borderRadius: 10,
                  padding: 18, border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#475569', marginBottom: 14 }}>
                    🧑 Guardian (if different)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                    <Input label="Guardian Name"     {...inputProps('guardianName',     { placeholder: "Guardian name"       })} />
                    <Input label="Phone"             {...inputProps('guardianPhone',    { placeholder: "+91 9876543210"      })} />
                    <Input label="Relation"          {...inputProps('guardianRelation', { placeholder: "e.g. Uncle, Grandpa" })} />
                  </div>
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
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        fontSize: 14, resize: 'vertical', outline: 'none',
                        boxSizing: 'border-box', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <Input label="City / Town" placeholder="City name" {...inputProps('city')} />
                    <Input label="State"       placeholder="State"     {...inputProps('state')} />
                    <Input label="Pincode"     placeholder="110001"    {...inputProps('pincode')} />
                  </div>
                  <Input label="Country" {...inputProps('country')} />
                </div>
              </div>
            )}

            {/* ══ MEDICAL ══ */}
            {activeTab === 'medical' && (
              <div>
                <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>
                  🏥 Medical Information
                </h3>
                <div style={{
                  background: '#fef9c3', border: '1px solid #fde68a',
                  borderRadius: 8, padding: '10px 14px', marginBottom: 20,
                  fontSize: 13, color: '#92400e',
                }}>
                  ℹ️ This information is confidential and only visible to principal and medical staff.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                      Medical Conditions
                    </label>
                    <textarea
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any known medical conditions, disabilities..."
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        fontSize: 14, resize: 'vertical', outline: 'none',
                        boxSizing: 'border-box', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
                      Allergies
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Food, medicine, environmental allergies..."
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        fontSize: 14, resize: 'vertical', outline: 'none',
                        boxSizing: 'border-box', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Emergency Contact Name" placeholder="Doctor / relative name" {...inputProps('emergencyContact')} />
                    <Input label="Emergency Phone"        placeholder="+91 9876543210"         {...inputProps('emergencyPhone')}   />
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab navigation footer ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginTop: 28,
              paddingTop: 20, borderTop: '1px solid #f1f5f9',
            }}>
              <Button
                type="button"
                variant="outline"
                disabled={activeTab === TABS[0].key}
                onClick={() => {
                  const idx = TABS.findIndex((t) => t.key === activeTab);
                  if (idx > 0) setActiveTab(TABS[idx - 1].key);
                }}
              >
                ← Previous
              </Button>

              {/* Step dots */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      width: activeTab === tab.key ? 20 : 8,
                      height: 8, borderRadius: 99,
                      background: activeTab === tab.key ? '#2563eb' : '#e2e8f0',
                      border: 'none', cursor: 'pointer',
                      transition: 'all 0.2s',
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              {activeTab === TABS[TABS.length - 1].key ? (
                <Button type="submit" loading={loading}>
                  {isEdit ? '💾 Update Student' : '✅ Enroll Student'}
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

export default StudentForm;
