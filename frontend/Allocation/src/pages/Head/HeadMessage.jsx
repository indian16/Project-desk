import React, { useEffect, useState, useRef } from "react";
import { sendMessage, getMessages } from "../../services/headService";

const HeadMessage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientRole, setRecipientRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const isFirstLoad = useRef(true);

  const loggedInUser = user || JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH MESSAGES ================= */
  const fetchMessages = async () => {
    try {
      const msgs = await getMessages();
      setMessages(msgs || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ================= SCROLL HANDLING ================= */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // First load → jump to bottom
    if (isFirstLoad.current) {
      container.scrollTop = container.scrollHeight;
      isFirstLoad.current = false;
      return;
    }

    // Auto-scroll only if user is near bottom
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      120;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);

    try {
      const receiverRoles =
        recipientRole === "all" ? ["student", "mentor"] : [recipientRole];

      await sendMessage({ content: newMessage, receiverRoles });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ================= MESSAGE LIST ================= */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-slate-50"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm font-semibold">
            No messages yet
          </div>
        ) : (
          [...messages].reverse().map((m) => {
            const isOwn = String(m.sender?._id) === String(loggedInUser?.id);

            return (
              <div
                key={m._id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[520px] w-full">
                  {/* META */}
                  <div
                    className={`flex items-center gap-2 mb-1 text-[11px] font-bold text-slate-500
                      ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <span>
                      {isOwn ? "You (Admin)" : m.sender?.name || "System"}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* MESSAGE BUBBLE */}
                  <div
                    className={`relative p-4 rounded-xl border text-sm leading-relaxed
                      ${
                        isOwn
                          ? "bg-indigo-50 border-indigo-200 text-slate-800 rounded-tr-none"
                          : "bg-white border-slate-200 text-slate-700 rounded-tl-none"
                      }`}
                  >
                    {/* ROLES */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {m.receiverRoles?.map((r) => (
                        <span
                          key={r}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold uppercase"
                        >
                          {r}
                        </span>
                      ))}
                    </div>

                    <div className="pr-12">{m.content}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= INPUT BAR ================= */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={recipientRole}
            onChange={(e) => setRecipientRole(e.target.value)}
            className="flex-shrink-0 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 bg-white"
          >
            <option value="student">🎓 Students</option>
            <option value="mentor">🧑‍🏫 Mentors</option>
            <option value="all">🌐 All</option>
          </select>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none min-w-0"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            disabled={loading || !newMessage.trim()}
            className="flex-shrink-0 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold
               hover:bg-indigo-700 transition disabled:opacity-40"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeadMessage;
