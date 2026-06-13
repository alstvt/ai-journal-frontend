import { ArrowUp } from "lucide-react";

export default function ChatInput({ value, onChange, onSend, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-row">
        <textarea
          className="textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напиши что-нибудь... (Enter чтобы отправить)"
          rows={3}
        />
        <button className="send-btn" onClick={onSend} disabled={loading}>
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      </div>
      <p className="hint">Shift + Enter для новой строки</p>
    </div>
  );
}