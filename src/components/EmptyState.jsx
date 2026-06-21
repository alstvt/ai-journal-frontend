import { Feather } from "lucide-react";

const PROMPTS = [
  "Сегодня я чувствую...",
  "Меня беспокоит...",
  "Никак не пойму, почему...",
];

export default function EmptyState({ onPick }) {
  return (
    <div className="empty">
      <Feather size={22} className="empty__icon" strokeWidth={1.5} />
      <p className="empty__text">С чего начнём сегодня?</p>
      <div className="empty__prompts">
        {PROMPTS.map((p) => (
          <button key={p} className="chip" onClick={() => onPick(p)}>{p}</button>
        ))}
      </div>
    </div>
  );
}