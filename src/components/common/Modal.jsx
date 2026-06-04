import React, { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',        // sm | md | lg | xl | full
  showFooter = false,
  footerContent,
  closeOnBackdrop = true,
}) => {
  const sizeMap = {
    sm  : '420px',
    md  : '600px',
    lg  : '800px',
    xl  : '1000px',
    full: '95vw',
  };

  /* ─── close on Escape key ─────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* ─── prevent body scroll when open ──────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={closeOnBackdrop ? onClose : undefined}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 16,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 12,
          width: '100%',
          maxWidth: sizeMap[size],
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
          flexShrink: 0,
        }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9', border: 'none', width: 32, height: 32,
              borderRadius: 8, cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {showFooter && footerContent && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'flex-end', gap: 10,
            flexShrink: 0,
          }}>
            {footerContent}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 }
                             to   { transform: translateY(0);    opacity: 1 } }
      `}</style>
    </div>
  );
};

export default Modal;
