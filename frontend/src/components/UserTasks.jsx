import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import NotificationCenter from './NotificationCenter';

const UserDashboard = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  const loadUserTasks = useCallback(async (id, signal) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/user/tasks/${encodeURIComponent(id)}`, { signal });
      if (requestId !== requestIdRef.current) return;
      setItems(res.data);
    } catch (e) {
      if (axios.isCancel(e) || e.code === 'ERR_CANCELED') return;
      if (requestId !== requestIdRef.current) return;
      console.log(e);
      setItems([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const trimmed = (userId || '').trim();
    if (!trimmed) {
      requestIdRef.current++;
      setItems([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => loadUserTasks(trimmed, controller.signal), 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [userId, loadUserTasks]);

  const setDone = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/user/tasks/${id}/complete`);
      loadUserTasks((userId || '').trim());
    } catch (e) {
      alert('حدث خطأ أثناء التحديث');
    }
  };

  return (
    <div style={{ textAlign: 'right', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '12px', border: '1px solid #E2E8F0', borderRight: '5px solid #C5A059' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0A2540', fontWeight: '800' }}>مرحباً بك، ({userId})</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>البوابة الإلكترونية الموحدة للموظفين والمعنيين</p>
        </div>
        <NotificationCenter userId={userId} />
      </div>

      <h3 style={{ fontSize: '16px', color: '#0A2540', marginBottom: '16px' }}>قائمة التكليفات المسندة:</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {items.length === 0 ? (
          <p style={{ color: '#64748B', fontSize: '14px' }}>
            {loading ? 'جارٍ البحث...' : 'لا توجد تكليفات مسندة إليك حالياً.'}
          </p>
        ) : (
          items.map(task => {
            const isDone = task.status === 'completed';
            const isLate = task.status === 'overdue';

            return (
              <div 
                key={task._id} 
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: isDone ? '#F0FDF4' : isLate ? '#FEF2F2' : '#FEF3C7',
                      color: isDone ? '#166534' : isLate ? '#991B1B' : '#92400E',
                      border: `1px solid ${isDone ? '#BBF7D0' : isLate ? '#FECACA' : '#FDE68A'}`
                    }}>
                      {isDone ? 'مكتملة ✅' : isLate ? 'متأخرة ⚠️' : 'قيد الانتظار ⏳'}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0A2540' }}>{task.title}</h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{task.description || 'لا يوجد تفاصيل إضافية'}</p>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                    🗓️ الموعد النهائي: {new Date(task.deadline).toLocaleString('ar-SA')}
                  </div>

                  {!isDone && (
                    <button 
                      onClick={() => setDone(task._id)} 
                      style={{
                        width: '100%',
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px'
                      }}
                    >
                      تأكيد إنجاز المهمة ✅
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
