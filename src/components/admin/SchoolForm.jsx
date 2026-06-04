// // src/components/admin/SchoolForm.jsx
// import React, { useState, useEffect } from 'react';
// import { updateSchool } from '../../api/adminApi'; // FIXED: only import what exists
// import axios from '../../api/axiosConfig'; // ADDED to handle creation via /auth/register-school

// const SchoolForm = ({ isOpen, onClose, fetchSchools, editData }) => {
//   const [form, setForm] = useState({
//     school_name: '', email: '', phone: '', address: '',
//     city: '', state: '', pincode: '', subscription_plan: 'basic'
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     if (editData) {
//       setForm({
//         school_name: editData.school_name || '',
//         email: editData.email || '',
//         phone: editData.phone || '',
//         address: editData.address || '',
//         city: editData.city || '',
//         state: editData.state || '',
//         pincode: editData.pincode || '',
//         subscription_plan: editData.subscription_plan || 'basic',
//       });
//     } else {
//       setForm({ school_name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', subscription_plan: 'basic' });
//     }
//     setError('');
//     setSuccess('');
//   }, [editData, isOpen]);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');
    
//     try {
//       if (editData) {
//         // Use Admin API to update existing school
//         await updateSchool(editData.school_id || editData.id, form);
//         fetchSchools();
//         onClose();
//       } else {
//         // Use Auth API to create new school (as per your backend docs)
//         const res = await axios.post('/auth/register-school', form);
//         setSuccess(res.data?.message || 'School created successfully!');
        
//         // Show credentials if returned by backend
//         if (res.data?.next_steps) {
//           alert("School Created!\n\n" + res.data.next_steps.join('\n'));
//         }
        
//         fetchSchools();
//         onClose();
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save school');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' };
//   const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' };

//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
//       <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
//         <h2 style={{ margin: '0 0 20px', fontSize: 18, color: '#0f172a' }}>
//           {editData ? '✏️ Edit School' : '➕ Register New School'}
//         </h2>

//         {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
//         {success && <div style={{ background: '#dcfce7', color: '#166534', padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{success}</div>}

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: 16 }}>
//             <label style={labelStyle}>School Name *</label>
//             <input style={inputStyle} name="school_name" value={form.school_name} onChange={handleChange} required disabled={!!editData} />
//           </div>
          
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
//             <div>
//               <label style={labelStyle}>Email *</label>
//               <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleChange} required disabled={!!editData} />
//             </div>
//             <div>
//               <label style={labelStyle}>Phone</label>
//               <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} />
//             </div>
//           </div>

//           <div style={{ marginBottom: 16 }}>
//             <label style={labelStyle}>Address</label>
//             <input style={inputStyle} name="address" value={form.address} onChange={handleChange} />
//           </div>

//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
//             <div>
//               <label style={labelStyle}>City</label>
//               <input style={inputStyle} name="city" value={form.city} onChange={handleChange} />
//             </div>
//             <div>
//               <label style={labelStyle}>State</label>
//               <input style={inputStyle} name="state" value={form.state} onChange={handleChange} />
//             </div>
//             <div>
//               <label style={labelStyle}>Pincode</label>
//               <input style={inputStyle} name="pincode" value={form.pincode} onChange={handleChange} />
//             </div>
//           </div>

//           {!editData && (
//             <div style={{ marginBottom: 24 }}>
//               <label style={labelStyle}>Subscription Plan</label>
//               <select style={inputStyle} name="subscription_plan" value={form.subscription_plan} onChange={handleChange}>
//                 <option value="basic">Basic</option>
//                 <option value="premium">Premium</option>
//                 <option value="enterprise">Enterprise</option>
//               </select>
//             </div>
//           )}

//           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
//             <button type="button" onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
//             <button type="submit" disabled={loading} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
//               {loading ? 'Saving...' : editData ? 'Update School' : 'Create School'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SchoolForm;


// src/components/admin/SchoolForm.jsx
import React, { useState, useEffect } from 'react';
import { createSchool, updateSchool } from '../../api/adminApi';

const INITIAL_FORM = {
  school_name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  subscription_plan: 'basic',
  max_students: 100,
  max_teachers: 20,
  admin_first_name: '',
  admin_last_name: '',
  admin_email: '',
  admin_password: '',
};

const SchoolForm = ({ isOpen, onClose, fetchSchools, editData }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setForm({
        school_name: editData.school_name || '',
        email: editData.email || '',
        phone: editData.phone || '',
        city: editData.city || '',
        state: editData.state || '',
        country: editData.country || 'India',
        pincode: editData.pincode || '',
        subscription_plan: editData.subscription_plan || 'basic',
        max_students: editData.max_students || 100,
        max_teachers: editData.max_teachers || 20,
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_password: '',
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setError('');
  }, [editData, isOpen]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editData) {
        const { admin_first_name, admin_last_name, admin_email, admin_password, ...updateData } = form;
        await updateSchool(editData.school_id || editData.id, updateData);
      } else {
        await createSchool(form);
      }
      fetchSchools();
      onClose();
    } catch (err) {
      setError(err.data?.error || err.message || 'Failed to save school');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 20px', fontSize: 18, color: '#0f172a' }}>
          {editData ? 'Edit School' : 'Register New School'}
        </h2>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: 10, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* School Details */}
          <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>School Details</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>School Name *</label>
              <input style={inputStyle} name="school_name" value={form.school_name} onChange={handleChange} required />
            </div>
            <div>
              <label style={labelStyle}>School Email *</label>
              <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} placeholder="+919988776655" />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input style={inputStyle} name="city" value={form.city} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>State</label>
              <input style={inputStyle} name="state" value={form.state} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input style={inputStyle} name="country" value={form.country} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Pincode</label>
              <input style={inputStyle} name="pincode" value={form.pincode} onChange={handleChange} />
            </div>
          </div>

          {/* Admin/Principal Details - only for create */}
          {!editData && (
            <>
              <div style={{ marginBottom: 8, marginTop: 20, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Principal Account</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input style={inputStyle} name="admin_first_name" value={form.admin_first_name} onChange={handleChange} required />
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input style={inputStyle} name="admin_last_name" value={form.admin_last_name} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Principal Email *</label>
                  <input style={inputStyle} type="email" name="admin_email" value={form.admin_email} onChange={handleChange} required placeholder="principal@school.com" />
                </div>
                <div>
                  <label style={labelStyle}>Principal Password *</label>
                  <input style={inputStyle} type="password" name="admin_password" value={form.admin_password} onChange={handleChange} required minLength={6} placeholder="Min 6 characters" />
                </div>
              </div>
            </>
          )}

          {/* Subscription */}
          <div style={{ marginBottom: 8, marginTop: 20, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Subscription & Limits</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Plan</label>
              <select style={inputStyle} name="subscription_plan" value={form.subscription_plan} onChange={handleChange}>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Max Students</label>
              <input style={inputStyle} type="number" name="max_students" value={form.max_students} onChange={handleChange} min="1" />
            </div>
            <div>
              <label style={labelStyle}>Max Teachers</label>
              <input style={inputStyle} type="number" name="max_teachers" value={form.max_teachers} onChange={handleChange} min="1" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : editData ? 'Update School' : 'Create School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolForm;