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

  // Fetch messages
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
    // Polling for live updates
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

 


// Scroll to top immediately on mount
useEffect(() => {
  const container = scrollRef.current;
  if (!container) return;

  // First time open → jump directly to bottom (NO animation)
  if (isFirstLoad.current) {
    container.scrollTop = container.scrollHeight;
    isFirstLoad.current = false;
    return;
  }

  // If user is already near bottom → auto scroll
  const isNearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight < 120;

  if (isNearBottom) {
    container.scrollTop = container.scrollHeight;
  }
}, [messages]);

  // Send message
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

  const sentMessages = messages;

 
  return (
    
    <div className="flex flex-col h-[830px] bg-gray-50 rounded-3xl shadow-xl overflow-hidden font-sans">
      
      {/* Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-200/60 flex justify-between items-center shrink-0">
  <div className="flex items-center gap-3">
    {/* Title and Info Button Group */}
    <div className="flex items-center gap-2">
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Message</h2>
      
      {/* Info Tooltip Icon placed immediately after text */}
      <div className="group relative">
        <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
        </button>
        
        {/* Tooltip Content */}
        <div className="absolute left-6 top- -1 w-100 p-4 bg-indigo-900 text-white text-[11px] leading-relaxed rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 shadow-2xl z-50 translate-y-2 group-hover:translate-y-0">
          <div className="font-bold mb-1 text-indigo-400 uppercase tracking-wider">Important</div>
          The messages is used for offical and public announcement so be carefull.
        </div>
      </div>
    </div>
  </div>


</div>

      {/* Message History */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fcfdfe] scroll-smooth"
      >
        {sentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <p className="text-slate-500 font-medium tracking-wide">No communications logged yet</p>
          </div>
        ) : (
          sentMessages.map((m) => {
            const isOwnMessage = String(m.sender?._id) === String(loggedInUser?.id);

            return (
              <div
                key={m._id}
                className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                {/* Card */}
                <div className="relative flex flex-col w-full max-w-[550px] group transition-all">
                  {/* Meta Header */}
                  <div className={`flex items-center gap-2 mb-2 px-1 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
                      {isOwnMessage ? "You (Admin)" : m.sender?.name || "System Head"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div
                    className={`relative p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md
                      ${isOwnMessage 
                        ? "bg-indigo-50 border-indigo-100 rounded-tr-none ring-1 ring-indigo-50" 
                        : "bg-white border-slate-200 rounded-tl-none"
                      }`}
                  >
                    {/* Receiver Roles */}
                    <div className="absolute top-4 right-4 flex gap-1">
                      {m.receiverRoles.map((r) => (
                        <span
                          key={r}
                          className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase 
                            ${isOwnMessage 
                              ? "bg-indigo-100 text-indigo-700 border border-indigo-200" 
                              : "bg-slate-50 text-slate-500 border border-slate-200"
                            }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>

                    {/* Message Content */}
                    <div className="pr-16 text-slate-700 leading-relaxed text-[14.5px]">
                      {m.content}
                    </div>
                  </div>

                  {/* Subtle glow behind your messages */}
                  {isOwnMessage && (
                    <div className="absolute -inset-0.5 bg-indigo-100/20 rounded-2xl blur opacity-50 -z-10"></div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            
            {/* Role Selector */}
            <select
              value={recipientRole}
              onChange={(e) => setRecipientRole(e.target.value)}
              className="bg-white border-r border-slate-200 rounded-l-xl px-4 py-2 text-sm font-semibold text-slate-600 outline-none hover:bg-slate-50 cursor-pointer appearance-none"
            >
              <option value="student">🎓 Students</option>
              <option value="mentor">🧑‍🏫 Mentors</option>
              <option value="all">🌐 Everyone</option>
            </select>

            {/* Text Input */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your official announcement here..."
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-slate-700"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={loading || !newMessage.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Send</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default HeadMessage;