import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from './Toast';

const AdminDashboard = () => {
  const toast = useToast();
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium' });
  const [infoForm, setInfoForm] = useState({ userId: '', message: '' });
  const [busy, setBusy] = useState(false);

  const submitTask = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await axios.post('http://localhost:5000/api/admin/tasks', taskForm);
      toast.success(`تم إسناد "${taskForm.title}" وإشعار الموظف`, 'إسناد المهمة');
      setTaskForm({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium' });
    } catch (err) {
      toast.error('تعذر إسناد المهمة، تأكد من تشغيل الخادم', 'خطأ في الإرسال');
    } finally {
      setBusy(false);
    }
  };

  const submitInfo = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await axios.post('http://localhost:5000/api/admin/notifications/info', infoForm);
      toast.success('وصل التعميم إلى الموظف بنجاح', 'إرسال التعميم');
      setInfoForm({ userId: '', message: '' });
    } catch (err) {
      toast.error('تعذر إرسال التعميم', 'خطأ في الإرسال');
    } finally {
      setBusy(false);
    }
  };

  const checkLateTasks = async () => {
    setBusy(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/check-overdue');
      const n = (res.data.message.match(/\d+/) || [0])[0];
      if (Number(n) > 0) toast.warning(res.data.message, 'فحص التكليفات');
      else toast.info('لا توجد تكليفات متأخرة حالياً', 'فحص التكليفات');
    } catch (err) {
      toast.error('تعذر فحص التكليفات', 'خطأ');
    } finally {
      setBusy(false);
    }
  };

  const fieldStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    marginTop: '6px',
    marginBottom: '14px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s, box-shadow 0.2s'
  };

  const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#1E293B' };

  return (
    <div style={{ textAlign: 'right', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #C5A059', paddingBottom: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#0A2540', fontWeight: '800' }}>لوحة التحكم للإدارة واللجان</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>إصدار التكليفات ومتابعة التنبيهات المباشرة لفريق العمل</p>
        </div>
        <button
          onClick={checkLateTasks}
          disabled={busy}
          style={{
            backgroundColor: busy ? '#94A3B8' : '#DC2626',
            color: '#FFFFFF', border: 'none', padding: '10px 18px',
            borderRadius: '8px', cursor: busy ? 'not-allowed' : 'pointer',
            fontWeight: '600', fontSize: '13px', transition: 'all 0.2s'
          }}
        >
          ⏱️ فحص التكليفات المتأخرة
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(10,37,64,0.04)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0A2540', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>📌 إسناد مهمة جديدة</h3>
          <form onSubmit={submitTask}>
            <label style={labelStyle}>عنوان المهمة</label>
            <input placeholder="مثال: مراجعة ملف اللجان الإدارية" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required style={fieldStyle} />

            <label style={labelStyle}>الموظف المكلف (ID)</label>
            <input placeholder="user1" value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })} required style={fieldStyle} />

            <label style={labelStyle}>الأولوية</label>
            <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} style={fieldStyle}>
              <option value="low">🟢 عادية</option>
              <option value="medium">🟡 مهمة</option>
              <option value="high">🔴 عاجلة</option>
            </select>

            <label style={labelStyle}>الموعد النهائي (Deadline)</label>
            <input type="datetime-local" value={taskForm.deadline} onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })} required style={fieldStyle} />

            <button type="submit" disabled={busy} style={{ width: '100%', backgroundColor: busy ? '#94A3B8' : '#0A2540', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '10px', cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
              {busy ? 'جارٍ الإرسال...' : 'إسناد المهمة وإشعار الموظف'}
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(10,37,64,0.04)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0A2540', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>📢 إرسال تعميم / إشعار عام</h3>
          <form onSubmit={submitInfo}>
            <label style={labelStyle}>الموظف المستهدف (ID)</label>
            <input placeholder="user1" value={infoForm.userId} onChange={e => setInfoForm({ ...infoForm, userId: e.target.value })} required style={fieldStyle} />

            <label style={labelStyle}>نص التعميم الإداري</label>
            <textarea placeholder="يرجى الاطلاع على المواعيد الجديدة لغرفة المدينة المنورة..." value={infoForm.message} onChange={e => setInfoForm({ ...infoForm, message: e.target.value })} required style={{ ...fieldStyle, height: '110px', resize: 'none' }} />

            <button type="submit" disabled={busy} style={{ width: '100%', backgroundColor: busy ? '#D9CBAC' : '#C5A059', color: '#0A2540', border: 'none', padding: '12px', borderRadius: '10px', cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
              {busy ? 'جارٍ الإرسال...' : 'إرسال التعميم الإداري'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
