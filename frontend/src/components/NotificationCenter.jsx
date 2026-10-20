import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const NotificationCenter = ({ userId }) => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const requestIdRef = useRef(0);

  const loadNotifs = useCallback(async (id, signal) => {
    const requestId = ++requestIdRef.current;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/notifications/${encodeURIComponent(id)}`, { signal });
      if (requestId !== requestIdRef.current) return;
      setData(res.data);
    } catch (e) {
      if (axios.isCancel(e) || e.code === 'ERR_CANCELED') return;
      if (requestId !== requestIdRef.current) return;
      console.log(e);
    }
  }, []);

  useEffect(() => {
    const trimmed = (userId || '').trim();
    if (!trimmed) {
      requestIdRef.current++;
      setData([]);
      return;
    }

    const controller = new AbortController();
    let interval = null;

    const timer = setTimeout(() => {
      loadNotifs(trimmed, controller.signal);
      interval = setInterval(() => loadNotifs(trimmed), 4000);
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
      if (interval) clearInterval(interval);
    };
  }, [userId, loadNotifs]);

  const markRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/user/notifications/${id}/read`);
      setData(prev => prev.filter(item => item._id !== id));
    } catch (e) {
      console.log(e);
    }
  };

  const getStyle = (type) => {
    switch (type) {
      case 'TASK_OVERDUE': return { bg: '#FEF2F2', border: '#DC2626', text: '#991B1B', icon: '🚨' };
      case 'TASK_COMPLETED': return { bg: '#F0FDF4', border: '#16A34A', text: '#166534', icon: '✅' };
      case 'NEW_TASK': return { bg: '#F0F9FF', border: '#0284C7', text: '#075985', icon: '📑' };
      default: return { bg: '#F8FAFC', border: '#C5A059', text: '#1E293B', icon: '🔔' };
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setShow(!show)}
        className={`notif-bell ${data.length > 0 ? 'ring' : ''}`}
        style={{
          background: '#FFFFFF',
          border: '1px solid #C5A059',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '16px',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#0A2540',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}
      >
        <span>🔔</span>
        <span>التنبيهات</span>
        {data.length > 0 && (
          <span style={{
            backgroundColor: '#C5A059',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            {data.length}
          </span>
        )}
      </button>

      {show && (
        <div className="notif-panel" style={{
          position: 'absolute',
          left: 0,
          top: '50px',
          width: '360px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(10, 37, 64, 0.15)',
          border: '1px solid #E2E8F0',
          zIndex: 1000,
          overflow: 'hidden',
          direction: 'rtl'
        }}>
          <div style={{ padding: '16px 20px', backgroundColor: '#0A2540', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#FFFFFF' }}>مركز التنبيهات الإدارية</h4>
            <span style={{ fontSize: '11px', color: '#0A2540', background: '#C5A059', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
              {data.length} جديد
            </span>
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
            {data.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748B' }}>
                <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px', animation: 'floatY 3s ease-in-out infinite' }}>📭</span>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>لا توجد تنبيهات جديدة</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>سيصلك إشعار فور وصول تكليف جديد</p>
              </div>
            ) : (
              data.map((item, idx) => {
                const st = getStyle(item.type);
                return (
                  <div 
                    key={item._id}
                    className="notif-item"
                    onClick={() => markRead(item._id)}
                    style={{
                      animationDelay: `${idx * 0.06}s`,
                      backgroundColor: st.bg,
                      borderRight: `4px solid ${st.border}`,
                      borderRadius: '8px',
                      padding: '12px 14px',
                      marginBottom: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{st.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', color: st.text, fontSize: '13px', fontWeight: '600', lineHeight: '1.4' }}>
                        {item.message}
                      </p>
                      <small style={{ color: '#64748B', fontSize: '10px' }}>
                        {new Date(item.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })} • انقر للإخفاء
                      </small>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;