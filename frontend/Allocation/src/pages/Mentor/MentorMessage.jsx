import React, { useEffect, useState } from "react";
import { getMessages } from "../../services/commonService";

const MentorMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMessages();
        setMessages(res);
      } catch (err) {
        console.error(err);
        setError("Server error while fetching messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading messages...</div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500 font-medium">{error}</div>
    );

  if (!messages.length)
    return (
      <div className="p-6 text-center text-gray-400">
        No messages available.
      </div>
    );

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Messages</h2>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            {/* CONTENT */}
            <div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {msg.content}
              </p>
            </div>

            {/* FOOTER */}
            <div className="mt-auto pt-3 border-t">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">From:</span>{" "}
                {msg.sender?.name || "Unknown"}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorMessage;
