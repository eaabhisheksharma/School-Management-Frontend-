// // src/components/admin/UserList.jsx
// import React, { useEffect, useState, useCallback } from 'react';
// import { listAllUsers, toggleUserStatus, resetUserPassword } from '../../api/adminApi';

// const ROLE_COLORS = {
//   super_admin:  { bg: '#fae8ff', text: '#7e22ce' },
//   school_admin: { bg: '#e0f2fe', text: '#075985' },
//   principal:    { bg: '#dbeafe', text: '#1e40af' },
//   teacher:      { bg: '#dcfce7', text: '#166534' },
//   student:      { bg: '#fef9c3', text: '#854d0e' },
//   parent:       { bg: '#ffedd5', text: '#9a3412' },
//   accountant:   { bg: '#f3f4f6', text: '#374151' },
//   librarian:    { bg: '#f3f4f6', text: '#374151' },
//   staff:        { bg: '#f3f4f6', text: '#374151' },
// };

// const RoleBadge = ({ role }) => {
//   const c = ROLE_COLORS[role] || ROLE_COLORS.staff;
//   return (
//     <span style={{
//       background: c.bg, color: c.text,
//       padding: '2px 10px', borderRadius: 999,
//       fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
//       whiteSpace: 'nowrap',
//     }}>
//       {role?.replace('_', ' ')}
//     </span>
//   );
// };

// const ROLES = ['super_admin','school_admin','principal','teacher','student','parent','accountant','librarian','staff'];

// // Password reset modal
// const ResetPasswordModal = ({ user, onClose }) => {
//   const [pwd, setPwd]         = useState('');
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg]         = useState('');
//   const [err, setErr]         = useState('');

//   const handleReset = async () => {
//     if (pwd.length < 8) { setErr('Min 8 characters'); return; }
//     setLoading(true);
//     setErr('');
//     try {
//       await resetUserPassword(user.user_id, pwd);
//       setMsg('Password reset successfully');
//       setTimeout(onClose, 1500);
//     } catch (e) {
//       setErr(e.response?.data?.error || 'Failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
//     }}>
//       <div style={{
//         background: '#fff', borderRadius: 12, padding: 24,
//         width: 340, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
//       }}>
//         <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>Reset Password</h3>
//         <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px' }}>
//           For: {user.first_name} {user.last_name} ({user.email})
//         </p>
//         <input
//           type="password"
//           placeholder="New password (min 8 chars)"
//           value={pwd}
//           onChange={e => { setPwd(e.target.value); setErr(''); }}
//           style={{
//             width: '100%', padding: '8px 12px', borderRadius: 8,
//             border: `1px solid ${err ? '#fca5a5' : '#e5e7eb'}`, fontSize: 13,
//             boxSizing: 'border-box', outline: 'none', marginBottom: 8,
//           }}
//         />
//         {err && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 8 }}>{err}</div>}
//         {msg && <div style={{ fontSize: 12, color: '#22c55e', marginBottom: 8 }}>{msg}</div>}
//         <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//           <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
//             Cancel
//           </button>
//           <button
//             onClick={handleReset}
//             disabled={loading}
//             style={{ padding: '7px 16px', borderRadius: 7, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
//           >
//             {loading ? 'Resetting...' : 'Reset'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function UserList({ schoolId = null }) {
//   const [users, setUsers]         = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [error, setError]         = useState('');
//   const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

//   const [search, setSearch]       = useState('');
//   const [role, setRole]           = useState('');
//   const [isActive, setIsActive]   = useState('');
//   const [page, setPage]           = useState(1);
//   const [actionLoading, setActionLoading] = useState({});
//   const [resetUser, setResetUser] = useState(null);

//   const fetchUsers = useCallback(() => {
//     setLoading(true);
//     setError('');
//     const params = {
//       page, limit: 15,
//       search:    search    || undefined,
//       role:      role      || undefined,
//       is_active: isActive  !== '' ? isActive : undefined,
//       school_id: schoolId  || undefined,
//     };
//     listAllUsers(params)
//       .then(r => {
//         setUsers(r.data.data);
//         setPagination(r.data.pagination);
//       })
//       .catch(() => setError('Failed to load users'))
//       .finally(() => setLoading(false));
//   }, [page, search, role, isActive, schoolId]);

//   useEffect(() => { fetchUsers(); }, [fetchUsers]);
//   useEffect(() => { setPage(1); }, [search, role, isActive]);

//   const handleToggle = async (user) => {
//     setActionLoading(p => ({ ...p, [user.user_id]: true }));
//     try {
//       await toggleUserStatus(user.user_id, !user.is_active);
//       fetchUsers();
//     } catch {
//       alert('Action failed');
//     } finally {
//       setActionLoading(p => ({ ...p, [user.user_id]: false }));
//     }
//   };

//   return (
//     <div>
//       {resetUser && (
//         <ResetPasswordModal user={resetUser} onClose={() => { setResetUser(null); fetchUsers(); }} />
//       )}

//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
//         <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
//           {schoolId ? 'School Users' : 'All Users'}
//           {!loading && (
//             <span style={{ marginLeft: 8, fontSize: 13, color: '#6b7280', fontWeight: 400 }}>
//               ({pagination.total})
//             </span>
//           )}
//         </h2>
//       </div>

//       {/* Filters */}
//       <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
//         <input
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="Search name, email, mobile..."
//           style={{ flex: '1 1 220px', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }}
//         />
//         <select
//           value={role}
//           onChange={e => setRole(e.target.value)}
//           style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
//         >
//           <option value="">All Roles</option>
//           {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
//         </select>
//         <select
//           value={isActive}
//           onChange={e => setIsActive(e.target.value)}
//           style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
//         >
//           <option value="">All Status</option>
//           <option value="true">Active</option>
//           <option value="false">Inactive</option>
//         </select>
//       </div>

//       {error && (
//         <div style={{ color: '#ef4444', background: '#fef2f2', padding: 12, borderRadius: 8, marginBottom: 12 }}>
//           {error}
//         </div>
//       )}

//       <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #e5e7eb' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//           <thead>
//             <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
//               {['User', 'Role', 'Contact', 'Status', 'Last Login', 'Actions'].map(h => (
//                 <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               Array.from({ length: 8 }).map((_, i) => (
//                 <tr key={i}>
//                   {Array.from({ length: 6 }).map((_, j) => (
//                     <td key={j} style={{ padding: '12px 14px' }}>
//                       <div style={{ height: 14, background: '#f3f4f6', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
//                   No users found
//                 </td>
//               </tr>
//             ) : users.map(user => (
//               <tr
//                 key={user.user_id}
//                 style={{ borderBottom: '1px solid #f3f4f6' }}
//                 onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
//                 onMouseLeave={e => e.currentTarget.style.background = ''}
//               >
//                 <td style={{ padding: '12px 14px' }}>
//                   <div style={{ fontWeight: 600, color: '#111' }}>
//                     {user.first_name} {user.last_name}
//                   </div>
//                   {user.school_id && (
//                     <div style={{ fontSize: 11, color: '#9ca3af' }}>
//                       School ID: {user.school_id.slice(0, 8)}…
//                     </div>
//                   )}
//                 </td>
//                 <td style={{ padding: '12px 14px' }}>
//                   <RoleBadge role={user.role} />
//                 </td>
//                 <td style={{ padding: '12px 14px' }}>
//                   <div style={{ color: '#374151' }}>{user.email || '—'}</div>
//                   <div style={{ color: '#9ca3af', fontSize: 12 }}>{user.mobile_number || ''}</div>
//                 </td>
//                 <td style={{ padding: '12px 14px' }}>
//                   <span style={{
//                     display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
//                     background: user.is_active ? '#22c55e' : '#ef4444',
//                     marginRight: 6,
//                   }} />
//                   {user.is_active ? 'Active' : 'Inactive'}
//                 </td>
//                 <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: 12, whiteSpace: 'nowrap' }}>
//                   {user.last_login_at
//                     ? new Date(user.last_login_at).toLocaleDateString('en-IN')
//                     : 'Never'}
//                 </td>
//                 <td style={{ padding: '12px 14px' }}>
//                   <div style={{ display: 'flex', gap: 6 }}>
//                     <button
//                       disabled={actionLoading[user.user_id]}
//                       onClick={() => handleToggle(user)}
//                       style={{
//                         padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 12,
//                         fontWeight: 600, cursor: 'pointer',
//                         background: user.is_active ? '#fee2e2' : '#dcfce7',
//                         color:      user.is_active ? '#dc2626' : '#16a34a',
//                       }}
//                     >
//                       {actionLoading[user.user_id] ? '…' : user.is_active ? 'Deactivate' : 'Activate'}
//                     </button>
//                     <button
//                       onClick={() => setResetUser(user)}
//                       style={{
//                         padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb',
//                         background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#374151',
//                       }}
//                     >
//                       Reset Pwd
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {pagination.pages > 1 && (
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
//           <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
//             style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
//             ← Prev
//           </button>
//           <span style={{ fontSize: 13, color: '#6b7280' }}>
//             Page {pagination.page} of {pagination.pages}
//           </span>
//           <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}
//             style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
//             Next →
//           </button>
//         </div>
//       )}

//       <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
//     </div>
//   );
// }




// src/components/admin/UserList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { listAllUsers, toggleUserStatus, resetUserPassword } from '../../api/adminApi';

const ROLE_COLORS = {
  super_admin: { bg: '#fae8ff', text: '#7e22ce' },
  school_admin: { bg: '#e0f2fe', text: '#075985' },
  principal: { bg: '#dbeafe', text: '#1e40af' },
  teacher: { bg: '#dcfce7', text: '#166534' },
  student: { bg: '#fef9c3', text: '#854d0e' },
  parent: { bg: '#ffedd5', text: '#9a3412' },
  accountant: { bg: '#f3f4f6', text: '#374151' },
  librarian: { bg: '#f3f4f6', text: '#374151' },
  staff: { bg: '#f3f4f6', text: '#374151' },
};

const RoleBadge = ({ role }) => {
  const c = ROLE_COLORS[role] || ROLE_COLORS.staff;

  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {role?.replace('_', ' ')}
    </span>
  );
};

const ROLES = ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent', 'accountant', 'librarian', 'staff'];

const getUserId = (user) => user?.user_id || user?.id;

const ResetPasswordModal = ({ user, onClose }) => {
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleReset = async () => {
    const userId = getUserId(user);

    if (pwd.length < 8) {
      setErr('Min 8 characters');
      return;
    }

    setLoading(true);
    setErr('');

    try {
      await resetUserPassword(userId, { new_password: pwd });
      setMsg('Password reset successfully');
      setTimeout(onClose, 1500);
    } catch (e) {
      setErr(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          width: 340,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>Reset Password</h3>
        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px' }}>
          For: {user.first_name} {user.last_name} ({user.email})
        </p>

        <input
          type="password"
          placeholder="New password (min 8 chars)"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            setErr('');
          }}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${err ? '#fca5a5' : '#e5e7eb'}`,
            fontSize: 13,
            boxSizing: 'border-box',
            outline: 'none',
            marginBottom: 8,
          }}
        />

        {err && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 8 }}>{err}</div>}
        {msg && <div style={{ fontSize: 12, color: '#22c55e', marginBottom: 8 }}>{msg}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '7px 16px',
              borderRadius: 7,
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            style={{
              padding: '7px 16px',
              borderRadius: 7,
              border: 'none',
              background: '#6366f1',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {loading ? 'Resetting...' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserList({ schoolId = null }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState('');
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const [resetUser, setResetUser] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError('');

    const params = {
      page,
      limit: 15,
      search: search || undefined,
      role: role || undefined,
      is_active: isActive || undefined,
      school_id: schoolId || undefined,
    };

    listAllUsers(params)
      .then((r) => {
        const payload = r.data || {};
        setUsers(payload.data || []);
        setPagination(payload.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch((e) => setError(e.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, [page, search, role, isActive, schoolId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, role, isActive]);

  const handleToggle = async (user) => {
    const userId = getUserId(user);

    setActionLoading((p) => ({ ...p, [userId]: true }));

    try {
      await toggleUserStatus(userId, !user.is_active);
      fetchUsers();
    } catch (e) {
      alert(e.message || 'Action failed');
    } finally {
      setActionLoading((p) => ({ ...p, [userId]: false }));
    }
  };

  return (
    <div>
      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => {
            setResetUser(null);
            fetchUsers();
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
          {schoolId ? 'School Users' : 'All Users'}
          {!loading && (
            <span style={{ marginLeft: 8, fontSize: 13, color: '#6b7280', fontWeight: 400 }}>
              ({pagination.total})
            </span>
          )}
        </h2>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, mobile..."
          style={{ flex: '1 1 220px', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replace('_', ' ')}
            </option>
          ))}
        </select>

        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {error && (
        <div style={{ color: '#ef4444', background: '#fef2f2', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['User', 'Role', 'Contact', 'Status', 'Last Login', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} style={{ padding: '12px 14px' }}>
                      <div style={{ height: 14, background: '#f3f4f6', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const userId = getUserId(user);

                return (
                  <tr
                    key={userId}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#111' }}>
                        {user.first_name} {user.last_name}
                      </div>
                      {user.school_id && (
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>
                          School ID: {String(user.school_id).slice(0, 8)}…
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <RoleBadge role={user.role} />
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ color: '#374151' }}>{user.email || '—'}</div>
                      <div style={{ color: '#9ca3af', fontSize: 12 }}>{user.mobile_number || ''}</div>
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: user.is_active ? '#22c55e' : '#ef4444',
                          marginRight: 6,
                        }}
                      />
                      {user.is_active ? 'Active' : 'Inactive'}
                    </td>

                    <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString('en-IN')
                        : 'Never'}
                    </td>

                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          disabled={actionLoading[userId]}
                          onClick={() => handleToggle(user)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: user.is_active ? '#fee2e2' : '#dcfce7',
                            color: user.is_active ? '#dc2626' : '#16a34a',
                          }}
                        >
                          {actionLoading[userId] ? '…' : user.is_active ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          onClick={() => setResetUser(user)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: '#374151',
                          }}
                        >
                          Reset Pwd
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13 }}
          >
            ← Prev
          </button>

          <span style={{ fontSize: 13, color: '#6b7280' }}>
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13 }}
          >
            Next →
          </button>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}