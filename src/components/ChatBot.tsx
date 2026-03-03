import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useReviews } from "@/contexts/ReviewContext";
import { useAuth } from "@/contexts/AuthContext";
import { findAnswer } from "@/components/chatbot/chatbotLogic";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", text: "Hello! 👋 Welcome to VirtualHome. I can help you with your cart, orders, wishlist, product info, delivery, returns, and more. Ask me anything!", isBot: true, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { items: cartItems, totalItems, totalPrice, gst, deliveryCharge, grandTotal } = useCart();
  const { orders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const { reviews } = useReviews();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: "u-" + Date.now(), text, isBot: false, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const answer = findAnswer(text, {
        cartItems, totalItems, totalPrice, gst, deliveryCharge, grandTotal,
        orders, wishlistItems, reviews,
        isLoggedIn, userName: user?.name || null, userEmail: user?.email || null,
      });
      const botMsg: Message = { id: "b-" + Date.now(), text: answer, isBot: true, timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickQuestions = [
    "What's in my cart?",
    "Show my orders",
    "My wishlist",
    "Best selling products",
    "Delivery info",
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:brightness-110 transition-all animate-bounce"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] h-[530px] max-h-[calc(100vh-3rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/20 rounded-full p-1.5">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold">VirtualHome Assistant</p>
                <p className="text-[10px] opacity-80">Ask me anything about the store</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80 transition-opacity">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.isBot ? "" : "flex-row-reverse"}`}>
                  <div className={`flex-shrink-0 rounded-full p-1 ${msg.isBot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    {msg.isBot ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  </div>
                  <div className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${msg.isBot ? "bg-background border border-border text-foreground" : "bg-primary text-primary-foreground"}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-border flex gap-2 flex-wrap bg-background">
              {quickQuestions.map((q) => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-xs px-2.5 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-border bg-background flex items-center gap-2 flex-shrink-0">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cart, orders, products..."
              className="flex-1 text-sm bg-muted rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            <button type="submit" disabled={!input.trim()}
              className="bg-primary text-primary-foreground rounded-full p-2 hover:brightness-110 transition-all disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
