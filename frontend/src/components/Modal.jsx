import React, { useEffect } from 'react';

const ICONS = { success: '🎉', error: '💔', warning: '⚠️', info: '💡', confirm: '❓' };

const Modal = ({
  open,
  type = 'info',
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  onConfirm,
  onCancel,
  showCancel = true,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onCancel && onCancel(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass =
    type === 'error' || type === 'confirm-danger' ? 'modal-btn-danger'
    : type === 'warning' ? 'modal-btn-gold'
    : 'modal-btn-primary';

  return (
    <div className="modal-backdrop" onClick={() => onCancel && onCancel()}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={`modal-icon ${type === 'confirm-danger' ? 'error' : type}`}>
          {ICONS[type] || ICONS.info}
        </div>
        <h3 className="modal-title">{title}</h3>
        {message && <p className="modal-msg">{message}</p>}
        <div className="modal-actions">
          {showCancel && (
            <button className="modal-btn modal-btn-ghost" onClick={() => onCancel && onCancel()}>
              {cancelText}
            </button>
          )}
          <button className={`modal-btn ${confirmClass}`} onClick={() => onConfirm && onConfirm()}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
