import React, { useState, useRef, useEffect } from "react";

export default function SlateAIDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMessages([]);
      setInput("");
      fetch("/api/slate-ai-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFirstMessage: true }),
      })
        .then((res) => res.json())
        .then((data) => setMessages([{ role: "ai", text: data.text }]))
        .catch(() => setMessages([{ role: "ai", text: "Hi! I'm Slate AI, I'm here to answer any questions about college, essays, admissions, essay reviews, etc." }]));
    }
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", text: input }]);
    setLoading(true);
    try {
      const res = await fetch("/api/slate-ai-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { role: "ai", text: data.text }]);
    } catch {
      setMessages((msgs) => [...msgs, { role: "ai", text: "Sorry, something went wrong." }]);
    }
    setInput("");
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-lg">Slate AI</span>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <span className={msg.role === "user" ? "bg-blue-800 text-white px-2 py-1 rounded" : "bg-gray-100 text-black px-2 py-1 rounded"}>
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <div className="text-gray-400 text-sm">Slate is thinking...</div>}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 border rounded px-3 py-2 text-black"
            placeholder="Ask Slate anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            disabled={loading}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}



