export default function ConfirmDialog({ open, title, message, confirmLabel = "Да", cancelLabel = "Отмена", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-dialog__title">{title}</p>
        {message && <p className="confirm-dialog__message">{message}</p>}
        <div className="confirm-dialog__actions">
          <button className="confirm-dialog__cancel" onClick={onCancel}>{cancelLabel}</button>
          <button className="confirm-dialog__confirm" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}