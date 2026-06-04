// // src/components/admin/SchoolSubscription.jsx
// import React, { useState } from 'react';
// import { updateSchoolSubscription, toggleSchoolStatus } from '../../api/adminApi';

// const PLANS    = ['basic', 'standard', 'premium', 'enterprise'];
// const STATUSES = ['trial', 'active', 'suspended', 'cancelled'];

// const STATUS_COLORS = {
//   active:    '#22c55e',
//   trial:     '#f59e0b',
//   suspended: '#ef4444',
//   cancelled: '#9ca3af',
// };

// const Field = ({ label, children }) => (
//   <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//     <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//       {label}
//     </label>
//     {children}
//   </div>
// );

// const inputStyle = {
//   padding: '8px 12px', borderRadius: 8,
//   border: '1px solid #e5e7eb', fontSize: 13,
//   outline: 'none', width: '100%', boxSizing: 'border-box',
// };

// export default function SchoolSubscription({ school, onUpdated }) {
//   const [form, setForm] = useState({
//     subscription_plan:   school.subscription_plan   || 'basic',
//     subscription_status: school.subscription_status || 'trial',
//     subscription_ends_at:school.subscription_ends_at
//       ? new Date(school.subscription_ends_at).toISOString().slice(0, 10)
//       : '',
//     trial_ends_at: school.trial_ends_at
//       ? new Date(school.trial_ends_at).toISOString().slice(0, 10)
//       : '',
//     max_students:     school.max_students     || 100,
//     max_teachers:     school.max_teachers     || 20,
//     max_staff:        school.max_staff        || 20,
//     storage_limit_gb: school.storage_limit_gb || 5,
//   });

//   const [loading, setLoading]   = useState(false);
//   const [success, setSuccess]   = useState('');
//   const [error, setError]       = useState('');
//   const [actionLoading, setActionLoading] = useState('');

//   const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

//   const handleSave = async () => {
//     setLoading(true);
//     setSuccess('');
//     setError('');
//     try {
//       const payload = { ...form };
//       if (!payload.subscription_ends_at) delete payload.subscription_ends_at;
//       if (!payload.trial_ends_at)        delete payload.trial_ends_at;
//       payload.max_students     = parseInt(payload.max_students);
//       payload.max_teachers     = parseInt(payload.max_teachers);
//       payload.max_staff        = parseInt(payload.max_staff);
//       payload.storage_limit_gb = parseInt(payload.storage_limit_gb);

//       await updateSchoolSubscription(school.school_id, payload);
//       setSuccess('Subscription updated successfully');
//       onUpdated && onUpdated();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Update failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQuickAction = async (action) => {
//     setActionLoading(action);
//     setError('');
//     try {
//       await toggleSchoolStatus(school.school_id, action);
//       setSuccess(`School ${action}d successfully`);
//       onUpdated && onUpdated();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Action failed');
//     } finally {
//       setActionLoading('');
//     }
//   };

//   const currentStatus = school.subscription_status;
//   const color = STATUS_COLORS[currentStatus] || '#9ca3af';

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//       {/* Current status banner */}
//       <div style={{
//         background: color + '12',
//         border: `1px solid ${color}40`,
//         borderRadius: 10, padding: '14px 18px',
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//       }}>
//         <div>
//           <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>
//             Current Status
//           </div>
//           <div style={{ fontSize: 18, fontWeight: 700, color, textTransform: 'capitalize', marginTop: 2 }}>
//             {currentStatus}
//           </div>
//           {school.trial_ends_at && currentStatus === 'trial' && (
//             <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
//               Trial ends: {new Date(school.trial_ends_at).toLocaleDateString('en-IN')}
//             </div>
//           )}
//           {school.subscription_ends_at && currentStatus === 'active' && (
//             <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
//               Renews: {new Date(school.subscription_ends_at).toLocaleDateString('en-IN')}
//             </div>
//           )}
//         </div>

//         {/* Quick action buttons */}
//         <div style={{ display: 'flex', gap: 8 }}>
//           {currentStatus !== 'active' && (
//             <button
//               disabled={!!actionLoading}
//               onClick={() => handleQuickAction('activate')}
//               style={{
//                 padding: '6px 14px', borderRadius: 7, border: 'none',
//                 background: '#22c55e', color: '#fff', fontSize: 12,
//                 fontWeight: 600, cursor: 'pointer',
//                 opacity: actionLoading === 'activate' ? 0.6 : 1,
//               }}
//             >
//               {actionLoading === 'activate' ? '...' : 'Activate'}
//             </button>
//           )}
//           {currentStatus !== 'suspended' && (
//             <button
//               disabled={!!actionLoading}
//               onClick={() => handleQuickAction('suspend')}
//               style={{
//                 padding: '6px 14px', borderRadius: 7, border: 'none',
//                 background: '#ef4444', color: '#fff', fontSize: 12,
//                 fontWeight: 600, cursor: 'pointer',
//                 opacity: actionLoading === 'suspend' ? 0.6 : 1,
//               }}
//             >
//               {actionLoading === 'suspend' ? '...' : 'Suspend'}
//             </button>
//           )}
//           {currentStatus !== 'cancelled' && (
//             <button
//               disabled={!!actionLoading}
//               onClick={() => { if (window.confirm('Cancel this school subscription?')) handleQuickAction('cancel'); }}
//               style={{
//                 padding: '6px 14px', borderRadius: 7,
//                 border: '1px solid #e5e7eb', background: '#fff',
//                 color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer',
//               }}
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Edit form */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
//         <Field label="Plan">
//           <select style={inputStyle} value={form.subscription_plan} onChange={set('subscription_plan')}>
//             {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
//           </select>
//         </Field>
//         <Field label="Status">
//           <select style={inputStyle} value={form.subscription_status} onChange={set('subscription_status')}>
//             {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
//           </select>
//         </Field>
//         <Field label="Trial Ends At">
//           <input style={inputStyle} type="date" value={form.trial_ends_at} onChange={set('trial_ends_at')} />
//         </Field>
//         <Field label="Subscription Ends At">
//           <input style={inputStyle} type="date" value={form.subscription_ends_at} onChange={set('subscription_ends_at')} />
//         </Field>
//       </div>

//       {/* Limits */}
//       <div>
//         <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
//           Resource Limits
//         </div>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
//           {[
//             { label: 'Max Students',      field: 'max_students' },
//             { label: 'Max Teachers',      field: 'max_teachers' },
//             { label: 'Max Staff',         field: 'max_staff' },
//             { label: 'Storage (GB)',      field: 'storage_limit_gb' },
//           ].map(({ label, field }) => (
//             <Field key={field} label={label}>
//               <input
//                 style={inputStyle} type="number" min={1}
//                 value={form[field]}
//                 onChange={set(field)}
//               />
//             </Field>
//           ))}
//         </div>
//       </div>

//       {/* Feedback */}
//       {success && (
//         <div style={{ background: '#f0fdf4', color: '#166534', padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 500 }}>
//           ✓ {success}
//         </div>
//       )}
//       {error && (
//         <div style={{ background: '#fef2f2', color: '#dc2626', padding: 10, borderRadius: 8, fontSize: 13 }}>
//           {error}
//         </div>
//       )}

//       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <button
//           onClick={handleSave}
//           disabled={loading}
//           style={{
//             padding: '9px 24px', borderRadius: 8, border: 'none',
//             background: loading ? '#a5b4fc' : '#6366f1', color: '#fff',
//             fontSize: 13, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
//           }}
//         >
//           {loading ? 'Saving...' : 'Save Subscription'}
//         </button>
//       </div>
//     </div>
//   );
// }



// src/components/admin/SchoolSubscription.jsx
import React, { useState, useEffect } from 'react';
import { listSchools, updateSchool, activateSchool, suspendSchool } from '../../api/adminApi';

const PLANS    = ['basic', 'standard', 'premium', 'enterprise'];
const STATUSES = ['trial', 'active', 'suspended', 'cancelled'];

const STATUS_COLORS = {
  active:    '#22c55e',
  trial:     '#f59e0b',
  suspended: '#ef4444',
  cancelled: '#9ca3af',
};

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  padding: '8px 12px', borderRadius: 8,
  border: '1px solid #e5e7eb', fontSize: 13,
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

function SubscriptionCard({ school, onUpdated }) {
  const [form, setForm] = useState({
    subscription_plan:   school.subscription_plan   || 'basic',
    subscription_status: school.subscription_status || 'trial',
    subscription_ends_at:school.subscription_ends_at
      ? new Date(school.subscription_ends_at).toISOString().slice(0, 10)
      : '',
    trial_ends_at: school.trial_ends_at
      ? new Date(school.trial_ends_at).toISOString().slice(0, 10)
      : '',
    max_students:     school.max_students     || 100,
    max_teachers:     school.max_teachers     || 20,
    max_staff:        school.max_staff        || 20,
    storage_limit_gb: school.storage_limit_gb || 5,
  });

  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const payload = { ...form };
      if (!payload.subscription_ends_at) delete payload.subscription_ends_at;
      if (!payload.trial_ends_at)        delete payload.trial_ends_at;
      payload.max_students     = parseInt(payload.max_students);
      payload.max_teachers     = parseInt(payload.max_teachers);
      payload.max_staff        = parseInt(payload.max_staff);
      payload.storage_limit_gb = parseInt(payload.storage_limit_gb);

      await updateSchool(school.school_id, payload);

      setSuccess('Subscription updated successfully');
      onUpdated && onUpdated();
    } catch (err) {
      setError(err.message || err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    setActionLoading(action);
    setError('');
    try {
      if (action === 'activate') {
        await activateSchool(school.school_id);
      } else if (action === 'suspend') {
        await suspendSchool(school.school_id);
      }

      setSuccess(`School ${action}d successfully`);
      onUpdated && onUpdated();
    } catch (err) {
      setError(err.message || err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  const currentStatus = school.subscription_status || 'trial';
  const color = STATUS_COLORS[currentStatus] || '#9ca3af';

  return (
    <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: 20, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 14 }}>
        {school.school_name}
      </div>

      <div style={{
        background: color + '12',
        border: `1px solid ${color}40`,
        borderRadius: 10, padding: '14px 18px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>
            Current Status
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color, textTransform: 'capitalize', marginTop: 2 }}>
            {currentStatus}
          </div>
          {school.trial_ends_at && currentStatus === 'trial' && (
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
              Trial ends: {new Date(school.trial_ends_at).toLocaleDateString('en-IN')}
            </div>
          )}
          {school.subscription_ends_at && currentStatus === 'active' && (
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
              Renews: {new Date(school.subscription_ends_at).toLocaleDateString('en-IN')}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {currentStatus !== 'active' && (
            <button
              disabled={!!actionLoading}
              onClick={() => handleQuickAction('activate')}
              style={{
                padding: '6px 14px', borderRadius: 7, border: 'none',
                background: '#22c55e', color: '#fff', fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
                opacity: actionLoading === 'activate' ? 0.6 : 1,
              }}
            >
              {actionLoading === 'activate' ? '...' : 'Activate'}
            </button>
          )}
          {currentStatus !== 'suspended' && (
            <button
              disabled={!!actionLoading}
              onClick={() => handleQuickAction('suspend')}
              style={{
                padding: '6px 14px', borderRadius: 7, border: 'none',
                background: '#ef4444', color: '#fff', fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
                opacity: actionLoading === 'suspend' ? 0.6 : 1,
              }}
            >
              {actionLoading === 'suspend' ? '...' : 'Suspend'}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Field label="Plan">
          <select style={inputStyle} value={form.subscription_plan} onChange={set('subscription_plan')}>
            {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select style={inputStyle} value={form.subscription_status} onChange={set('subscription_status')}>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Trial Ends At">
          <input style={inputStyle} type="date" value={form.trial_ends_at} onChange={set('trial_ends_at')} />
        </Field>
        <Field label="Subscription Ends At">
          <input style={inputStyle} type="date" value={form.subscription_ends_at} onChange={set('subscription_ends_at')} />
        </Field>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Resource Limits
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Max Students',      field: 'max_students' },
            { label: 'Max Teachers',      field: 'max_teachers' },
            { label: 'Max Staff',         field: 'max_staff' },
            { label: 'Storage (GB)',      field: 'storage_limit_gb' },
          ].map(({ label, field }) => (
            <Field key={field} label={label}>
              <input
                style={inputStyle} type="number" min={1}
                value={form[field]}
                onChange={set(field)}
              />
            </Field>
          ))}
        </div>
      </div>

      {success && (
        <div style={{ background: '#f0fdf4', color: '#166534', padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 10 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '9px 24px', borderRadius: 8, border: 'none',
            background: loading ? '#a5b4fc' : '#6366f1', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Saving...' : 'Save Subscription'}
        </button>
      </div>
    </div>
  );
}

export default function SchoolSubscription() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchools = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await listSchools();
      const payload = res.data || res;
      setSchools(payload?.data || payload?.schools || (Array.isArray(payload) ? payload : []));
    } catch (err) {
      setError(err.message || 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading subscriptions...</div>;
  }

  if (error) {
    return <div style={{ background: '#fef2f2', color: '#dc2626', padding: 16, borderRadius: 8, fontSize: 14 }}>{error}</div>;
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, color: '#0f172a' }}>Subscription Management</h2>
      {schools.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No schools found.</div>
      ) : (
        schools.map((school) => (
          <SubscriptionCard
            key={school.school_id || school.id}
            school={school}
            onUpdated={fetchSchools}
          />
        ))
      )}
    </div>
  );
}