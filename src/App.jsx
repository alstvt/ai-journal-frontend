import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import TypingIndicator from "./components/TypingIndicator";
import EmptyState from "./components/EmptyState";
import ChatInput from "./components/ChatInput";
import InsightsPanel from "./components/InsightsPanel";
import HistoryPanel from "./components/HistoryPanel";
import StyleSwitcher from "./components/StyleSwitcher";
import ConfirmDialog from "./components/ConfirmDialog";
import OnboardingTooltip from "./components/OnboardingTooltip";
import { getDeviceId } from "./utils/deviceId";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DRAFT_KEY = "ai-journal-draft";
const STYLE_KEY = "ai-journal-style";
const ONBOARDED_KEY = "ai-journal-onboarded";
const MIN_MESSAGES_FOR_TITLE = 2;

export default function App() {
  const deviceId = useRef(getDeviceId()).current;
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState(() => localStorage.getItem(DRAFT_KEY) || "");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [error, setError] = useState(null);
  const [style, setStyle] = useState(() => localStorage.getItem(STYLE_KEY) || "friend");
  const [savedInsights, setSavedInsights] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem(ONBOARDED_KEY)
  );
  const [confirmState, setConfirmState] = useState(null);
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
    localStorage.setItem(STYLE_KEY, style);
  }, [style]);

  useEffect(() => {
    fetch(`${API_URL}/insights?device_id=${deviceId}`)
      .then((res) => res.json())
      .then((data) => setSavedInsights(data.insights || []))
      .catch(() => {});
  }, []);

  const loadSessions = () => {
    fetch(`${API_URL}/sessions?device_id=${deviceId}`)
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions || []))
      .catch(() => {});
  };

  const requestTitleFor = (id, msgs) => {
    if (!id || msgs.filter((m) => m.role === "user").length < MIN_MESSAGES_FOR_TITLE) return;
    fetch(`${API_URL}/sessions/${id}/title`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs }),
    }).catch(() => {});
  };

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDED_KEY, "true");
    setShowOnboarding(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (showOnboarding) dismissOnboarding();

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
        body: JSON.stringify({ messages: updatedMessages, style }),
      });

      if (!response.ok) throw new Error("server");

      const data = await response.json();
      const finalMessages = [...updatedMessages, { role: "assistant", content: data.reply }];
      setMessages(finalMessages);

      if (!sessionId) {
        fetch(`${API_URL}/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_id: deviceId, style, messages: finalMessages }),
        })
          .then((r) => r.json())
          .then((created) => {
            if (created.session) setSessionId(created.session.id);
          })
          .catch(() => {});
      } else {
        fetch(`${API_URL}/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: finalMessages }),
        }).catch(() => {});
      }
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

  const startNewSession = () => {
    requestTitleFor(sessionId, messages);
    setMessages([]);
    setSessionId(null);
    setError(null);
  };

  const handleReset = () => {
    if (messages.length === 0) return;
    setConfirmState({
      title: "Начать новую сессию?",
      message: "Текущий разговор сохранён и будет доступен в истории.",
      onConfirm: () => {
        startNewSession();
        setConfirmState(null);
      },
    });
  };

  const handleStyleChange = (newStyle) => {
    if (newStyle === style) return;
    if (messages.length > 0) {
      setConfirmState({
        title: "Сменить стиль общения?",
        message: "Текущий разговор сохранён. Новая сессия начнётся с выбранным стилем.",
        onConfirm: () => {
          startNewSession();
          setStyle(newStyle);
          setConfirmState(null);
        },
      });
      return;
    }
    setStyle(newStyle);
  };

  const toggleSaveInsight = async (content) => {
    const existing = savedInsights.find((i) => i.content === content);
    if (existing) {
      setSavedInsights((prev) => prev.filter((i) => i.content !== content));
      fetch(`${API_URL}/insights/${existing.id}`, { method: "DELETE" }).catch(() => {});
      return;
    }

    const tempId = `temp-${Date.now()}`;
    setSavedInsights((prev) => [{ id: tempId, content, created_at: new Date().toISOString() }, ...prev]);

    try {
      const result = await fetch(`${API_URL}/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId, content }),
      }).then((r) => r.json());

      if (result.insight) {
        setSavedInsights((prev) =>
          prev.map((i) => (i.id === tempId ? result.insight : i))
        );
      }
    } catch {
      setSavedInsights((prev) => prev.filter((i) => i.id !== tempId));
    }
  };

  const deleteInsight = (id) => {
    setSavedInsights((prev) => prev.filter((i) => i.id !== id));
    fetch(`${API_URL}/insights/${id}`, { method: "DELETE" }).catch(() => {});
  };

  const openHistoryPanel = () => {
    loadSessions();
    setShowHistory(true);
  };

  const openSession = (session) => {
    const reallyOpen = () => {
      requestTitleFor(sessionId, messages);
      setMessages(session.messages);
      setSessionId(session.id);
      setStyle(session.style);
      setShowHistory(false);
      setError(null);
    };

    if (messages.length > 0 && session.id !== sessionId) {
      setConfirmState({
        title: "Открыть этот разговор?",
        message: "Текущая сессия уже сохранена, можно вернуться к ней через историю.",
        onConfirm: () => {
          reallyOpen();
          setConfirmState(null);
        },
      });
      return;
    }
    reallyOpen();
  };

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    fetch(`${API_URL}/sessions/${id}`, { method: "DELETE" }).catch(() => {});
    if (id === sessionId) startNewSession();
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
        onOpenHistory={openHistoryPanel}
      />

      <div className="chat">
        {messages.length === 0 && <EmptyState />}
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

      <div className="style-switcher-zone">
        <StyleSwitcher value={style} onChange={handleStyleChange} />
        {showOnboarding && <OnboardingTooltip onDismiss={dismissOnboarding} />}
      </div>

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

      {showHistory && (
        <HistoryPanel
          sessions={sessions}
          onClose={() => setShowHistory(false)}
          onOpen={openSession}
          onDelete={deleteSession}
        />
      )}

      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        onConfirm={confirmState?.onConfirm}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  );
}