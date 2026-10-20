import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import NotificationCenter from './NotificationCenter';
import CountdownRing from './CountdownRing';
import { formatRemaining } from '../utils/time';
import Modal from './Modal';
import { useToast } from './Toast';

const PRIORITY = {
  high: { label: 'عاجلة', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: '🔴' },
  medium: { label: 'مهمة', color: '#B45309', bg: '#FEF3C7', border: '#FDE68A', icon: '🟡' },
  low: { label: 'عادية', color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0', icon: '🟢' },
};

const UserDashboard = ({ userId }) => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);
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
    return () => { clearTimeout(timer); controller.abort(); };
  }, [userId, loadUserTasks]);

  const setDone = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/user/tasks/${task._id}/complete`);
      toast.success(`أحسنت! تم إنجاز "${task.title}" بنجاح`, 'المهمة مكتملة');
      loadUserTasks((userId || '').trim());
    } catch (e) {
      toast.error('حدث خطأ أثناء تحديث المهمة', 'خطأ');
    }
  };

  const stats = {
    total: items.length,
    done: items.filter(t => t.status === 'completed').length,
    late: items.filter(t => t.status === 'overdue').length,
    pending: items.filter(t => t.status === 'pending').length,
  };

  return (
    <div style={{ textAlign: 'right', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '16px', border: '1px solid #E2E8F0', borderRight: '5px solid #C5A059', boxShadow: '0 4px 16px rgba(10,37,64,0.04)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0A2540', fontWeight: '800' }}>مرحباً بك، ({userId})</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>البوابة الإلكترونية الموحدة للموظفين والمعنيين</p>
        </div>
        <NotificationCenter userId={userId} />
      </div>

      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'إجمالي التكليفات', value: stats.total, color: '#0A2540', bg: '#F8FAFC', icon: '📋' },
            { label: 'قيد الانتظار', value: stats.pending, color: '#B45309', bg: '#FEF3C7', icon: '⏳' },
            { label: 'مكتملة', value: stats.done, color: '#15803D', bg: '#F0FDF4', icon: '✅' },
            { label: 'متأخرة', value: stats.late, color: '#991B1B', bg: '#FEF2F2', icon: '🚨' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)', animation: `rowEnter 0.4s ease ${i * 0.06}s both` }}>
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ fontSize: '16px', color: '#0A2540', marginBottom: '16px' }}>قائمة التكليفات المسندة:</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {items.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 20px', color: '#64748B', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px dashed #E2E8F0' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px', animation: 'floatY 3s ease-in-out infinite' }}>📭</div>
            <p style={{ margin: 0, fontSize: '14px' }}>{loading ? 'جارٍ التحميل...' : 'لا توجد تكليفات مسندة إليك حالياً.'}</p>
          </div>
        ) : (
          items.map((task, idx) => {
            const isDone = task.status === 'completed';
            const isLate = task.status === 'overdue';
            const pr = PRIORITY[task.priority] || PRIORITY.medium;

            return (
              <div
                key={task._id}
                style={{
                  backgroundColor: '#FFFFFF', borderRadius: '16px',
                  border: `1px solid ${isLate ? '#FECACA' : '#E2E8F0'}`,
                  borderRight: `4px solid ${isLate ? '#DC2626' : pr.color}`,
                  padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(10,37,64,0.04)',
                  animation: `rowEnter 0.4s ease ${idx * 0.07}s both`,
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                      backgroundColor: isDone ? '#F0FDF4' : isLate ? '#FEF2F2' : '#FEF3C7',
                      color: isDone ? '#166534' : isLate ? '#991B1B' : '#92400E',
                      border: `1px solid ${isDone ? '#BBF7D0' : isLate ? '#FECACA' : '#FDE68A'}`
                    }}>
                      {isDone ? 'مكتملة ✅' : isLate ? 'متأخرة ⚠️' : 'قيد الانتظار ⏳'}
                    </span>
                    {!isDone && (
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', backgroundColor: pr.bg, color: pr.color, border: `1px solid ${pr.border}` }}>
                        {pr.icon} {pr.label}
                      </span>
                    )}
                  </div>

                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0A2540' }}>{task.title}</h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{task.description || 'لا يوجد تفاصيل إضافية'}</p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <CountdownRing deadline={task.deadline} createdAt={task.createdAt} status={task.status} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>🗓️ الموعد النهائي</div>
                      <div style={{ fontSize: '12px', color: '#0A2540', fontWeight: '600' }}>
                        {new Date(task.deadline).toLocaleString('ar-SA')}
                      </div>
                      {!isDone && !isLate && formatRemaining(task.deadline) && (
                        <div style={{
                          marginTop: '8px', fontSize: '12px', fontWeight: '800',
                          color: pr.color, backgroundColor: pr.bg, border: `1px solid ${pr.border}`,
                          borderRadius: '8px', padding: '5px 8px', display: 'inline-block'
                        }}>
                          ⏳ {formatRemaining(task.deadline)} لتسليمه
                        </div>
                      )}
                      {isLate && (
                        <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: '800', color: '#991B1B', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '5px 8px', display: 'inline-block' }}>
                          ⏰ انتهت المهلة — يرجى التسليم فوراً
                        </div>
                      )}
                    </div>
                  </div>

                  {!isDone && (
                    <button
                      onClick={() => setConfirm(task)}
                      style={{ width: '100%', backgroundColor: '#16A34A', color: '#FFFFFF', border: 'none', padding: '11px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}
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

      <Modal
        open={!!confirm}
        type="confirm"
        title="تأكيد إنجاز المهمة"
        message={confirm ? `هل أنت متأكد من إنجاز المهمة "${confirm.title}"؟` : ''}
        confirmText="نعم، أنجزتها ✅"
        cancelText="ليس بعد"
        onCancel={() => setConfirm(null)}
        onConfirm={() => { setDone(confirm); setConfirm(null); }}
      />
    </div>
  );
};

export default UserDashboard;
