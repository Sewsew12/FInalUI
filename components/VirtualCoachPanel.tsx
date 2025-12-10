"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoachStore } from "@/store/useCoachStore";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What workout should I do today?",
  "How can I improve my running?",
  "Give me motivation for today",
  "What's my progress this week?",
];

export function VirtualCoachPanel() {
  const { user } = useAuthStore();
  const { generateNudge } = useCoachStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey! I'm your AI fitness coach. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("workout") || lowerInput.includes("exercise")) {
        response =
          "Based on your goals, I recommend a 30-minute HIIT session today. It will help you burn calories and build endurance. Would you like me to create a specific workout plan?";
      } else if (lowerInput.includes("running") || lowerInput.includes("run")) {
        response =
          "Great that you're focusing on running! Try interval training: 5 min warm-up, then alternate 2 min fast run with 1 min walk for 20 minutes. This will improve your speed and endurance.";
      } else if (lowerInput.includes("motivation") || lowerInput.includes("motivate")) {
        response =
          "You've got this! Every workout counts, and you're building a stronger version of yourself every day. Remember why you started - you're capable of amazing things! 💪";
      } else if (lowerInput.includes("progress") || lowerInput.includes("stats")) {
        response =
          "You've been doing great! You've logged several activities this week. Keep up the momentum - consistency is key to reaching your goals.";
      } else {
        response =
          "That's a great question! I'm here to help you with workouts, nutrition tips, motivation, and tracking your progress. What specific area would you like to focus on?";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="gradient-purple-blue p-4 rounded-t-xl">
        <div className="flex items-center">
          <Bot className="w-6 h-6 text-white mr-3" />
          <div>
            <h2 className="text-lg font-bold text-white">AI Fitness Coach</h2>
            <p className="text-sm text-purple-100">Your personal fitness assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start max-w-[80%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-purple-600 ml-2"
                    : "bg-gray-200 mr-2"
                }`}
              >
                {message.role === "user" ? (
                  <UserIcon className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything about fitness..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-4 py-2 gradient-purple-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

