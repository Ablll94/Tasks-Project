import React, { useState, useEffect } from 'react';

const CountdownRing = ({ deadline, createdAt, status, size = 92 }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const end = new Date(deadline).getTime();
  const start = createdAt ? new Date(createdAt).getTime() : end - 24 * 60 * 60 * 1000;
  const total = Math.max(end - start, 1);
  const remaining = end - now;
  const pct = status === 'completed' ? 1 : Math.min(Math.max(remaining / total, 0), 1);

  const isDone = status === 'completed';
  const isOverdue = status === 'overdue' || (!isDone && remaining <= 0);

  let color = '#16A34A';
  if (isDone) color = '#16A34A';
  else if (isOverdue) color = '#DC2626';
  else if (pct < 0.25) color = '#DC2626';
  else if (pct < 0.5) color = '#F59E0B';

  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  const parts = () => {
    const diff = Math.max(remaining, 0);
    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const centerText = () => {
    if (isDone) return '✅';
    if (isOverdue) return 'انتهت';
    const { d, h, m, s } = parts();
    if (d > 0) return `${d}ي ${h}س`;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const subtitle = () => {
    if (isDone) return 'مكتملة ✅';
    if (isOverdue) return 'انتهت المهلة ⏰';
    return 'متبقي';
  };

  const urgent = !isDone && !isOverdue && pct < 0.25;
  const isLong = centerText().length > 6;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <style>{`
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.07); opacity: 0.85; }
        }
      `}</style>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={urgent ? { animation: 'ringPulse 1s ease-in-out infinite', transformOrigin: 'center' } : undefined}
      >
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E2E8F0" strokeWidth="9" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
        />
        <circle cx="50" cy="50" r="33" fill={isDone ? '#F0FDF4' : isOverdue ? '#FEF2F2' : '#F8FAFC'} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', lineHeight: 1.1,
        color: isDone ? '#166534' : isOverdue ? '#991B1B' : color, direction: 'ltr'
      }}>
        <span style={{ fontSize: isDone ? 22 : isLong ? 11 : 14, fontWeight: '800' }}>
          {centerText()}
        </span>
        <span style={{ fontSize: 8.5, color: '#94A3B8', marginTop: 2, fontWeight: '700', direction: 'rtl' }}>
          {subtitle()}
        </span>
      </div>
    </div>
  );
};

export default CountdownRing;
