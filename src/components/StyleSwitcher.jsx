import { useRef, useEffect, useState } from "react";

const STYLES = [
  { id: "friend", label: "Друг", hint: "тепло и поддержка" },
  { id: "stoic", label: "Стоик", hint: "спокойствие и ясность" },
  { id: "direct", label: "Прямой", hint: "без смягчений" },
];

export default function StyleSwitcher({ value, onChange }) {
  const containerRef = useRef(null);
  const tabRefs = useRef([]);
  const [thumbStyle, setThumbStyle] = useState({});

  useEffect(() => {
    const activeIndex = STYLES.findIndex((s) => s.id === value);
    const tabEl = tabRefs.current[activeIndex];
    const containerEl = containerRef.current;
    if (!tabEl || !containerEl) return;

    const containerRect = containerEl.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();

    setThumbStyle({
      width: `${tabRect.width}px`,
      transform: `translateX(${tabRect.left - containerRect.left}px)`,
    });
  }, [value]);

  return (
    <div className="style-switcher" ref={containerRef}>
      <div className="style-switcher__thumb" style={thumbStyle} />
      {STYLES.map((s, i) => (
        <button
          key={s.id}
          ref={(el) => (tabRefs.current[i] = el)}
          className={`style-switcher__tab ${value === s.id ? "style-switcher__tab--active" : ""}`}
          onClick={() => onChange(s.id)}
          title={s.hint}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}