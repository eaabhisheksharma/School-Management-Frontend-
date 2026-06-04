import React from 'react';

const StatCard = ({
  title,
  value,
  icon,
  color   = 'blue',   // blue | green | orange | red | purple | teal
  trend,              // { value: '+12%', direction: 'up' | 'down' }
  subtitle,
  onClick,
}) => {
  const colorMap = {
    blue  : { bg: '#eff6ff',  color: '#2563eb', light: '#dbeafe' },
    green : { bg: '#f0fdf4',  color: '#16a34a', light: '#bbf7d0' },
    orange: { bg: '#fff7ed',  color: '#ea580c', light: '#fed7aa' },
    red   : { bg: '#fff1f2',  color: '#e11d48', light: '#fecdd3' },
    purple: { bg: '#faf5ff',  color: '#9333ea', light: '#e9d5ff' },
    teal  : { bg: '#f0fdfa',  color: '#0d9488', light: '#99f6e4' },
    yellow: { bg: '#fefce8',  color: '#ca8a04', light: '#fef08a' },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: 12,
        padding: '20px 22px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid #f1f5f9',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
      onMouseEnter={onClick ? (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      } : undefined}
    >
      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: scheme.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: scheme.color, lineHeight: 1.1 }}>
          {value ?? '—'}
        </div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 3, fontWeight: 500 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            {subtitle}
          </div>
        )}
        {trend && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            marginTop: 6, fontSize: 12, fontWeight: 600,
            color: trend.direction === 'up' ? '#16a34a' : '#dc2626',
          }}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
