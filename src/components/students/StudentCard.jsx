import React, { useState } from 'react';

const GENDER_CONFIG = {
  male   : { bg: 'linear-gradient(135deg,#2563eb,#0284c7)', emoji: '👦' },
  female : { bg: 'linear-gradient(135deg,#9333ea,#c026d3)', emoji: '👧' },
  other  : { bg: 'linear-gradient(135deg,#475569,#64748b)', emoji: '🧑' },
};

const STATUS_CONFIG = {
  active      : { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
  inactive    : { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
  transferred : { bg: '#fef9c3', color: '#854d0e', dot: '#f59e0b' },
  graduated   : { bg: '#ede9fe', color: '#5b21b6', dot: '#8b5cf6' },
};

const StudentCard = ({
  student,
  userRole,
  selected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}) => {
  const [hovered, setHovered] = useState(false);
  const isPrincipalOrTeacher  = ['principal', 'teacher'].includes(userRole);

  const genderCfg = GENDER_CONFIG[student.gender] || GENDER_CONFIG.other;
  const statusCfg = STATUS_CONFIG[student.status] || STATUS_CONFIG.active;

  const initials = (name) =>
    (name || 'S').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const age = student.dateOfBirth
    ? Math.floor((Date.now() - new Date(student.dateOfBirth)) / 31557600000)
    : null;

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background   : 'white',
        borderRadius : 14,
        border       : `2px solid ${selected ? '#2563eb' : hovered ? '#bfdbfe' : '#f1f5f9'}`,
        boxShadow    : hovered
          ? '0 10px 30px rgba(0,0,0,0.1)'
          : selected
          ? '0 0 0 3px rgba(37,99,235,0.15)'
          : '0 1px 3px rgba(0,0,0,0.06)',
        transition   : 'all 0.2s ease',
        transform    : hovered ? 'translateY(-3px)' : 'translateY(0)',
        cursor       : 'pointer',
        overflow     : 'hidden',
        position     : 'relative',
      }}
    >
      {/* Select checkbox */}
      {isPrincipalOrTeacher && (
        <div
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          style={{
            position   : 'absolute', top: 12, left: 12, zIndex: 2,
          }}
        >
          <div style={{
            width       : 20, height: 20, borderRadius: 6,
            background  : selected ? '#2563eb' : 'white',
            border      : `2px solid ${selected ? '#2563eb' : '#d1d5db'}`,
            display     : 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow   : '0 1px 3px rgba(0,0,0,0.15)',
            transition  : 'all 0.15s',
          }}>
            {selected && <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>✓</span>}
          </div>
        </div>
      )}

      {/* Card header gradient */}
      <div style={{
        height         : 72,
        background     : genderCfg.bg,
        position       : 'relative',
        overflow       : 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position   : 'absolute', top: -20, right: -20,
          width      : 80, height: 80, borderRadius: '50%',
          background : 'rgba(255,255,255,0.1)',
        }} />
        <div style={{
          position   : 'absolute', bottom: -30, left: 60,
          width      : 70, height: 70, borderRadius: '50%',
          background : 'rgba(255,255,255,0.07)',
        }} />
      </div>

      {/* Avatar */}
      <div style={{ padding: '0 18px 18px', position: 'relative', marginTop: -30 }}>
        <div style={{
          width          : 60, height: 60, borderRadius: 14,
          background     : student.profilePhoto ? 'transparent' : genderCfg.bg,
          border         : '3px solid white',
          display        : 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize       : 22, fontWeight: 800, color: 'white',
          overflow       : 'hidden', marginBottom: 12,
          boxShadow      : '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {student.profilePhoto
            ? <img
                src={student.profilePhoto} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            : initials(student.name)}
        </div>

        {/* Status badge */}
        <div style={{
          position      : 'absolute', top: -24, right: 18,
          display       : 'flex', alignItems: 'center', gap: 5,
          background    : statusCfg.bg,
          color         : statusCfg.color,
          padding       : '4px 10px', borderRadius: 20,
          fontSize      : 11, fontWeight: 700,
          border        : '2px solid white',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: statusCfg.dot, flexShrink: 0,
          }} />
          {(student.status || 'active').charAt(0).toUpperCase() +
           (student.status || 'active').slice(1)}
        </div>

        {/* Student name */}
        <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
          {student.name}
        </h3>

        {/* Sub info */}
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
          {student.className || student.class?.name || 'No Class'}
          {student.section  ? ` • ${student.section}` : ''}
        </div>

        {/* Info pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {student.rollNo && (
            <span style={{
              background: '#f8fafc', color: '#475569',
              padding: '3px 9px', borderRadius: 8,
              fontSize: 12, fontWeight: 600,
              border: '1px solid #e2e8f0',
            }}>
              📋 Roll: {student.rollNo}
            </span>
          )}
          {age && (
            <span style={{
              background: '#f0f9ff', color: '#0284c7',
              padding: '3px 9px', borderRadius: 8,
              fontSize: 12, fontWeight: 600,
              border: '1px solid #bae6fd',
            }}>
              🎂 {age}y
            </span>
          )}
          {student.bloodGroup && (
            <span style={{
              background: '#fff1f2', color: '#be123c',
              padding: '3px 9px', borderRadius: 8,
              fontSize: 12, fontWeight: 700,
              border: '1px solid #fecdd3',
            }}>
              💉 {student.bloodGroup}
            </span>
          )}
          <span style={{
            background: student.gender === 'female' ? '#fdf4ff' : '#eff6ff',
            color: student.gender === 'female' ? '#9333ea' : '#2563eb',
            padding: '3px 9px', borderRadius: 8,
            fontSize: 12, fontWeight: 600,
            border: `1px solid ${student.gender === 'female' ? '#e9d5ff' : '#bfdbfe'}`,
          }}>
            {genderCfg.emoji} {(student.gender || 'N/A').charAt(0).toUpperCase() +
              (student.gender || '').slice(1)}
          </span>
        </div>

        {/* Parent contact */}
        {(student.fatherPhone || student.parentPhone) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 12px', marginBottom: 14,
            background: '#f8fafc', borderRadius: 8,
            border: '1px solid #f1f5f9',
            fontSize: 12, color: '#475569',
          }}>
            <span>📞</span>
            <span style={{ fontWeight: 500 }}>
              {student.fatherPhone || student.parentPhone}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', gap: 8 }}
        >
          <button
            onClick={onView}
            style={{
              flex         : 1,
              background   : '#eff6ff',
              color        : '#2563eb',
              border       : '1px solid #bfdbfe',
              padding      : '8px 0',
              borderRadius : 8,
              cursor       : 'pointer',
              fontSize     : 13,
              fontWeight   : 700,
              transition   : 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.color = '#2563eb';
            }}
          >
            👁️ View
          </button>

          {isPrincipalOrTeacher && (
            <>
              <button
                onClick={onEdit}
                style={{
                  background   : '#f8fafc',
                  color        : '#475569',
                  border       : '1px solid #e2e8f0',
                  padding      : '8px 12px',
                  borderRadius : 8,
                  cursor       : 'pointer',
                  fontSize     : 14,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                ✏️
              </button>
              <button
                onClick={onDelete}
                style={{
                  background   : '#fff1f2',
                  color        : '#be123c',
                  border       : '1px solid #fecdd3',
                  padding      : '8px 12px',
                  borderRadius : 8,
                  cursor       : 'pointer',
                  fontSize     : 14,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fecdd3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff1f2';
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

export default StudentCard;
