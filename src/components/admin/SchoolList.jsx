// src/components/admin/SchoolList.jsx
import React, { useState, useEffect } from 'react';
import { listSchools, toggleSchoolStatus } from '../../api/adminApi'; // FIXED NAMES
import SchoolForm from './SchoolForm';

const SchoolList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await listSchools();
      const payload = res.data || res;
      setSchools(payload?.data || payload?.schools || []);
    } catch (err) {
      console.error('Failed to fetch schools:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, []);

  const handleToggleStatus = async (id) => {
    if (!window.confirm('Are you sure you want to toggle this school\'s status?')) return;
    try {
      await toggleSchoolStatus(id);
      fetchSchools();
    } catch (err) { alert('Failed to toggle status'); }
  };

  const filtered = schools.filter(s => 
    s.school_name?.toLowerCase().includes(search.toLowerCase()) || 
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const colors = { active: '#dcfce7', inactive: '#fee2e2', trial: '#fef9c3', pending: '#f1f5f9', suspended: '#fef9c3' };
    const textColors = { active: '#166534', inactive: '#991b1b', trial: '#854d0e', pending: '#475569', suspended: '#854d0e' };
    return { background: colors[status] || '#f1f5f9', color: textColors[status] || '#475569' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>🏫 All Schools ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <input 
            style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, width: 250, fontSize: 14 }}
            placeholder="Search by name, email, city..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <button 
            onClick={() => { setEditData(null); setShowForm(true); }}
            style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
          >
            + Add School
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading schools...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No schools found.</div>
      ) : (
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>School Name</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Location</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Plan</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((school) => {
                  const badge = getStatusBadge(school.subscription_status || school.status);
                  return (
                    <tr key={school.school_id || school.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{school.school_name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{school.email}</div>
                        {school.subdomain && <div style={{ fontSize: 11, color: '#94a3b8' }}>{school.subdomain}</div>}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>
                        {school.city}{school.city && school.state ? ', ' : ''}{school.state}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{school.subscription_plan}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'capitalize', background: badge.background, color: badge.color }}>
                          {school.subscription_status || school.status || 'Unknown'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button onClick={() => { setEditData(school); setShowForm(true); }} title="Edit" style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: '#f5f3ff', color: '#7c3aed', cursor: 'pointer', fontWeight: 600 }}>✏️</button>
                          <button onClick={() => handleToggleStatus(school.school_id || school.id)} title="Toggle Status" style={{ padding: '6px 10px', border: 'none', borderRadius: 6, background: '#fef9c3', color: '#854d0e', cursor: 'pointer', fontWeight: 600 }}>⚠️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SchoolForm 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        fetchSchools={fetchSchools} 
        editData={editData} 
      />
    </div>
  );
};

export default SchoolList;