import React, { useState } from 'react';

const CATEGORY_CONFIG = {
  general    : { icon: '📋', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0'  },
  academic   : { icon: '📚', color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe'  },
  exam       : { icon: '📖', color: '#5b21b6', bg: '#ede9fe', border: '#ddd6fe'  },
  holiday    : { icon: '🎉', color: '#166534', bg: '#dcfce7', border: '#bbf7d0'  },
  event      : { icon: '🎭', color: '#0e7490', bg: '#cffafe', border: '#a5f3fc'  },
  fee        : { icon: '💰', color: '#854d0e', bg: '#fef9c3', border: '#fde68a'  },
  sports     : { icon: '⚽', color: '#166534', bg: '#dcfce7', border: '#bbf7d0'  },
  emergency  : { icon: '🚨', color: '#991b1b', bg: '#fee2e2', border: '#fecaca'  },
  circular   : { icon: '📄', color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd'  },
};

const NoticeCard = ({
  notice,
  userRole,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  const [hovered, setHovered] = useState(false);

  const isPrincipalOrTeacher = ['principal', 'teacher'].includes(userRole);
  const cat  = CATEGORY_CONFIG[notice.category] || CATEGORY_CONFIG.general;

  const isExpired  = notice.expiryDate && new Date(notice.expiryDate) < new Date();
  const isNew      = notice.createdAt
    && (Date.now() - new Date(notice.createdAt).getTime()) < 86400000 * 2; // within 2 days

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : '—';

  const truncate = (str, max) =>
    str && str.length > max ? str.slice(0, max) + '…' : str || '';

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div
      onClick={onView}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background   : 'white',
        borderRadius : 12,
        border       : `1px solid ${notice.isUrgent ? '#fecaca' : hovered ? cat.border : '#f1f5f9'}`,
        boxShadow    : hovered
          ? '0 8px 25px rgba(0,0,0,0.1)'
          : notice.isPinned
          ? '0 4px 12px rgba(37,99,235,0.12)'
          : '0 1px 3px rgba(0,0,0,0.06)',
        cursor       : 'pointer',
        transition   : 'all 0.2s ease',
        transform    : hovered ? 'translateY(-2px)' : 'translateY(0)',
        overflow     : 'hidden',
        position     : 'relative',
        opacity      : isExpired ? 0.7 : 1,
      }}
    >
      {/* Urgent stripe */}
      {notice.isUrgent && (
        <div style={{
          height     : 4,
          background : 'linear-gradient(90deg, #ef4444, #dc2626)',
        }} />
      )}

      {/* Pinned stripe */}
      {notice.isPinned && !notice.isUrgent && (
        <div style={{
          height     : 4,
          background : 'linear-gradient(90deg, #2563eb, #7c3aed)',
        }} />
      )}

      {/* Normal category stripe */}
      {!notice.isUrgent && !notice.isPinned && (
        <div style={{ height: 4, background: cat.color + '40' }} />
      )}

      <div style={{ padding: 18 }}>
        {/* ── Top row: icon + title + badges ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          gap: 12, marginBottom: 12,
        }}>
          {/* Category icon */}
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: cat.bg, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>
            {cat.icon}
          </div>

          {/* Title block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: 6, flexWrap: 'wrap', marginBottom: 4,
            }}>
              <h3 style={{
                margin     : 0,
                fontSize   : 14,
                fontWeight : 700,
                color      : '#0f172a',
                lineHeight : 1.3,
              }}>
                {truncate(notice.title, 55)}
              </h3>
            </div>

            {/* Badges row */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Category badge */}
              <span style={{
                background   : cat.bg,
                color        : cat.color,
                fontSize     : 10,
                fontWeight   : 700,
                padding      : '2px 8px',
                borderRadius : 10,
                textTransform: 'capitalize',
                border       : `1px solid ${cat.border}`,
              }}>
                {notice.category || 'General'}
              </span>

              {/* Urgent badge */}
              {notice.isUrgent && (
                <span style={{
                  background   : '#fee2e2',
                  color        : '#991b1b',
                  fontSize     : 10,
                  fontWeight   : 800,
                  padding      : '2px 8px',
                  borderRadius : 10,
                  animation    : 'pulse 2s infinite',
                }}>
                  🚨 URGENT
                </span>
              )}

              {/* Pinned badge */}
              {notice.isPinned && (
                <span style={{
                  background: '#eff6ff', color: '#1d4ed8',
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 10,
                }}>
                  📌 Pinned
                </span>
              )}

              {/* New badge */}
              {isNew && !isExpired && (
                <span style={{
                  background: '#dcfce7', color: '#166534',
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 10,
                }}>
                  NEW
                </span>
              )}

              {/* Expired badge */}
              {isExpired && (
                <span style={{
                  background: '#f1f5f9', color: '#94a3b8',
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 10,
                }}>
                  EXPIRED
                </span>
              )}

              {/* Draft badge */}
              {notice.status === 'draft' && (
                <span style={{
                  background: '#fef9c3', color: '#854d0e',
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 10,
                }}>
                  DRAFT
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Content preview ── */}
        <p style={{
          margin     : '0 0 14px',
          fontSize   : 13,
          color      : '#64748b',
          lineHeight : 1.6,
        }}>
          {truncate(notice.content || notice.description || 'No description provided.', 120)}
        </p>

        {/* ── Tags ── */}
        {notice.tags && notice.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
            {(Array.isArray(notice.tags)
              ? notice.tags
              : notice.tags.split(',').map((t) => t.trim())
            ).slice(0, 3).map((tag) => (
              <span key={tag} style={{
                background: '#f8fafc', color: '#64748b',
                fontSize: 10, fontWeight: 600,
                padding: '1px 7px', borderRadius: 10,
                border: '1px solid #f1f5f9',
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Meta row ── */}
        <div style={{
          display       : 'flex',
          justifyContent: 'space-between',
          alignItems    : 'center',
          paddingTop    : 12,
          borderTop     : '1px solid #f8fafc',
        }}>
          {/* Left: author + date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{
              display    : 'flex', alignItems: 'center',
              gap        : 5, fontSize: 12, color: '#64748b',
            }}>
              <div style={{
                width          : 20, height: 20, borderRadius: '50%',
                background     : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display        : 'flex', alignItems: 'center',
                justifyContent : 'center',
                fontSize       : 9, fontWeight: 800, color: 'white',
              }}>
                {(notice.authorName || notice.author?.name || 'S').charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: 500 }}>
                {notice.authorName || notice.author?.name || 'Staff'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {fmtDate(notice.createdAt)}
            </div>
          </div>

          {/* Right: audience + attachments */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {notice.audience && (
              <span style={{
                fontSize     : 11,
                color        : '#64748b',
                background   : '#f8fafc',
                padding      : '3px 9px',
                borderRadius : 10,
                border       : '1px solid #f1f5f9',
                fontWeight   : 500,
                textTransform: 'capitalize',
              }}>
                👥 {notice.audience}
              </span>
            )}
            {notice.attachments && notice.attachments.length > 0 && (
              <span style={{
                fontSize   : 11, color: '#2563eb',
                display    : 'flex', alignItems: 'center', gap: 3,
              }}>
                📎 {notice.attachments.length}
              </span>
            )}
          </div>
        </div>

        {/* ── Action buttons (teacher/principal only) ── */}
        {isPrincipalOrTeacher && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display  : 'flex', gap: 7,
              marginTop: 14, paddingTop: 12,
              borderTop: '1px solid #f8fafc',
            }}
          >
            {/* View */}
            <button
              onClick={onView}
              style={{
                flex         : 1,
                background   : cat.bg,
                color        : cat.color,
                border       : `1px solid ${cat.border}`,
                padding      : '7px 0',
                borderRadius : 7,
                cursor       : 'pointer',
                fontSize     : 12,
                fontWeight   : 600,
                transition   : 'opacity 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              👁️ View
            </button>

            {/* Pin */}
            <button
              onClick={onTogglePin}
              title={notice.isPinned ? 'Unpin' : 'Pin to top'}
              style={{
                background   : notice.isPinned ? '#eff6ff' : '#f8fafc',
                color        : notice.isPinned ? '#2563eb' : '#94a3b8',
                border       : `1px solid ${notice.isPinned ? '#bfdbfe' : '#e2e8f0'}`,
                padding      : '7px 12px',
                borderRadius : 7,
                cursor       : 'pointer', fontSize: 14,
              }}
            >
              📌
            </button>

            {/* Edit */}
            <button
              onClick={onEdit}
              style={{
                background   : '#f8fafc',
                color        : '#475569',
                border       : '1px solid #e2e8f0',
                padding      : '7px 12px',
                borderRadius : 7,
                cursor       : 'pointer', fontSize: 14,
              }}
            >
              ✏️
            </button>

            {/* Delete */}
            <button
              onClick={onDelete}
              style={{
                background   : '#fff1f2',
                color        : '#be123c',
                border       : '1px solid #fecdd3',
                padding      : '7px 12px',
                borderRadius : 7,
                cursor       : 'pointer', fontSize: 14,
              }}
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default NoticeCard;
