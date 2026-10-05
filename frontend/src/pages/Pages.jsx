import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import NotificationCenter from '../components/NotificationCenter';
import UserTasks from '../components/UserTasks';

const AdminPage = () => {
  return (
    <div className="page">
      <AdminDashboard />
    </div>
  );
};

const UserPage = () => {
  const [userId, setUserId] = useState('');
  const trimmedId = userId.trim();

  return (
    <div className="page user-page">
      <div className="user-header">
        <label>معرّف المستخدم:</label>
        <input
          placeholder="مثال: user123"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        {trimmedId && <NotificationCenter userId={trimmedId} />}
      </div>
      <UserTasks userId={trimmedId} />
    </div>
  );
};

export { AdminPage, UserPage };
