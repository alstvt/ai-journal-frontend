import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import TypingIndicator from "./components/TypingIndicator";
import EmptyState from "./components/EmptyState";
import ChatInput from "./components/ChatInput";
import InsightsPanel from "./components/InsightsPanel";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DRAFT_KEY = "ai-journal-draft";
const INSIGHTS_KEY = "ai-journal-insights";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(() => localStorage.getItem(DRAFT_KEY) || "");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState(null);
  const [savedInsights, setSavedInsights] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(INSIGHTS_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [showInsights, setShowInsights] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem(INSIGHTS_KEY, JSON.stringify(savedInsights));
  }, [savedInsights]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    localStorage.removeItem(DRAFT_KEY);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/reflect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error("server");

      const data = await response.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setError(
        !navigator.onLine
          ? "Нет подключения к интернету. Проверь связь и попробуй снова."
          : "Сервер временно недоступен. Попробуй ещё раз через минуту."
      );
      setInput(userMessage.content);
      setMessages(messages);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    if (messages.length === 0) return;
    const confirmed = window.confirm(
      "Начать новую сессию? Текущий разговор не сохранится."
    );
    if (confirmed) {
      setMessages([]);
      setError(null);
    }
  };

  const toggleSaveInsight = (content) => {
    setSavedInsights((prev) => {
      const exists = prev.some((i) => i.content === content);
      if (exists) {
        return prev.filter((i) => i.content !== content);
      }
      return [{ id: Date.now(), content, date: new Date().toISOString() }, ...prev];
    });
  };

  const deleteInsight = (id) => {
    setSavedInsights((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="app">
      <Header
        hasMessages={messages.length > 0}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        insightsCount={savedInsights.length}
        onOpenInsights={() => setShowInsights(true)}
      />

      <div className="chat">
        {messages.length === 0 && <EmptyState onPick={setInput} />}
        {messages.map((msg, i) => (
          <Message
            key={i}
            role={msg.role}
            content={msg.content}
            savedInsights={savedInsights}
            onToggleSave={toggleSaveInsight}
          />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="error-banner__retry" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        loading={loading}
        inputRef={inputRef}
      />

      {showInsights && (
        <InsightsPanel
          insights={savedInsights}
          onClose={() => setShowInsights(false)}
          onDelete={deleteInsight}
        />
      )}
    </div>
  );
}