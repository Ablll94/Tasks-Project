import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', deadline: '' });
  const [infoForm, setInfoForm] = useState({ userId: '', message: '' });

  const submitTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/tasks', taskForm);
      alert('تم إسناد المهمة وإرسال التنبيه بنجاح');
      setTaskForm({ title: '', description: '', assignedTo: '', deadline: '' });
    } catch (e) {
      alert('حدث خطأ أثناء الإرسال');
    }
  };

  const submitInfo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/notifications/info', infoForm);
      alert('تم إرسال الإشعار العام');
      setInfoForm({ userId: '', message: '' });
    } catch (e) {
      alert('حدث خطأ في الإرسال');
    }
  };

  const checkLateTasks = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/check-overdue');
      alert(res.data.message);
    } catch (e) {
      alert('خطأ أثناء فحص المهمات');
    }
  };

  const fieldStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    marginTop: '6px',
    marginBottom: '14px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ textAlign: 'right', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #C5A059', paddingBottom: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#0A2540', fontWeight: '800' }}>لوحة التحكم للإدارة واللجان</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>إصدار التكليفات ومتابعة التنبيهات المباشرة لفريق العمل</p>
        </div>
        <button 
          onClick={checkLateTasks}
          style={{ backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
        >
          ⏱️ فحص التكليفات المتأخرة
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0A2540', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>📌 إسناد مهمة جديدة</h3>
          <form onSubmit={submitTask}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>عنوان المهمة</label>
            <input placeholder="مثال: مراجعة ملف اللجان الإدارية" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} required style={fieldStyle} />
            
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>الموظف المكلف (ID)</label>
            <input placeholder="user1" value={taskForm.assignedTo} onChange={e => setTaskForm({...taskForm, assignedTo: e.target.value})} required style={fieldStyle} />
            
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>الموعد النهائي (Deadline)</label>
            <input type="datetime-local" value={taskForm.deadline} onChange={e => setTaskForm({...taskForm, deadline: e.target.value})} required style={fieldStyle} />
            
            <button type="submit" style={{ width: '100%', backgroundColor: '#0A2540', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              إسناد المهمة وإشعار الموظف
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0A2540', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>📢 إرسال تعميم / إشعار عام</h3>
          <form onSubmit={submitInfo}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>الموظف المستهدف (ID)</label>
            <input placeholder="user1" value={infoForm.userId} onChange={e => setInfoForm({...infoForm, userId: e.target.value})} required style={fieldStyle} />
            
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>نص التعميم الإداري</label>
            <textarea placeholder="يرجى الاطلاع على المواعيد الجديدة لغرفة المدينة المنورة..." value={infoForm.message} onChange={e => setInfoForm({...infoForm, message: e.target.value})} required style={{ ...fieldStyle, height: '110px', resize: 'none' }} />
            
            <button type="submit" style={{ width: '100%', backgroundColor: '#C5A059', color: '#0A2540', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              إرسال التعميم الإداري
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
