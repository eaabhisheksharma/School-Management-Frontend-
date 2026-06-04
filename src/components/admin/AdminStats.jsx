// // src/components/admin/AdminStats.jsx
// import React, { useEffect, useState } from 'react';
// import { getPlatformStats } from '../../api/adminApi';

// const icons = {
//   total:     '🏫',
//   active:    '✅',
//   trial:     '⏳',
//   suspended: '🚫',
//   users:     '👥',
//   students:  '🎓',
//   teachers:  '📚',
//   new:       '🆕',
// };

// const StatCard = ({ icon, label, value, sub, color }) => (
//   <div style={{
//     background: '#fff',
//     border: '1px solid #e5e7eb',
//     borderRadius: 12,
//     padding: '20px 24px',
//     display: 'flex',
//     alignItems: 'center',
//     gap: 16,
//     boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
//     transition: 'box-shadow 0.2s',
//     cursor: 'default',
//   }}
//     onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
//     onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
//   >
//     <div style={{
//       width: 48, height: 48, borderRadius: 12,
//       background: color + '18',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       fontSize: 22, flexShrink: 0,
//     }}>
//       {icon}
//     </div>
//     <div>
//       <div style={{ fontSize: 26, fontWeight: 700, color: '#111', lineHeight: 1.1 }}>
//         {value ?? <span style={{ color: '#ccc' }}>—</span>}
//       </div>
//       <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{label}</div>
//       {sub && <div style={{ fontSize: 12, color: color, marginTop: 2, fontWeight: 500 }}>{sub}</div>}
//     </div>
//   </div>
// );

// const Skeleton = () => (
//   <div style={{
//     background: '#f3f4f6', borderRadius: 12, padding: '20px 24px',
//     height: 90, animation: 'pulse 1.5s infinite',
//   }} />
// );

// export default function AdminStats() {
//   const [stats, setStats]   = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]   = useState('');

//   useEffect(() => {
//     getPlatformStats()
//       .then(r => setStats(r.data.data))
//       .catch(() => setError('Failed to load stats'))
//       .finally(() => setLoading(false));
//   }, []);

//   if (error) return (
//     <div style={{ color: '#ef4444', padding: 16, background: '#fef2f2', borderRadius: 8 }}>
//       {error}
//     </div>
//   );

//   const s = stats?.schools || {};
//   const u = stats?.users   || {};

//   const cards = [
//     { icon: icons.total,     label: 'Total Schools',       value: s.total,           color: '#6366f1' },
//     { icon: icons.active,    label: 'Active Schools',      value: s.active,          color: '#22c55e', sub: s.new_last_30_days ? `+${s.new_last_30_days} this month` : null },
//     { icon: icons.trial,     label: 'Trial Schools',       value: s.trial,           color: '#f59e0b' },
//     { icon: icons.suspended, label: 'Suspended/Cancelled', value: (s.suspended || 0) + (s.cancelled || 0), color: '#ef4444' },
//     { icon: icons.users,     label: 'Total Users',         value: u.total,           color: '#0ea5e9' },
//     { icon: icons.students,  label: 'Students',            value: u.students,        color: '#8b5cf6' },
//     { icon: icons.teachers,  label: 'Teachers',            value: u.teachers,        color: '#10b981' },
//     { icon: icons.new,       label: 'Parents',             value: u.parents,         color: '#f97316' },
//   ];

//   return (
//     <div>
//       <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16 }}>
//         Platform Overview
//       </h2>
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
//         gap: 16,
//       }}>
//         {loading
//           ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
//           : cards.map((c, i) => <StatCard key={i} {...c} />)
//         }
//       </div>

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }
//       `}</style>
//     </div>
//   );
// }




// src/components/admin/AdminStats.jsx
import React, { useEffect, useState } from 'react';
import { getPlatformStats } from '../../api/adminApi';

const icons = {
  total: '🏫',
  active: '✅',
  trial: '⏳',
  suspended: '🚫',
  users: '👥',
  students: '🎓',
  teachers: '📚',
  new: '🆕',
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)')}
    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)')}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${color}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#111', lineHeight: 1.1 }}>
        {value ?? <span style={{ color: '#ccc' }}>—</span>}
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color, marginTop: 2, fontWeight: 500 }}>{sub}</div>}
    </div>
  </div>
);

const Skeleton = () => (
  <div
    style={{
      background: '#f3f4f6',
      borderRadius: 12,
      padding: '20px 24px',
      height: 90,
      animation: 'pulse 1.5s infinite',
    }}
  />
);

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPlatformStats()
      .then((r) => {
        const payload = r.data?.data || r.data || {};
        setStats(payload);
      })
      .catch((e) => setError(e.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div style={{ color: '#ef4444', padding: 16, background: '#fef2f2', borderRadius: 8 }}>
        {error}
      </div>
    );
  }

  const s = stats?.schools || stats?.schoolStats || {};
  const u = stats?.users || stats?.userStats || {};

  const cards = [
    { icon: icons.total, label: 'Total Schools', value: s.total, color: '#6366f1' },
    {
      icon: icons.active,
      label: 'Active Schools',
      value: s.active,
      color: '#22c55e',
      sub: s.new_last_30_days ? `+${s.new_last_30_days} this month` : null,
    },
    { icon: icons.trial, label: 'Trial Schools', value: s.trial, color: '#f59e0b' },
    {
      icon: icons.suspended,
      label: 'Suspended/Cancelled',
      value: (s.suspended || 0) + (s.cancelled || 0),
      color: '#ef4444',
    },
    { icon: icons.users, label: 'Total Users', value: u.total, color: '#0ea5e9' },
    { icon: icons.students, label: 'Students', value: u.students, color: '#8b5cf6' },
    { icon: icons.teachers, label: 'Teachers', value: u.teachers, color: '#10b981' },
    { icon: icons.new, label: 'Parents', value: u.parents, color: '#f97316' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16 }}>
        Platform Overview
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
          : cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}