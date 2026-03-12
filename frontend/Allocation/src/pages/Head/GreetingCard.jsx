import React, { useEffect, useState } from "react";

const GreetingCard = () => {
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) setGreeting("Good Morning 🌅");
      else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon ☀");
      else if (hour >= 17 && hour < 20) setGreeting("Good Evening 🌆");
      else setGreeting("Good Night 🌙");

      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full p-6 mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 shadow-xl text-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{greeting}, Head!</h2>
          <p className="text-white/80 text-sm mt-1">
            Hope you're having a productive day.
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-3xl font-semibold">{time}</div>
          <div className="mt-2 text-3xl animate-bounce">⏰</div>
        </div>
      </div>
    </div>
  );
};

export default GreetingCard;
