import { Lightbulb, History } from "lucide-react";

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatToday() {
  const now = new Date();
  return `${now.getDate()} ${MONTHS[now.getMonth()]}`;
}

export default function Header({ hasMessages, onReset, theme, onToggleTheme, insightsCount, onOpenInsights, onOpenHistory }) {
  return (
    <div className="header">
      <div>
        <h1 className="title">AI Journal</h1>
        <p className="subtitle">{formatToday()}</p>
      </div>
      <div className="header__actions">
        <div className="icon-pill">
          <button className="icon-pill__item" onClick={onOpenHistory} title="История">
            <History size={14} />
          </button>
          <button className="icon-pill__item icon-pill__item--badge" onClick={onOpenInsights} title="Мои инсайты">
            <Lightbulb size={14} />
            {insightsCount > 0 && <span className="insights-badge">{insightsCount}</span>}
          </button>
          <button className="icon-pill__item" onClick={onToggleTheme} title="Сменить тему">
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
        {hasMessages && (
          <button className="reset-btn" onClick={onReset}>Новая сессия</button>
        )}
      </div>
    </div>
  );
}