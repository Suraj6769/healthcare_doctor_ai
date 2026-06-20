import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Send, X, Bot } from "lucide-react";
import { ChatMessage, Patient } from "../types";

interface ChatPanelProps {
  patient: Patient | null;
  userType: "doctor" | "patient";
  onClose: () => void;
}

export default function ChatPanel({ patient, userType, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate initial messages
    if (userType === "patient") {
      setMessages([
        {
          id: "1",
          sender: "ai",
          message: "Hello! I'm your AI health assistant. I have access to your medical history and current medications. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    } else if (patient) {
      setMessages([
        {
          id: "1",
          sender: "patient",
          message: "Hi Doctor, I have a question about my medication.",
          timestamp: new Date().toISOString(),
          patientId: patient.id,
        },
      ]);
    }
  }, [patient, userType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: userType,
      message: inputMessage,
      timestamp: new Date().toISOString(),
      patientId: patient?.id,
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate AI or doctor response
    setTimeout(() => {
      let response: ChatMessage;
      
      if (userType === "patient") {
        // AI chatbot response
        const aiResponses = [
          "Based on your medical history, I can help with that. Your current medications include " + (patient?.medications.map(m => m.name).join(", ") || "no active prescriptions") + ".",
          "I've reviewed your medication schedule. Remember to take your medications as prescribed. Would you like me to notify your doctor about this concern?",
          "This seems like an important question. I'm alerting Dr. Smith about your concern for a detailed consultation.",
          "Your adherence rate is good! Keep up the excellent work with your medication schedule.",
        ];
        response = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          message: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          timestamp: new Date().toISOString(),
        };
      } else {
        // Doctor receiving patient response
        response = {
          id: (Date.now() + 1).toString(),
          sender: "patient",
          message: "Thank you for your quick response, doctor!",
          timestamp: new Date().toISOString(),
          patientId: patient?.id,
        };
      }

      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  if (!patient && userType === "doctor") {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select a patient to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          {userType === "patient" ? (
            <>
              <Avatar className="bg-blue-600">
                <AvatarFallback className="text-white">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">AI Health Assistant</h3>
                <p className="text-sm text-gray-500">Always here to help</p>
              </div>
            </>
          ) : (
            <>
              <Avatar>
                <AvatarFallback>
                  {patient?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{patient?.name}</h3>
                <p className="text-sm text-gray-500">Patient</p>
              </div>
            </>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === userType ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === userType
                    ? "bg-blue-600 text-white"
                    : msg.sender === "ai"
                    ? "bg-purple-100 text-purple-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === userType
                      ? "text-blue-100"
                      : msg.sender === "ai"
                      ? "text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder={
              userType === "patient"
                ? "Ask about your medications, symptoms..."
                : "Type a message..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
