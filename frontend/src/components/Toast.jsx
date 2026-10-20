import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastCtx = createContext(null);

const ICONS = { success: '✅', error: '⛔', warning: '⚠️', info: 'ℹ️' };
const TITLES = { success: 'تم بنجاح', error: 'حدث خطأ', warning: 'تنبيه', info: 'معلومة' };

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
  }, []);

  const push = useCallback((type, message, title) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev.slice(-3), { id, type, message, title: title || TITLES[type] }]);
    setTimeout(() => remove(id), 4000);
    return id;
  }, [remove]);

  const api = {
    success: (m, t) => push('success', m, t),
    error: (m, t) => push('error', m, t),
    warning: (m, t) => push('warning', m, t),
    info: (m, t) => push('info', m, t),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type} ${t.leaving ? 'leaving' : ''}`}>
            <div className="toast-icon">{ICONS[t.type]}</div>
            <div className="toast-body">
              <div className="toast-title">{t.title}</div>
              <div className="toast-msg">{t.message}</div>
            </div>
            <button className="toast-close" onClick={() => remove(t.id)}>×</button>
            <div className="toast-bar" style={{ animationDuration: '4000ms' }} />
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
