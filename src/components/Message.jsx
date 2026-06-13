export default function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`message ${isUser ? "message--user" : "message--ai"}`}>
      {!isUser && <div className="avatar">✦</div>}
      <div className="bubble">
        {!isUser && <span className="bubble__label">AI Journal</span>}
        <p className="bubble__text">{content}</p>
      </div>
    </div>
  );
}