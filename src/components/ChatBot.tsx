import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useReviews } from "@/contexts/ReviewContext";
import { useAuth } from "@/contexts/AuthContext";
import { products, categories, formatPrice } from "@/data/products";

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

  const findAnswer = (input: string): string => {
    const lower = input.toLowerCase();

    // --- CART queries ---
    if (lower.includes("cart")) {
      if (lower.includes("how many") || lower.includes("count") || lower.includes("items in")) {
        return totalItems === 0
          ? "Your cart is empty. Browse our products and add something you love! 🛒"
          : `You have ${totalItems} item(s) in your cart.`;
      }
      if (lower.includes("total") || lower.includes("price") || lower.includes("cost") || lower.includes("amount")) {
        if (totalItems === 0) return "Your cart is empty, so the total is ₹0.";
        return `🛒 Cart Summary:\n• Subtotal: ${formatPrice(totalPrice)}\n• GST (18%): ${formatPrice(gst)}\n• Delivery: ${deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}\n• Grand Total: ${formatPrice(grandTotal)}`;
      }
      if (lower.includes("what") || lower.includes("show") || lower.includes("list") || lower.includes("view") || lower.includes("detail")) {
        if (totalItems === 0) return "Your cart is empty right now. Start shopping to fill it up! 🛍️";
        const itemList = cartItems.map((ci) => `• ${ci.product.name} × ${ci.quantity} — ${formatPrice(ci.product.price * ci.quantity)}`).join("\n");
        return `🛒 Your Cart (${totalItems} items):\n${itemList}\n\nGrand Total: ${formatPrice(grandTotal)}`;
      }
      if (lower.includes("empty") || lower.includes("clear") || lower.includes("remove all")) {
        return totalItems === 0
          ? "Your cart is already empty."
          : `You have ${totalItems} item(s) in your cart. To clear your cart, go to the Cart page and remove items.`;
      }
      // Generic cart
      if (totalItems === 0) return "Your cart is empty. Browse /products to find something you like!";
      const itemList = cartItems.map((ci) => `• ${ci.product.name} × ${ci.quantity}`).join("\n");
      return `🛒 You have ${totalItems} item(s) in your cart:\n${itemList}\nGrand Total: ${formatPrice(grandTotal)}`;
    }

    // --- ORDER queries ---
    if (lower.includes("order") || lower.includes("tracking") || lower.includes("track")) {
      if (lower.includes("how many") || lower.includes("count")) {
        return orders.length === 0
          ? "You haven't placed any orders yet."
          : `You have ${orders.length} order(s) in total.`;
      }
      // Specific order ID lookup
      const orderIdMatch = lower.match(/vh-[a-z0-9]+/i);
      if (orderIdMatch) {
        const order = orders.find((o) => o.id.toLowerCase() === orderIdMatch[0].toLowerCase());
        if (order) {
          const itemNames = order.items.map((i) => `${i.quantity}× ${i.product.name}`).join(", ");
          return `📦 Order ${order.id}:\n• Status: ${order.status.replace(/-/g, " ").toUpperCase()}\n• Items: ${itemNames}\n• Total: ${formatPrice(order.totalAmount)}\n• Payment: ${order.paymentMethod}\n• Placed: ${order.createdAt.toLocaleDateString("en-IN")}\n• Est. Delivery: ${order.estimatedDelivery.toLocaleDateString("en-IN")}`;
        }
        return `I couldn't find an order with ID "${orderIdMatch[0]}". Please check the ID and try again.`;
      }
      if (lower.includes("latest") || lower.includes("recent") || lower.includes("last")) {
        if (orders.length === 0) return "No orders found. Place an order first!";
        const o = orders[0];
        return `📦 Your latest order (${o.id}):\n• Status: ${o.status.replace(/-/g, " ").toUpperCase()}\n• Items: ${o.items.map((i) => i.product.name).join(", ")}\n• Total: ${formatPrice(o.totalAmount)}\n• Est. Delivery: ${o.estimatedDelivery.toLocaleDateString("en-IN")}`;
      }
      if (lower.includes("status") || lower.includes("where") || lower.includes("track")) {
        if (orders.length === 0) return "You don't have any orders to track. You can also visit 'Track Order' from the menu and enter your order ID.";
        const summary = orders.slice(0, 5).map((o) => `• ${o.id}: ${o.status.replace(/-/g, " ").toUpperCase()}`).join("\n");
        return `📦 Your Order Statuses:\n${summary}\n\nFor detailed tracking, visit the Track Order page.`;
      }
      if (lower.includes("all") || lower.includes("list") || lower.includes("show") || lower.includes("history")) {
        if (orders.length === 0) return "You haven't placed any orders yet. Start shopping! 🛍️";
        const summary = orders.map((o) => `• ${o.id} — ${formatPrice(o.totalAmount)} — ${o.status.replace(/-/g, " ").toUpperCase()}`).join("\n");
        return `📦 All Orders (${orders.length}):\n${summary}`;
      }
      // Generic order
      if (orders.length === 0) return "You don't have any orders yet. Browse products and place an order!";
      return `You have ${orders.length} order(s). Ask me about a specific order ID (e.g., "What is the status of VH-XXXXX?") or say "show all orders".`;
    }

    // --- WISHLIST queries ---
    if (lower.includes("wishlist") || lower.includes("wish list") || lower.includes("saved") || lower.includes("favorites") || lower.includes("favourites")) {
      if (wishlistItems.length === 0) return "Your wishlist is empty. ❤️ Browse products and click the heart icon to save items!";
      const items = wishlistItems.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n");
      return `❤️ Your Wishlist (${wishlistItems.length} items):\n${items}`;
    }

    // --- PRODUCT queries ---
    if (lower.includes("product") || lower.includes("furniture") || lower.includes("catalog") || lower.includes("catalogue")) {
      if (lower.includes("how many") || lower.includes("count") || lower.includes("total")) {
        return `We have ${products.length} products across ${categories.length} categories: ${categories.map((c) => c.name).join(", ")}.`;
      }
      if (lower.includes("category") || lower.includes("categories") || lower.includes("types")) {
        const catList = categories.map((c) => `• ${c.name} (${products.filter((p) => p.category === c.id).length} products)`).join("\n");
        return `📂 Our Categories:\n${catList}`;
      }
      if (lower.includes("best") || lower.includes("popular") || lower.includes("top") || lower.includes("recommend")) {
        const bestsellers = products.filter((p) => p.isBestseller).slice(0, 5);
        if (bestsellers.length === 0) return "Check out our products page for popular picks!";
        const list = bestsellers.map((p) => `• ${p.name} (${p.subcategory}) — ${formatPrice(p.price)} ⭐${p.rating}`).join("\n");
        return `🔥 Our Bestsellers:\n${list}`;
      }
      if (lower.includes("new") || lower.includes("latest") || lower.includes("arrival")) {
        const newProducts = products.filter((p) => p.isNew).slice(0, 5);
        if (newProducts.length === 0) return "Check our products page for the latest additions!";
        const list = newProducts.map((p) => `• ${p.name} (${p.subcategory}) — ${formatPrice(p.price)}`).join("\n");
        return `✨ New Arrivals:\n${list}`;
      }
      if (lower.includes("cheapest") || lower.includes("affordable") || lower.includes("budget") || lower.includes("lowest price")) {
        const sorted = [...products].sort((a, b) => a.price - b.price).slice(0, 5);
        const list = sorted.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n");
        return `💰 Most Affordable:\n${list}`;
      }
      if (lower.includes("expensive") || lower.includes("premium") || lower.includes("highest price")) {
        const sorted = [...products].sort((a, b) => b.price - a.price).slice(0, 5);
        const list = sorted.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n");
        return `💎 Premium Products:\n${list}`;
      }
      if (lower.includes("sale") || lower.includes("discount") || lower.includes("offer")) {
        const onSale = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
        if (onSale.length === 0) return "No products on sale right now. Check back later!";
        const list = onSale.map((p) => `• ${p.name} — ${formatPrice(p.price)} (was ${formatPrice(p.originalPrice!)})`).join("\n");
        return `🏷️ Products on Sale:\n${list}`;
      }
    }

    // --- Search for specific product by name ---
    const productMatch = products.find((p) => lower.includes(p.name.toLowerCase()));
    if (productMatch) {
      return `📦 ${productMatch.name} (${productMatch.subcategory})\n• Price: ${formatPrice(productMatch.price)}${productMatch.originalPrice ? ` (was ${formatPrice(productMatch.originalPrice)})` : ""}\n• Rating: ⭐${productMatch.rating} (${productMatch.reviewCount} reviews)\n• Material: ${productMatch.material}\n• Color: ${productMatch.color}\n• Dimensions: ${productMatch.dimensions}\n• Stock: ${productMatch.inStock ? "✅ In Stock" : "❌ Out of Stock"}\n\nView it at /product/${productMatch.id}`;
    }

    // --- REVIEW queries ---
    if (lower.includes("review") || lower.includes("rating") || lower.includes("feedback")) {
      if (lower.includes("how many") || lower.includes("count") || lower.includes("total")) {
        return `We have ${reviews.length} reviews in total across all products.`;
      }
      if (lower.includes("recent") || lower.includes("latest")) {
        const recent = reviews.slice(0, 5);
        if (recent.length === 0) return "No reviews yet.";
        const list = recent.map((r) => {
          const p = products.find((pr) => pr.id === r.productId);
          return `• ${p?.name || "Unknown"} — ⭐${r.rating} by ${r.userName}: "${r.comment}"`;
        }).join("\n");
        return `📝 Recent Reviews:\n${list}`;
      }
      return reviews.length === 0
        ? "No reviews yet. Be the first to review a product!"
        : `We have ${reviews.length} reviews. You can add reviews on any product page after logging in.`;
    }

    // --- ACCOUNT queries ---
    if (lower.includes("account") || lower.includes("login") || lower.includes("register") || lower.includes("sign") || lower.includes("profile") || lower.includes("logged")) {
      if (isLoggedIn && user) {
        return `✅ You're logged in as ${user.name} (${user.email}).\n\nYou can view your profile at /profile.`;
      }
      return "You're not logged in. Go to /login to sign in or /register to create a new account. Having an account lets you track orders, save wishlists, and write reviews.";
    }

    // --- Category-specific searches ---
    for (const cat of categories) {
      if (lower.includes(cat.id) || lower.includes(cat.name.toLowerCase())) {
        const catProducts = products.filter((p) => p.category === cat.id).slice(0, 5);
        const list = catProducts.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n");
        return `🪑 ${cat.name}:\n${list}\n\nView all at /products?category=${cat.id}`;
      }
    }

    // --- STATIC FAQ ---
    const faqData: { keywords: string[]; answer: string }[] = [
      { keywords: ["delivery", "shipping", "deliver", "ship"], answer: "We offer free delivery on orders above ₹5,000. Standard delivery takes 4-7 business days. Express delivery (1-3 days) is available at ₹499." },
      { keywords: ["return", "refund", "exchange"], answer: "We have a 14-day easy return policy. Items must be in original condition. Refunds are processed within 5-7 business days after we receive the return." },
      { keywords: ["payment", "pay", "upi", "card", "cod", "cash"], answer: "We accept UPI (BHIM, PhonePe, Paytm, GPay), Credit/Debit cards, Net Banking, and Cash on Delivery (COD) for orders under ₹25,000." },
      { keywords: ["warranty", "guarantee"], answer: "Most of our furniture comes with a 10-year quality guarantee. Check individual product pages for specific warranty details." },
      { keywords: ["cancel", "cancellation"], answer: "Orders can be cancelled within 24 hours of placing. Go to your Profile → My Orders and click 'Cancel'. After 24 hours, please contact customer support." },
      { keywords: ["assembly", "assemble", "install", "installation"], answer: "Assembly instructions are included with every product. We also offer professional assembly service at ₹999 per product. You can add this during checkout." },
      { keywords: ["coupon", "code", "promo"], answer: "First-time customers get 10% off with code WELCOME10. Check our homepage for ongoing sales!" },
      { keywords: ["size", "dimension", "measure", "fit"], answer: "All product dimensions are listed on individual product pages. We recommend measuring your space before ordering." },
      { keywords: ["contact", "support", "help", "phone", "email", "call"], answer: "📞 Call us: 1800-XXX-XXXX (toll-free)\n📧 Email: support@virtualhome.in\n⏰ Hours: Mon-Sat, 9 AM - 9 PM IST" },
      { keywords: ["material", "fabric", "wood", "quality"], answer: "We use premium materials including solid wood, engineered wood, high-resilience foam, and durable fabrics. Each product page lists specific materials used." },
      { keywords: ["admin"], answer: "The admin panel is available at /admin. It shows all products, orders, reviews, and dashboard analytics." },
      { keywords: ["checkout", "buy", "purchase", "how to order"], answer: "To place an order:\n1. Browse products and add to cart\n2. Go to Cart and click Checkout\n3. Fill in your address, choose shipping & payment\n4. Review and confirm your order!\n\nYou need to be logged in to checkout." },
      { keywords: ["hello", "hi", "hey", "good morning", "good evening"], answer: "Hello! 👋 How can I help you today? You can ask me about products, your cart, orders, delivery, returns, or anything about VirtualHome!" },
      { keywords: ["thank", "thanks", "thx"], answer: "You're welcome! 😊 Feel free to ask if you need anything else. Happy shopping!" },
      { keywords: ["bye", "goodbye", "see you"], answer: "Goodbye! 👋 Thank you for visiting VirtualHome. Come back anytime!" },
    ];

    for (const faq of faqData) {
      if (faq.keywords.some((kw) => lower.includes(kw))) {
        return faq.answer;
      }
    }

    return "I'm sorry, I couldn't find an answer to that. Try asking about:\n• Your cart or orders\n• Product details (e.g., \"Tell me about MALM\")\n• Delivery, returns, or payments\n• Wishlist or reviews\n\nOr contact support at 1800-XXX-XXXX 😊";
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: "u-" + Date.now(), text, isBot: false, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const answer = findAnswer(text);
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
              placeholder="Ask about cart, orders, products..."
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
