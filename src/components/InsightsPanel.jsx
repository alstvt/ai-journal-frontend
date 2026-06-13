import { X, Trash2, Lightbulb } from "lucide-react";

export default function InsightsPanel({ insights, onClose, onDelete }) {
  return (
    <div className="insights-overlay" onClick={onClose}>
      <div className="insights-panel" onClick={(e) => e.stopPropagation()}>
        <div className="insights-panel__header">
          <h2 className="insights-panel__title">
            <Lightbulb size={16} /> Мои инсайты
          </h2>
          <button className="insights-panel__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {insights.length === 0 ? (
          <div className="insights-empty">
            <Lightbulb size={24} />
            <p>Здесь будут появляться сохранённые наблюдения из твоих сессий</p>
          </div>
        ) : (
          <div className="insights-list">
            {insights.map((item) => (
              <div key={item.id} className="insight-item">
                <div className="insight-item__top">
                  <span className="insight-item__date">
                    {new Date(item.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <button
                    className="insight-item__delete"
                    onClick={() => onDelete(item.id)}
                    title="Удалить"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="insight-item__text">{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}