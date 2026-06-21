const STYLES = [
  { id: "friend", label: "Друг", hint: "тепло и поддержка" },
  { id: "stoic", label: "Стоик", hint: "спокойствие и ясность" },
  { id: "direct", label: "Прямой", hint: "без смягчений" },
];

export default function StyleSwitcher({ value, onChange }) {
  return (
    <div className="style-pills">
      <span className="style-pills__label">Тон:</span>
      {STYLES.map((s) => (
        <button
          key={s.id}
          className={`style-pills__item ${value === s.id ? "style-pills__item--active" : ""}`}
          onClick={() => onChange(s.id)}
          title={s.hint}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}