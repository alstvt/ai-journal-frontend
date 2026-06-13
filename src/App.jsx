import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import TypingIndicator from "./components/TypingIndicator";
import EmptyState from "./components/EmptyState";
import ChatInput from "./components/ChatInput";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reflect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Что-то пошло не так, попробуй ещё раз." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header
        hasMessages={messages.length > 0}
        onReset={() => setMessages([])}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
      />

      <div className="chat">
        {messages.length === 0 && <EmptyState onPick={setInput} />}
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatInput value={input} onChange={setInput} onSend={sendMessage} loading={loading} />
    </div>
  );
}