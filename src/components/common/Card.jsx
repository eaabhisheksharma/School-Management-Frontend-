import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerRight,
  padding = '24px',
  style = {},
  bodyStyle = {},
  noBorder = false,
  hover = false,
}) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 10,
        boxShadow: noBorder ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
        border: noBorder ? 'none' : '1px solid #f1f5f9',
        overflow: 'hidden',
        transition: hover ? 'transform 0.2s, box-shadow 0.2s' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      } : undefined}
    >
      {/* Card Header */}
      {(title || headerRight) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderBottom: '1px solid #f1f5f9',
        }}>
          <div>
            {title && (
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      {/* Card Body */}
      <div style={{ padding, ...bodyStyle }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
