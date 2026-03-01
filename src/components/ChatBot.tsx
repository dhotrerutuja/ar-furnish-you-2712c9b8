import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const faqData: { keywords: string[]; answer: string }[] = [
  { keywords: ["delivery", "shipping", "deliver", "ship", "time"], answer: "We offer free delivery on orders above ₹5,000. Standard delivery takes 4-7 business days. Express delivery (1-3 days) is available at ₹499." },
  { keywords: ["return", "refund", "exchange"], answer: "We have a 14-day easy return policy. Items must be in original condition. Refunds are processed within 5-7 business days after we receive the return." },
  { keywords: ["payment", "pay", "upi", "card", "cod", "cash"], answer: "We accept UPI (BHIM, PhonePe, Paytm, GPay), Credit/Debit cards, Net Banking, and Cash on Delivery (COD) for orders under ₹25,000." },
  { keywords: ["warranty", "guarantee", "quality"], answer: "Most of our furniture comes with a 10-year quality guarantee. Check individual product pages for specific warranty details." },
  { keywords: ["track", "order", "status", "where"], answer: "You can track your order by going to 'Track Order' from the header menu. Enter your order ID to see real-time status updates." },
  { keywords: ["cancel", "cancellation"], answer: "Orders can be cancelled within 24 hours of placing. Go to your Profile → My Orders and click 'Cancel'. After 24 hours, please contact customer support." },
  { keywords: ["assembly", "assemble", "install", "installation"], answer: "Assembly instructions are included with every product. We also offer professional assembly service at ₹999 per product. You can add this during checkout." },
  { keywords: ["discount", "offer", "sale", "coupon", "code"], answer: "Check our homepage for ongoing sales! Subscribe to our newsletter for exclusive discount codes. First-time customers get 10% off with code WELCOME10." },
  { keywords: ["size", "dimension", "measure", "fit"], answer: "All product dimensions are listed on individual product pages. We recommend measuring your space before ordering. Our team can help with size recommendations." },
  { keywords: ["contact", "support", "help", "phone", "email", "call"], answer: "📞 Call us: 1800-XXX-XXXX (toll-free)\n📧 Email: support@virtualhome.in\n⏰ Hours: Mon-Sat, 9 AM - 9 PM IST" },
  { keywords: ["account", "login", "register", "sign"], answer: "You can create an account or login from the user icon in the header. Having an account lets you track orders, save wishlists, and get personalized recommendations." },
  { keywords: ["material", "fabric", "wood", "quality"], answer: "We use premium materials including solid wood, engineered wood, high-resilience foam, and durable fabrics. Each product page lists specific materials used." },
];

const quickQuestions = [
  "How do I track my order?",
  "What is the return policy?",
  "What payment methods are accepted?",
  "How long does delivery take?",
  "Do you offer assembly?",
];

const findAnswer = (input: string): string => {
  const lower = input.toLowerCase();
  for (const faq of faqData) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer;
    }
  }
  return "I'm sorry, I couldn't find an answer to that. Please try rephrasing your question, or contact our support team at 1800-XXX-XXXX for further assistance. 😊";
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", text: "Hello! 👋 Welcome to VirtualHome. I'm here to help you with any questions about our products, delivery, returns, and more. How can I help you today?", isBot: true, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: "u-" + Date.now(), text, isBot: false, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const answer = findAnswer(text);
      const botMsg: Message = { id: "b-" + Date.now(), text: answer, isBot: true, timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:brightness-110 transition-all animate-bounce"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/20 rounded-full p-1.5">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold">VirtualHome Support</p>
                <p className="text-[10px] opacity-80">Usually replies instantly</p>
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
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-2.5 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-border bg-background flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 text-sm bg-muted rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-primary text-primary-foreground rounded-full p-2 hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
