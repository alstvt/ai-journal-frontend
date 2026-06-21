const PROMPTS = [
  "Что сегодня вымотало больше всего?",
  "Что крутится в голове весь день?",
  "Чем сегодня можно гордиться?",
];

export default function EmptyState() {
  return (
    <div className="empty">
      <p className="empty__text">Что у тебя на уме сегодня?</p>
      <div className="empty__prompts">
        {PROMPTS.map((p) => (
          <p key={p} className="empty__prompt">{p}</p>
        ))}
      </div>
    </div>
  );
}