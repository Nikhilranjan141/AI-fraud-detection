
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Loader2, Mic, MicOff } from "lucide-react";


const dashboardAI = (msg) => {
  const m = msg.toLowerCase();

  if (m.includes("dashboard") || m.includes("overview")) {
    return `
      <b>📊 SecureFin Dashboard – Full Professional Overview</b><br><br>
      The dashboard displays <b>real-time fraud analytics</b> including:<br><br>
      • High Risk Alerts<br>
      • Safe Transactions<br>
      • Live Transaction Feed<br>
      • Fraud Rule Engine<br>
      • Risk Summary<br>
      • Heatmap<br>
      • Transaction Analytics Chart<br><br>

      It helps detect anomalies, device mismatch, location mismatch,
      unusual spending spikes, and fraudulent patterns in real-time.
    `;
  }

  if (m.includes("rules")) {
    return `
      <b>⚙️ Fraud Detection Rules Engine</b><br><br>
      • Add / Edit / Delete rules<br>
      • Threshold control system<br>
      • Real-time rule enforcement<br><br>
      Yeh system fraud detection ka 'brain' hai.
    `;
  }

  if (m.includes("live") && m.includes("transaction")) {
    return `
      <b>⚡ Live Transaction Feed</b><br><br>
      Every 5 seconds the dashboard generates transactions:<br><br>
      🔴 High Risk — Blocked<br>
      🟠 Medium — Challenge Required<br>
      🟢 Safe — Allowed<br><br>
      This helps in monitoring real-time suspicious activities.
    `;
  }

  if (m.includes("heatmap")) {
    return `
      <b>🗺️ Fraud Heatmap</b><br><br>
      Shows region-wise transaction activity.<br>
      High-density area = Possible fraud hotspot.
    `;
  }

  if (m.includes("chart") || m.includes("analytics")) {
    return `
      <b>📈 Fraud Analytics Chart</b><br><br>
      Shows 24-hour trend of:<br>
      • Safe Payments<br>
      • Flagged Transactions<br>
      • Blocked Fraud<br><br>
      Helps find unusual spikes in activity.
    `;
  }
  
  return `
    I am the <b>SecureFin AI Assistant</b>.<br><br>
    Ask me about:<br>
    • "Dashboard overview"<br>
    • "Fraud detection rules"<br>
    • "Live transaction feed"<br>
    • "Risk summary"<br>
    • "Heatmap"<br>
    • "Fraud analytics chart"<br>
  `;
};

const getAIResponse = (msg) => {
  const coreReply = dashboardAI(msg);
  return coreReply;
};


const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! I am the SecureFin Agent. How can I assist you?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  };

  const messagesEndRef = useRef(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now(), sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const botReply = await new Promise((resolve) =>
      setTimeout(() => resolve(getAIResponse(userMsg.text)), 900)
    );

    const botMsg = { id: Date.now() + 1, sender: "bot", text: botReply };
    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-[200] bg-primary hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-7 w-7" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-32 right-6 w-80 h-[480px] shadow-2xl z-[200] flex flex-col border-primary/20 bg-card">
      
      <div className="flex justify-between items-center p-4 border-b border-border bg-primary/10">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">SecureFin</h3>
        </div>

        <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground border border-border rounded-tl-none"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-muted border flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2">
        <Button
          type="button"
          size="icon"
          variant={listening ? "destructive" : "secondary"}
          onClick={toggleVoice}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        <Input
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />

        <Button type="submit" size="icon" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
};

export default AIChatbot;
