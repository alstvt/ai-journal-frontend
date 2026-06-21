import { X, Trash2, MessageCircle } from "lucide-react";

const STYLE_LABELS = {
  friend: "Друг",
  stoic: "Стоик",
  direct: "Прямой",
};

function getPreview(messages) {
  const firstUserMsg = messages.find((m) => m.role === "user");
  if (!firstUserMsg) return "Пустой разговор";
  return firstUserMsg.content.length > 60
    ? firstUserMsg.content.slice(0, 60) + "…"
    : firstUserMsg.content;
}

export default function HistoryPanel({ sessions, onClose, onOpen, onDelete }) {
  return (
    <div className="insights-overlay" onClick={onClose}>
      <div className="insights-panel" onClick={(e) => e.stopPropagation()}>
        <div className="insights-panel__header">
          <h2 className="insights-panel__title" style={{ color: "var(--text)" }}>
            <MessageCircle size={16} /> История
          </h2>
          <button className="insights-panel__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="insights-empty">
            <MessageCircle size={24} />
            <p>Здесь появятся твои прошлые разговоры</p>
          </div>
        ) : (
          <div className="insights-list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="insight-item history-item"
                onClick={() => onOpen(session)}
              >
                <div className="insight-item__top">
                  <span className="insight-item__date">
                    {new Date(session.updated_at).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                    })}
                    {" · "}
                    {STYLE_LABELS[session.style] || session.style}
                  </span>
                  <button
                    className="insight-item__delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(session.id);
                    }}
                    title="Удалить"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="insight-item__text">
                  {session.title || getPreview(session.messages)}
                </p>
                <span className="history-item__count">
                  {session.messages.length} сообщ.
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}