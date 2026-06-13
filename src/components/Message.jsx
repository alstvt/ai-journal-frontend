import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function Message({ role, content }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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