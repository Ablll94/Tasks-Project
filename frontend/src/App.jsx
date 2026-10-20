import React, { useState } from 'react';
import { AdminPage, UserPage } from './pages/Pages';

function App() {
  const [role, setRole] = useState('admin');

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'Tahoma, Arial, sans-serif', direction: 'rtl', color: '#0F172A' }}>
      
      <header style={{ backgroundColor: '#0A2540', borderBottom: '4px solid #C5A059', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#C5A059', color: '#0A2540', width: '45px', height: '45px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px' }}>
            🏛️
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>غرفة المدينة المنورة - Madinah Chamber</h1>
            <small style={{ color: '#C5A059', fontSize: '12px' }}>نظام إسناد المهام والتنبيهات المباشرة</small>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
          <button 
            onClick={() => setRole('admin')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: role === 'admin' ? '#C5A059' : 'transparent',
              color: role === 'admin' ? '#0A2540' : '#FFFFFF',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🛡️ الأدمن
          </button>
          <button 
            onClick={() => setRole('user')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: role === 'user' ? '#C5A059' : 'transparent',
              color: role === 'user' ? '#0A2540' : '#FFFFFF',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            👤 المستخدم
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px' }}>
        {role === 'admin' ? <AdminPage /> : <UserPage />}
      </main>
    </div>
  );
}

export default App;