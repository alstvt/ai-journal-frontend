export default function TypingIndicator() {
  return (
    <div className="message message--ai">
      <div className="avatar">✦</div>
      <div className="bubble">
        <span className="bubble__label">AI Journal</span>
        <div className="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}