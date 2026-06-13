import { useState, useRef } from "react";
import { Copy, Check, Lightbulb, Bookmark, BookmarkCheck } from "lucide-react";

const INSIGHT_KEYWORDS = [
  /заметил/i,
  /бросилось в глаза/i,
  /повторя/i,
  /не первый раз/i,
  /похож[аиеу]й шаблон/i,
  /шаблон в твоей/i,
  /паттерн/i,
  /закономерность/i,
];

const isInsight = (content) =>
  INSIGHT_KEYWORDS.some((pattern) => pattern.test(content));

export default function Message({ role, content, savedInsights = [], onToggleSave }) {
  const isUser = role === "user";
  const insight = !isUser && isInsight(content);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  if (insight) {
    const isSaved = savedInsights.some((i) => i.content === content);

    return (
      <div className="message message--ai">
        <div className="avatar avatar--insight">
          <Lightbulb size={14} />
        </div>
        <div className="bubble-wrap">
          <div className="insight-card" ref={cardRef} onMouseMove={handleMouseMove}>
            <div className="insight-card__shimmer" />
            <div className="insight-card__glow" />
            <div className="insight-card__header">
              <span className="insight-card__label">
                <Lightbulb size={12} /> Инсайт
              </span>
              <button
                className={`save-btn ${isSaved ? "save-btn--active" : ""}`}
                onClick={() => onToggleSave(content)}
                title={isSaved ? "Убрать из сохранённых" : "Сохранить инсайт"}
              >
                {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              </button>
            </div>
            <p className="bubble__text">{content}</p>
          </div>
          <button className="copy-btn" onClick={handleCopy} title="Копировать">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`message ${isUser ? "message--user" : "message--ai"}`}>
      {!isUser && <div className="avatar">✦</div>}
      <div className="bubble-wrap">
        <div className="bubble">
          {!isUser && <span className="bubble__label">AI Journal</span>}
          <p className="bubble__text">{content}</p>
        </div>
        {!isUser && (
          <button className="copy-btn" onClick={handleCopy} title="Копировать">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}