import React, { useState, useEffect, useCallback } from 'react';
import {
  getNotices,
  deleteNotice,
  pinNotice,
  unpinNotice,
} from '../../api/noticeApi';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';
import SearchBox from '../common/SearchBox';
import NoticeCard from './NoticeCard';
import NoticeForm from './NoticeForm';

const CATEGORIES = [
  { value: 'general',     label: '📋 General'      },
  { value: 'academic',    label: '📚 Academic'      },
  { value: 'exam',        label: '📖 Exam'          },
  { value: 'holiday',     label: '🎉 Holiday'       },
  { value: 'event',       label: '🎭 Event'         },
  { value: 'fee',         label: '💰 Fee'           },
  { value: 'sports',      label: '⚽ Sports'        },
  { value: 'emergency',   label: '🚨 Emergency'     },
  { value: 'circular',    label: '📄 Circular'      },
];

const NoticeList = ({ userRole, user }) => {
  const [notices, setNotices]           = useState([]);
  const [pinnedNotices, setPinnedNotices] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [search, setSearch]             = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAudience, setFilterAudience] = useState('');
  const [activeTab, setActiveTab]       = useState('all');
  const [pagination, setPagination]     = useState({
    page: 1, limit: 12, total: 0, pages: 1,
  });
  const [showForm, setShowForm]         = useState(false);
  const [editNotice, setEditNotice]     = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewNotice, setViewNotice]     = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const isPrincipalOrTeacher = ['principal', 'teacher'].includes(userRole);

  /* ─── fetch notices ──────────────────────────────────── */
  const fetchNotices = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page, limit: pagination.limit,
        ...(search          && { search }),
        ...(filterCategory  && { category : filterCategory  }),
        ...(filterAudience  && { audience : filterAudience  }),
        ...(activeTab === 'pinned'    && { pinned    : true }),
        ...(activeTab === 'my'        && { createdBy : user?.id }),
        ...(activeTab === 'published' && { status    : 'published' }),
        ...(activeTab === 'draft'     && { status    : 'draft' }),
      };
      const res = await getNotices(params);
      setNotices(res.data || []);
      if (res.pagination) setPagination((p) => ({ ...p, ...res.pagination, page }));

      /* fetch pinned separately for top banner */
      if (activeTab === 'all') {
        const pinRes = await getNotices({ pinned: true, limit: 5 }).catch(() => ({ data: [] }));
        setPinnedNotices(pinRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, filterAudience, activeTab, pagination.limit, user?.id]);

  useEffect(() => { fetchNotices(1); }, [filterCategory, filterAudience, activeTab]);

  /* ─── delete ─────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteNotice(deleteConfirm.id);
      setSuccess('Notice deleted successfully');
      setDeleteConfirm(null);
      fetchNotices(pagination.page);
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  /* ─── pin / unpin ────────────────────────────────────── */
  const handleTogglePin = async (notice) => {
    try {
      if (notice.isPinned) await unpinNotice(notice.id);
      else                 await pinNotice(notice.id);
      setSuccess(notice.isPinned ? 'Notice unpinned' : 'Notice pinned to top!');
      fetchNotices(pagination.page);
    } catch (err) {
      setError(err.message || 'Failed to update pin');
    }
  };

  /* ─── sub-views ──────────────────────────────────────── */
  if (showForm) {
    return (
      <NoticeForm
        notice={editNotice}
        userRole={userRole}
        user={user}
        onClose={(refresh) => {
          setShowForm(false);
          setEditNotice(null);
          if (refresh) fetchNotices(pagination.page);
        }}
      />
    );
  }

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            📢 Notices & Announcements
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
            School-wide notices, circulars and announcements
          </p>
        </div>
        {isPrincipalOrTeacher && (
          <Button
            icon="+"
            onClick={() => { setEditNotice(null); setShowForm(true); }}
          >
            Create Notice
          </Button>
        )}
      </div>

      {/* ── Alerts ── */}
      {error   && <Alert type="error"   message={error}   dismissible autoClose={5000} onClose={() => setError('')}   style={{ marginBottom: 16 }} />}
      {success && <Alert type="success" message={success} dismissible autoClose={3000} onClose={() => setSuccess('')} style={{ marginBottom: 16 }} />}

      {/* ── Pinned notices banner ── */}
      {activeTab === 'all' && pinnedNotices.length > 0 && (
        <div style={{
          background    : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
          borderRadius  : 12, padding: '16px 20px',
          marginBottom  : 20,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 16 }}>📌</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Pinned Announcements
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pinnedNotices.map((n) => (
              <div
                key={n.id}
                onClick={() => setViewNotice(n)}
                style={{
                  display        : 'flex', justifyContent: 'space-between',
                  alignItems     : 'center',
                  background     : 'rgba(255,255,255,0.12)',
                  borderRadius   : 8, padding: '10px 14px',
                  cursor         : 'pointer',
                  transition     : 'background 0.15s',
                  border         : '1px solid rgba(255,255,255,0.1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>
                    {CATEGORIES.find((c) => c.value === n.category)?.label?.split(' ')[0] || '📋'}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>
                    {n.title}
                  </span>
                  {n.isUrgent && (
                    <span style={{
                      background: '#ef4444', color: 'white',
                      fontSize: 10, fontWeight: 800,
                      padding: '2px 7px', borderRadius: 10,
                    }}>
                      URGENT
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: '#93c5fd', whiteSpace: 'nowrap' }}>
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short',
                      })
                    : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
        gap: 14, marginBottom: 24,
      }}>
        {[
          { label: 'Total Notices', value: pagination.total,                                                                icon: '📢', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Published',     value: notices.filter((n) => n.status === 'published').length,                         icon: '✅', color: '#16a34a', bg: '#dcfce7' },
          { label: 'Pinned',        value: pinnedNotices.length,                                                            icon: '📌', color: '#d97706', bg: '#fef9c3' },
          { label: 'Urgent',        value: notices.filter((n) => n.isUrgent).length,                                       icon: '🚨', color: '#dc2626', bg: '#fee2e2' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 10,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 9,
              background: bg, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20,
        borderBottom: '2px solid #f1f5f9',
        overflowX: 'auto',
      }}>
        {[
          { key: 'all',       label: '🌐 All'       },
          { key: 'published', label: '✅ Published'  },
          { key: 'pinned',    label: '📌 Pinned'     },
          ...(isPrincipalOrTeacher
            ? [
                { key: 'draft', label: '📝 Drafts' },
                { key: 'my',    label: '👤 My Notices' },
              ]
            : []),
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
              background: 'none', fontWeight: activeTab === key ? 700 : 500,
              color: activeTab === key ? '#2563eb' : '#64748b',
              borderBottom: activeTab === key
                ? '2px solid #2563eb' : '2px solid transparent',
              fontSize: 14, marginBottom: -2, whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Search & Filters ── */}
      <div style={{
        background: 'white', borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: 16, marginBottom: 20,
      }}>
        <SearchBox
          placeholder="Search notices by title, content..."
          value={search}
          onChange={setSearch}
          onSearch={() => fetchNotices(1)}
          onClear={() => { setSearch(''); fetchNotices(1); }}
          filters={[
            {
              name   : 'category',
              label  : 'Category',
              options: CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
            },
            {
              name   : 'audience',
              label  : 'Audience',
              options: [
                { value: 'all',       label: 'Everyone'   },
                { value: 'teachers',  label: 'Teachers'   },
                { value: 'students',  label: 'Students'   },
                { value: 'parents',   label: 'Parents'    },
                { value: 'principal', label: 'Principal'  },
              ],
            },
          ]}
          filterValues={{ category: filterCategory, audience: filterAudience }}
          onFilterChange={(name, val) => {
            if (name === 'category') setFilterCategory(val);
            if (name === 'audience') setFilterAudience(val);
          }}
        />
      </div>

      {/* ── Notice Cards Grid ── */}
      {loading ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <Loading type="skeleton" rows={6} text="" />
        </div>
      ) : notices.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          padding: 60, textAlign: 'center', color: '#94a3b8',
        }}>
          <div style={{ fontSize: 56, marginBottom: 14, opacity: 0.4 }}>📢</div>
          <p style={{ fontWeight: 600, fontSize: 16, margin: '0 0 6px', color: '#64748b' }}>
            No notices found
          </p>
          <p style={{ fontSize: 14, margin: '0 0 20px' }}>
            {activeTab === 'draft'
              ? 'No draft notices at the moment.'
              : activeTab === 'pinned'
              ? 'No pinned notices.'
              : 'No notices match your filters.'}
          </p>
          {isPrincipalOrTeacher && (
            <Button onClick={() => { setEditNotice(null); setShowForm(true); }}>
              + Create First Notice
            </Button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))',
          gap: 20,
        }}>
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              userRole={userRole}
              onView={() => setViewNotice(notice)}
              onEdit={() => { setEditNotice(notice); setShowForm(true); }}
              onDelete={() => setDeleteConfirm(notice)}
              onTogglePin={() => handleTogglePin(notice)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && pagination.pages > 1 && (
        <div style={{ marginTop: 24 }}>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={(p) => fetchNotices(p)}
          />
        </div>
      )}

      {/* ── View Modal ── */}
      {viewNotice && (
        <NoticeViewModal
          notice={viewNotice}
          userRole={userRole}
          onClose={() => setViewNotice(null)}
          onEdit={() => { setViewNotice(null); setEditNotice(viewNotice); setShowForm(true); }}
          onDelete={() => { setViewNotice(null); setDeleteConfirm(viewNotice); }}
          onTogglePin={() => { handleTogglePin(viewNotice); setViewNotice(null); }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 16,
        }}>
          <div style={{
            background: 'white', borderRadius: 14, padding: 36,
            maxWidth: 420, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ textAlign: 'center', margin: '0 0 10px', fontSize: 18 }}>
              Delete Notice?
            </h3>
            <p style={{
              textAlign: 'center', color: '#64748b',
              fontSize: 14, marginBottom: 28, lineHeight: 1.6,
            }}>
              Are you sure you want to delete{' '}
              <strong>"{deleteConfirm.title}"</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} loading={deleting}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Notice View Modal ──────────────────────────────────── */
const NoticeViewModal = ({
  notice, userRole, onClose, onEdit, onDelete, onTogglePin,
}) => {
  const isPrincipalOrTeacher = ['principal', 'teacher'].includes(userRole);

  const categoryMap = {
    general    : { icon: '📋', color: '#475569', bg: '#f1f5f9' },
    academic   : { icon: '📚', color: '#1d4ed8', bg: '#dbeafe' },
    exam       : { icon: '📖', color: '#5b21b6', bg: '#ede9fe' },
    holiday    : { icon: '🎉', color: '#166534', bg: '#dcfce7' },
    event      : { icon: '🎭', color: '#0e7490', bg: '#cffafe' },
    fee        : { icon: '💰', color: '#854d0e', bg: '#fef9c3' },
    sports     : { icon: '⚽', color: '#166534', bg: '#dcfce7' },
    emergency  : { icon: '🚨', color: '#991b1b', bg: '#fee2e2' },
    circular   : { icon: '📄', color: '#0284c7', bg: '#e0f2fe' },
  };
  const cat = categoryMap[notice.category] || categoryMap.general;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16, backdropFilter: 'blur(3px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 14,
          maxWidth: 660, width: '100%',
          maxHeight: '88vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '20px 24px',
          background: cat.bg,
          borderRadius: '14px 14px 0 0',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: 'white', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                {cat.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                    {notice.title}
                  </h3>
                  {notice.isUrgent && (
                    <span style={{
                      background: '#ef4444', color: 'white',
                      fontSize: 10, fontWeight: 800,
                      padding: '2px 8px', borderRadius: 10,
                    }}>
                      URGENT
                    </span>
                  )}
                  {notice.isPinned && (
                    <span style={{
                      background: '#fef9c3', color: '#854d0e',
                      fontSize: 10, fontWeight: 800,
                      padding: '2px 8px', borderRadius: 10,
                    }}>
                      📌 PINNED
                    </span>
                  )}
                </div>
                <div style={{
                  display: 'flex', gap: 12, marginTop: 6,
                  fontSize: 12, color: '#64748b', flexWrap: 'wrap',
                }}>
                  <span style={{
                    background: cat.bg, color: cat.color,
                    padding: '2px 8px', borderRadius: 10,
                    fontWeight: 600, border: `1px solid ${cat.color}30`,
                    textTransform: 'capitalize',
                  }}>
                    {notice.category || 'General'}
                  </span>
                  <span>👤 {notice.authorName || notice.author?.name || 'Staff'}</span>
                  <span>📅 {notice.createdAt
                    ? new Date(notice.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })
                    : '—'}</span>
                  {notice.audience && (
                    <span>👥 For: {notice.audience}</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(0,0,0,0.08)', border: 'none',
                width: 32, height: 32, borderRadius: 8,
                cursor: 'pointer', fontSize: 18, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Expiry warning */}
          {notice.expiryDate && new Date(notice.expiryDate) < new Date() && (
            <div style={{
              background: '#fff7ed', border: '1px solid #fed7aa',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              fontSize: 13, color: '#9a3412', display: 'flex', gap: 8,
            }}>
              ⚠️ This notice expired on{' '}
              {new Date(notice.expiryDate).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </div>
          )}

          {/* Content */}
          <div style={{
            fontSize: 15, color: '#374151',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}>
            {notice.content || notice.description || 'No content provided.'}
          </div>

          {/* Attachments */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#374151' }}>
                📎 Attachments ({notice.attachments.length})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {notice.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url || att}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '8px 14px',
                      background: '#f8fafc', border: '1px solid #e2e8f0',
                      borderRadius: 8, fontSize: 13, color: '#2563eb',
                      textDecoration: 'none', fontWeight: 600,
                    }}
                  >
                    📄 {att.name || att.filename || `Attachment ${i + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal footer */}
        {isPrincipalOrTeacher && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #f1f5f9',
            display: 'flex', gap: 10, justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}>
            <Button
              variant="outline"
              size="sm"
              onClick={onTogglePin}
            >
              {notice.isPinned ? '📌 Unpin' : '📌 Pin'}
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              ✏️ Edit
            </Button>
            <Button variant="danger" size="sm" onClick={onDelete}>
              🗑️ Delete
            </Button>
          </div>
        )}
      </div>
      <style>{`@keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>
    </div>
  );
};

export default NoticeList;
