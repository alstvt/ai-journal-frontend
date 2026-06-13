const PROMPTS = [
  "Сегодня я чувствую...",
  "Меня беспокоит...",
  "Никак не могу понять почему...",
];

export default function EmptyState({ onPick }) {
  return (
    <div className="empty">
      <div className="empty__icon">✦</div>
      <p className="empty__text">Начни с любой мысли или события за сегодня</p>
      <div className="empty__prompts">
        {PROMPTS.map((p) => (
          <button key={p} className="chip" onClick={() => onPick(p)}>{p}</button>
        ))}
      </div>
    </div>
  );
}