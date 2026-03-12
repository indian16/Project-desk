// src/pages/student/StudentMessage.jsx
import React, { useEffect, useState, useRef } from "react";
import { getMessages } from "../../services/commonService";

const StudentMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const isFirstLoad = useRef(true);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const fetchMessages = async () => {
    try {
      const res = await getMessages(); // student-only messages
      setMessages(res || []);
    } catch (err) {
      console.error(err);
      setError("Server error while fetching messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll logic (same as HeadMessage)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    if (isFirstLoad.current) {
      container.scrollTop = container.scrollHeight;
      isFirstLoad.current = false;
      return;
    }

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  if (loading)
    return <p className="text-center text-slate-500 mt-10">Loading messages...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex flex-col h-[830px] bg-gray-50 rounded-3xl shadow-xl overflow-hidden font-sans">
      
      {/* Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-200/60 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Announcements
          </h2>

          {/* Tooltip */}
          <div className="group relative">
            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-indigo-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </button>

            <div className="absolute left-6 top-0 w-72 p-4 bg-indigo-900 text-white text-[11px] rounded-2xl opacity-0 group-hover:opacity-100 transition shadow-2xl z-50">
              <div className="font-bold mb-1 text-indigo-300 uppercase">
                Read Only
              </div>
              These are official announcements sent by the Head.
            </div>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fcfdfe]"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full opacity-30">
            <p className="text-slate-500 font-medium">
              No announcements yet
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isOwnMessage =
              String(m.sender?._id) === String(loggedInUser?.id);

            return (
              <div
                key={m._id}
                className={`flex w-full ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div className="relative flex flex-col w-full max-w-[550px]">
                  
                  {/* Meta */}
                  <div
                    className={`flex items-center gap-2 mb-2 px-1 ${
                      isOwnMessage ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-[11px] font-bold text-slate-900 uppercase">
                      {m.sender?.name || "System Head"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Message Card */}
                  <div className="relative p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    
                    {/* Receiver Role Badge */}
                    <div className="absolute top-4 right-4 flex gap-1">
                      {m.receiverRoles?.map((r) => (
                        <span
                          key={r}
                          className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase bg-slate-50 text-slate-500 border border-slate-200"
                        >
                          {r}
                        </span>
                      ))}
                    </div>

                    <div className="pr-16 text-slate-700 leading-relaxed text-[14.5px]">
                      {m.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentMessage;




