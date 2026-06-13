import { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const MAX_LENGTH = 1000;

export default function ChatInput({ value, onChange, onSend, loading, inputRef }) {
  const localRef = useRef(null);
  const textareaRef = inputRef || localRef;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const isNearLimit = value.length > MAX_LENGTH * 0.85;
  const isOverLimit = value.length > MAX_LENGTH;

  return (
    <div className="input-area">
      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="textarea"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="Напиши что-нибудь... (Enter чтобы отправить)"
          rows={1}
        />
        <button className="send-btn" onClick={onSend} disabled={loading || !value.trim()}>
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      </div>
      <div className="input-footer">
        <span className="hint">Shift + Enter для новой строки</span>
        {isNearLimit && (
          <span className={`char-count ${isOverLimit ? "char-count--limit" : ""}`}>
            {value.length} / {MAX_LENGTH}
          </span>
        )}
      </div>
    </div>
  );
}