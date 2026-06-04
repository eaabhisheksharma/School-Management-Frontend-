import React, { useState, useEffect, useCallback } from 'react';
// import useAuth from '../hooks/useAuth';
// ✅ New (Named)
import { useAuth } from '../hooks/useAuth';
import {
  getClasses, createClass, updateClass, deleteClass,
} from '../api/classApi';
import Button from '../components/common/Button';
import Alert  from '../components/common/Alert';
import Loading from '../components/common/Loading';
import Input  from '../components/common/Input';
import Select from '../components/common/Select';

const SECTIONS     = ['A','B','C','D','E','F'];
const CLASS_NAMES  = [
  'Nursery','LKG','UKG',
  'Class 1','Class 2','Class 3','Class 4','Class 5',
  'Class 6','Class 7','Class 8','Class 9','Class 10',
  'Class 11','Class 12',
];
const STREAMS = ['None','Science','Commerce','Arts','Vocational'];

const emptyForm = {
  name: '', section: '', stream: 'None',
  capacity: '', roomNo: '', classTeacherId: '',
  academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  fees: '', description: '',
};

const Classes = () => {
  const { userRole, isPrincipal } = useAuth();
  const [classes,    setClasses]    = useState([]);
  const [teachers,   setTeachers]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [showForm,   setShowForm]   = useState(false);
  const [editClass,  setEditClass]  = useState(null);
  const [formData,   setFormData]   = useState(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [deleteConf, setDeleteConf] = useState(null);
  const [deleting,   setDeleting]   = useState(false);
  const [search,     setSearch]     = useState('');
  const [viewClass,  setViewClass]  = useState(null);
  const [errors,     setErrors]     = useState({});

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const [cr, tr] = await Promise.allSettled([
        getClasses({ search }),
        import('../api/teacherApi').then((m) => m.getTeachers({ status: 'active', limit: 100 })),
      ]);
      if (cr.status === 'fulfilled') setClasses(cr.value?.data || []);
      if (tr.status === 'fulfilled') setTeachers(tr.value?.data || []);
    } catch { setError('Failed to load classes'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchClasses(); }, []);

  const openAdd = () => {
    setEditClass(null); setFormData(emptyForm);
    setErrors({}); setShowForm(true);
  };
  const openEdit = (cls) => {
    setEditClass(cls);
    setFormData({
      name           : cls.name         || '',
      section        : cls.section      || '',
      stream         : cls.stream       || 'None',
      capacity       : cls.capacity     || '',
      roomNo         : cls.roomNo       || '',
      classTeacherId : cls.classTeacherId || '',
      academicYear   : cls.academicYear || emptyForm.academicYear,
      fees           : cls.fees         || '',
      description    : cls.description  || '',
    });
    setErrors({}); setShowForm(true);
  };

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = 'Class name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editClass) await updateClass(editClass.id, formData);
      else           await createClass(formData);
      setSuccess(`Class ${editClass ? 'updated' : 'created'} successfully!`);
      setShowForm(false);
      fetchClasses();
    } catch (err) { setError(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteConf) return;
    setDeleting(true);
    try {
      await deleteClass(deleteConf.id);
      setSuccess('Class removed');
      setDeleteConf(null);
      fetchClasses();
    } catch (err) { setError(err.message || 'Delete failed'); }
    finally { setDeleting(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const filtered = classes.filter((c) =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Class Detail Modal ── */
  const ClassDetailModal = ({ cls, onClose }) => (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 32,
        maxWidth: 520, width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
            🏫 {cls.name}{cls.section ? ` — ${cls.section}` : ''}
          </h3>
          <button onClick={onClose} style={{
            background: '#f1f5f9', border: 'none', borderRadius: 8,
            width: 32, height: 32, cursor: 'pointer', fontSize: 16,
          }}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Academic Year', value: cls.academicYear   },
            { label: 'Room No',       value: cls.roomNo         },
            { label: 'Capacity',      value: cls.capacity       },
            { label: 'Stream',        value: cls.stream         },
            { label: 'Fees (₹)',      value: cls.fees ? Number(cls.fees).toLocaleString('en-IN') : '—' },
            { label: 'Total Students',value: cls.studentCount   },
            { label: 'Class Teacher', value: cls.classTeacherName || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: '#f8fafc', borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{value ?? '—'}</div>
            </div>
          ))}
        </div>
        {isPrincipal && (
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <Button onClick={() => { onClose(); openEdit(cls); }}>✏️ Edit</Button>
            <Button variant="danger" onClick={() => { onClose(); setDeleteConf(cls); }}>🗑️ Delete</Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h2 style={{ margin:0, fontSize:22, fontWeight:700 }}>🏫 Classes</h2>
          <p style={{ margin:'4px 0 0', color:'#64748b', fontSize:14 }}>Manage class sections and assignments</p>
        </div>
        {isPrincipal && <Button icon="+" onClick={openAdd}>Add Class</Button>}
      </div>

      {error   && <Alert type="error"   message={error}   dismissible autoClose={5000} onClose={() => setError('')}   style={{ marginBottom:16 }} />}
      {success && <Alert type="success" message={success} dismissible autoClose={3000} onClose={() => setSuccess('')} style={{ marginBottom:16 }} />}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Classes',   value: classes.length,                                                          icon:'🏫', color:'#2563eb', bg:'#eff6ff' },
          { label:'Total Students',  value: classes.reduce((s,c) => s + (c.studentCount || 0), 0),                  icon:'🎒', color:'#16a34a', bg:'#dcfce7' },
          { label:'Avg Capacity',    value: classes.length ? Math.round(classes.reduce((s,c) => s + (Number(c.capacity)||0),0) / classes.length) : 0, icon:'📊', color:'#d97706', bg:'#fef9c3' },
          { label:'Sections',        value: [...new Set(classes.map(c=>c.section).filter(Boolean))].length,          icon:'📋', color:'#7c3aed', bg:'#f5f3ff' },
        ].map(({label,value,icon,color,bg}) => (
          <div key={label} style={{
            background:'white', borderRadius:10,
            boxShadow:'0 1px 3px rgba(0,0,0,0.08)',
            padding:'14px 16px', display:'flex', alignItems:'center', gap:12,
          }}>
            <div style={{ width:40,height:40,borderRadius:9,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }}>{icon}</div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color }}>{value}</div>
              <div style={{ fontSize:11, color:'#64748b' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ background:'white',borderRadius:10,boxShadow:'0 1px 3px rgba(0,0,0,0.08)',padding:14,marginBottom:16 }}>
        <input
          type="text" placeholder="🔍 Search classes..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width:'100%',padding:'9px 14px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box' }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <Loading type="skeleton" rows={6} />
      ) : filtered.length === 0 ? (
        <div style={{ background:'white',borderRadius:10,boxShadow:'0 1px 3px rgba(0,0,0,0.08)',padding:60,textAlign:'center',color:'#94a3b8' }}>
          <div style={{ fontSize:48,marginBottom:14 }}>🏫</div>
          <p style={{ fontWeight:600,fontSize:16,margin:0 }}>No classes found</p>
          {isPrincipal && <Button style={{ marginTop:16 }} onClick={openAdd}>+ Add First Class</Button>}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {filtered.map((cls) => (
            <div key={cls.id}
              onClick={() => setViewClass(cls)}
              style={{
                background:'white', borderRadius:14,
                boxShadow:'0 1px 3px rgba(0,0,0,0.08)',
                border:'2px solid #f1f5f9',
                overflow:'hidden', cursor:'pointer',
                transition:'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='#bfdbfe'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.borderColor='#f1f5f9'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'; }}
            >
              {/* Card top */}
              <div style={{
                height:60, padding:'0 18px',
                background:'linear-gradient(135deg,#2563eb,#0284c7)',
                display:'flex', alignItems:'center', justifyContent:'space-between',
              }}>
                <div style={{ color:'white', fontWeight:800, fontSize:16 }}>
                  {cls.name}{cls.section ? ` — ${cls.section}` : ''}
                </div>
                <div style={{
                  background:'rgba(255,255,255,0.2)', color:'white',
                  borderRadius:8, padding:'4px 10px', fontSize:12, fontWeight:700,
                }}>
                  {cls.academicYear || '—'}
                </div>
              </div>
              <div style={{ padding:'16px 18px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                  {[
                    { label:'Students', value: cls.studentCount ?? '0',   icon:'🎒' },
                    { label:'Capacity', value: cls.capacity    ?? '—',    icon:'👥' },
                    { label:'Room',     value: cls.roomNo      || '—',    icon:'🚪' },
                    { label:'Stream',   value: cls.stream      || 'None', icon:'📚' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ background:'#f8fafc',borderRadius:8,padding:'8px 10px' }}>
                      <div style={{ fontSize:11,color:'#94a3b8',marginBottom:2 }}>{icon} {label}</div>
                      <div style={{ fontSize:14,fontWeight:700,color:'#0f172a' }}>{value}</div>
                    </div>
                  ))}
                </div>
                {cls.classTeacherName && (
                  <div style={{ display:'flex',alignItems:'center',gap:8,padding:'8px 10px',background:'#f0fdf4',borderRadius:8,border:'1px solid #bbf7d0' }}>
                    <span style={{ fontSize:14 }}>👨‍🏫</span>
                    <span style={{ fontSize:12,fontWeight:600,color:'#166534' }}>{cls.classTeacherName}</span>
                  </div>
                )}
                {isPrincipal && (
                  <div onClick={(e) => e.stopPropagation()}
                    style={{ display:'flex', gap:8, marginTop:12 }}
                  >
                    <button onClick={() => openEdit(cls)}
                      style={{ flex:1,background:'#f8fafc',color:'#475569',border:'1px solid #e2e8f0',padding:'7px',borderRadius:8,cursor:'pointer',fontSize:12,fontWeight:600 }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => setDeleteConf(cls)}
                      style={{ background:'#fff1f2',color:'#be123c',border:'1px solid #fecdd3',padding:'7px 12px',borderRadius:8,cursor:'pointer',fontSize:12 }}>
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16 }}>
          <div style={{ background:'white',borderRadius:16,padding:32,maxWidth:560,width:'100%',boxShadow:'0 24px 64px rgba(0,0,0,0.2)',maxHeight:'90vh',overflowY:'auto' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24 }}>
              <h3 style={{ margin:0,fontSize:18,fontWeight:800 }}>
                {editClass ? '✏️ Edit Class' : '🏫 Add Class'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background:'#f1f5f9',border:'none',borderRadius:8,width:32,height:32,cursor:'pointer',fontSize:16 }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                  <div>
                    <label style={{ display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:6 }}>
                      Class Name <span style={{ color:'#dc2626' }}>*</span>
                    </label>
                    <select name="name" value={formData.name} onChange={handleChange}
                      style={{ width:'100%',padding:'10px 14px',border:`1.5px solid ${errors.name?'#f87171':'#e2e8f0'}`,borderRadius:8,fontSize:14,boxSizing:'border-box' }}>
                      <option value="">Select Class</option>
                      {CLASS_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    {errors.name && <p style={{ color:'#dc2626',fontSize:12,marginTop:4 }}>{errors.name}</p>}
                  </div>
                  <Select label="Section" name="section" value={formData.section} onChange={handleChange}
                    options={SECTIONS.map(s => ({ value:s, label:`Section ${s}` }))} placeholder="Select section" />
                </div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                  <Input label="Room No" name="roomNo" value={formData.roomNo} onChange={handleChange} placeholder="e.g. Room 101" />
                  <Input label="Capacity" type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="e.g. 40" />
                </div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                  <Select label="Stream" name="stream" value={formData.stream} onChange={handleChange}
                    options={STREAMS.map(s => ({ value:s, label:s }))} />
                  <Input label="Annual Fees (₹)" type="number" name="fees" value={formData.fees} onChange={handleChange} placeholder="e.g. 25000" />
                </div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                  <div>
                    <label style={{ display:'block',fontSize:13,fontWeight:700,color:'#374151',marginBottom:6 }}>Class Teacher</label>
                    <select name="classTeacherId" value={formData.classTeacherId} onChange={handleChange}
                      style={{ width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8f0',borderRadius:8,fontSize:14,boxSizing:'border-box' }}>
                      <option value="">None</option>
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <Input label="Academic Year" name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="2025-2026" />
                </div>
              </div>
              <div style={{ display:'flex',gap:12,justifyContent:'flex-end',paddingTop:20,marginTop:20,borderTop:'1px solid #f1f5f9' }}>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" loading={saving}>{editClass ? '💾 Update' : '✅ Create Class'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConf && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16 }}>
          <div style={{ background:'white',borderRadius:14,padding:36,maxWidth:400,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.2)',textAlign:'center' }}>
            <div style={{ fontSize:44,marginBottom:16 }}>🗑️</div>
            <h3 style={{ margin:'0 0 10px',fontSize:18 }}>Delete Class?</h3>
            <p style={{ color:'#64748b',fontSize:14,marginBottom:28 }}>
              Remove <strong>"{deleteConf.name}{deleteConf.section ? ` — ${deleteConf.section}` : ''}"</strong>? This cannot be undone.
            </p>
            <div style={{ display:'flex',gap:12,justifyContent:'center' }}>
              <Button variant="outline" onClick={() => setDeleteConf(null)} disabled={deleting}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {viewClass && <ClassDetailModal cls={viewClass} onClose={() => setViewClass(null)} />}
    </div>
  );
};

export default Classes;
