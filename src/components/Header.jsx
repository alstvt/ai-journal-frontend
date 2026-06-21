import { Lightbulb, History } from "lucide-react";

export default function Header({ hasMessages, onReset, theme, onToggleTheme, insightsCount, onOpenInsights, onOpenHistory }) {
  return (
    <div className="header">
      <div>
        <h1 className="title">AI Journal</h1>
        <p className="subtitle">Пространство для мыслей</p>
      </div>
      <div className="header__actions">
        <button className="icon-btn" onClick={onOpenHistory} title="История">
          <History size={15} />
        </button>
        <button className="insights-btn" onClick={onOpenInsights} title="Мои инсайты">
          <Lightbulb size={15} />
          {insightsCount > 0 && <span className="insights-badge">{insightsCount}</span>}
        </button>
        <button className="icon-btn" onClick={onToggleTheme} title="Сменить тему">
          {theme === "dark" ? "☀" : "☾"}
        </button>
        {hasMessages && (
          <button className="reset-btn" onClick={onReset}>Новая сессия</button>
        )}
      </div>
    </div>
  );
}