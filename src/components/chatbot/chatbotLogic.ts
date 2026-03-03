import { CartItem } from "@/contexts/CartContext";
import { Order } from "@/contexts/OrderContext";
import { Product, products, categories, formatPrice } from "@/data/products";
import { Review } from "@/contexts/ReviewContext";

interface ChatData {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  gst: number;
  deliveryCharge: number;
  grandTotal: number;
  orders: Order[];
  wishlistItems: Product[];
  reviews: Review[];
  isLoggedIn: boolean;
  userName: string | null;
  userEmail: string | null;
}

export const findAnswer = (input: string, data: ChatData): string => {
  const lower = input.toLowerCase().trim();

  // --- Greetings ---
  if (/^(hi|hello|hey|hii+|good\s?(morning|evening|afternoon|night)|namaste|howdy)\b/.test(lower)) {
    return "Hello! 👋 Welcome to VirtualHome! I can help you with:\n• 🛒 Cart & Checkout\n• 📦 Orders & Tracking\n• ❤️ Wishlist\n• 🪑 Products & Categories\n• 🚚 Delivery, Returns, Payments\n\nJust ask me anything!";
  }

  // --- Thank you ---
  if (/\b(thank|thanks|thx|ty|dhanyavaad)\b/.test(lower)) {
    return "You're welcome! 😊 Happy shopping at VirtualHome!";
  }

  // --- Bye ---
  if (/\b(bye|goodbye|see you|tata|alvida)\b/.test(lower)) {
    return "Goodbye! 👋 Come back anytime!";
  }

  // --- CART queries ---
  if (/\b(cart|bag|basket|added|add to cart)\b/.test(lower)) {
    if (data.totalItems === 0) return "Your cart is empty. Browse /products to find something you love! 🛒";

    if (/\b(total|price|cost|amount|value|kitna|how much)\b/.test(lower)) {
      return `🛒 Cart Total:\n• Subtotal: ${formatPrice(data.totalPrice)}\n• GST (18%): ${formatPrice(data.gst)}\n• Delivery: ${data.deliveryCharge === 0 ? "FREE" : formatPrice(data.deliveryCharge)}\n• Grand Total: ${formatPrice(data.grandTotal)}`;
    }

    if (/\b(how many|count|kitne|number of)\b/.test(lower)) {
      return `You have ${data.totalItems} item(s) in your cart.`;
    }

    const itemList = data.cartItems.map((ci) => `• ${ci.product.name} × ${ci.quantity} — ${formatPrice(ci.product.price * ci.quantity)}`).join("\n");
    return `🛒 Your Cart (${data.totalItems} items):\n${itemList}\n\nGrand Total: ${formatPrice(data.grandTotal)}`;
  }

  // --- ORDER queries ---
  if (/\b(order|ordered|tracking|track|shipment|dispatch|delivery status|where is my|kahan hai)\b/.test(lower)) {
    // Specific order ID
    const orderIdMatch = lower.match(/vh-[a-z0-9]+/i);
    if (orderIdMatch) {
      const order = data.orders.find((o) => o.id.toLowerCase() === orderIdMatch[0].toLowerCase());
      if (order) {
        const itemNames = order.items.map((i) => `${i.quantity}× ${i.product.name}`).join(", ");
        const statusEmoji = order.status === "delivered" ? "✅" : order.status === "shipped" ? "🚚" : order.status === "out-for-delivery" ? "🏍️" : "📦";
        return `${statusEmoji} Order ${order.id}:\n• Status: ${order.status.replace(/-/g, " ").toUpperCase()}\n• Items: ${itemNames}\n• Total: ${formatPrice(order.totalAmount)}\n• Payment: ${order.paymentMethod}\n• Placed: ${order.createdAt.toLocaleDateString("en-IN")}\n• Est. Delivery: ${order.estimatedDelivery.toLocaleDateString("en-IN")}`;
      }
      return `I couldn't find order "${orderIdMatch[0]}". Please check the ID and try again.`;
    }

    if (data.orders.length === 0) {
      return "You haven't placed any orders yet. Add products to cart and checkout to place your first order! 🛍️";
    }

    if (/\b(latest|recent|last|newest)\b/.test(lower)) {
      const o = data.orders[0];
      return `📦 Your latest order (${o.id}):\n• Status: ${o.status.replace(/-/g, " ").toUpperCase()}\n• Items: ${o.items.map((i) => i.product.name).join(", ")}\n• Total: ${formatPrice(o.totalAmount)}\n• Est. Delivery: ${o.estimatedDelivery.toLocaleDateString("en-IN")}`;
    }

    if (/\b(all|list|show|history|sab|sabhi|pura)\b/.test(lower)) {
      const summary = data.orders.map((o) => `• ${o.id} — ${formatPrice(o.totalAmount)} — ${o.status.replace(/-/g, " ").toUpperCase()}`).join("\n");
      return `📦 All Orders (${data.orders.length}):\n${summary}`;
    }

    if (/\b(status|where|track|kahan|kab)\b/.test(lower)) {
      const summary = data.orders.slice(0, 5).map((o) => `• ${o.id}: ${o.status.replace(/-/g, " ").toUpperCase()}`).join("\n");
      return `📦 Order Statuses:\n${summary}\n\nFor detailed tracking, visit /track-order`;
    }

    // Generic - show all orders
    const summary = data.orders.map((o) => `• ${o.id} — ${formatPrice(o.totalAmount)} — ${o.status.replace(/-/g, " ").toUpperCase()}`).join("\n");
    return `📦 Your Orders (${data.orders.length}):\n${summary}\n\nAsk about a specific order like "Track VH-XXXXX"`;
  }

  // --- What did I buy / purchase ---
  if (/\b(bought|buy|purchased|purchase|what did i)\b/.test(lower)) {
    if (data.orders.length === 0) return "You haven't purchased anything yet. Start shopping! 🛍️";
    const allItems = data.orders.flatMap((o) => o.items.map((i) => `• ${i.product.name} (Order ${o.id})`));
    return `🛍️ Your Purchases:\n${allItems.join("\n")}`;
  }

  // --- WISHLIST queries ---
  if (/\b(wishlist|wish list|saved|favorite|favourite|liked|heart)\b/.test(lower)) {
    if (data.wishlistItems.length === 0) return "Your wishlist is empty. ❤️ Click the heart icon on any product to save it!";
    const items = data.wishlistItems.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n");
    return `❤️ Your Wishlist (${data.wishlistItems.length} items):\n${items}`;
  }

  // --- PRODUCT queries ---
  if (/\b(product|furniture|catalog|catalogue|item|collection|range)\b/.test(lower)) {
    if (/\b(how many|count|total|kitne)\b/.test(lower)) {
      return `We have ${products.length} products across ${categories.length} categories: ${categories.map((c) => c.name).join(", ")}.`;
    }
    if (/\b(category|categories|type|types)\b/.test(lower)) {
      const catList = categories.map((c) => `• ${c.name} (${products.filter((p) => p.category === c.id).length} products)`).join("\n");
      return `📂 Our Categories:\n${catList}`;
    }
    if (/\b(best|popular|top|recommend|trending|hot)\b/.test(lower)) {
      const bestsellers = products.filter((p) => p.isBestseller).slice(0, 5);
      if (bestsellers.length === 0) return "Check out /products for our popular picks!";
      return `🔥 Bestsellers:\n${bestsellers.map((p) => `• ${p.name} — ${formatPrice(p.price)} ⭐${p.rating}`).join("\n")}`;
    }
    if (/\b(new|latest|arrival|recent)\b/.test(lower)) {
      const newProducts = products.filter((p) => p.isNew).slice(0, 5);
      return `✨ New Arrivals:\n${newProducts.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n")}`;
    }
    if (/\b(cheap|affordable|budget|lowest|sasta)\b/.test(lower)) {
      const sorted = [...products].sort((a, b) => a.price - b.price).slice(0, 5);
      return `💰 Most Affordable:\n${sorted.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n")}`;
    }
    if (/\b(expensive|premium|luxury|highest|mehnga)\b/.test(lower)) {
      const sorted = [...products].sort((a, b) => b.price - a.price).slice(0, 5);
      return `💎 Premium Products:\n${sorted.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n")}`;
    }
    if (/\b(sale|discount|offer|deal)\b/.test(lower)) {
      const onSale = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
      if (onSale.length === 0) return "No products on sale right now. Check back later!";
      return `🏷️ On Sale:\n${onSale.map((p) => `• ${p.name} — ${formatPrice(p.price)} (was ${formatPrice(p.originalPrice!)})`).join("\n")}`;
    }
  }

  // --- Search for specific product by name ---
  const productMatch = products.find((p) => lower.includes(p.name.toLowerCase()));
  if (productMatch) {
    return `📦 ${productMatch.name} (${productMatch.subcategory})\n• Price: ${formatPrice(productMatch.price)}${productMatch.originalPrice ? ` (was ${formatPrice(productMatch.originalPrice)})` : ""}\n• Rating: ⭐${productMatch.rating} (${productMatch.reviewCount} reviews)\n• Material: ${productMatch.material}\n• Color: ${productMatch.color}\n• Dimensions: ${productMatch.dimensions}\n• Stock: ${productMatch.inStock ? "✅ In Stock" : "❌ Out of Stock"}\n\nView it at /product/${productMatch.id}`;
  }

  // --- Category-specific searches ---
  for (const cat of categories) {
    if (lower.includes(cat.id) || lower.includes(cat.name.toLowerCase())) {
      const catProducts = products.filter((p) => p.category === cat.id).slice(0, 5);
      return `🪑 ${cat.name}:\n${catProducts.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n")}\n\nView all at /products?category=${cat.id}`;
    }
  }

  // --- Specific subcategory / type searches ---
  if (/\b(sofa|couch)\b/.test(lower)) {
    const sofas = products.filter((p) => p.subcategory?.toLowerCase().includes("sofa") || p.subcategory?.toLowerCase().includes("seat")).slice(0, 5);
    if (sofas.length) return `🛋️ Sofas:\n${sofas.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n")}`;
  }
  if (/\b(bed|beds)\b/.test(lower)) {
    const beds = products.filter((p) => p.category === "beds").slice(0, 5);
    if (beds.length) return `🛏️ Beds:\n${beds.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n")}`;
  }
  if (/\b(table|dining)\b/.test(lower)) {
    const tables = products.filter((p) => p.category === "tables" || p.subcategory?.toLowerCase().includes("table")).slice(0, 5);
    if (tables.length) return `🍽️ Tables:\n${tables.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n")}`;
  }
  if (/\b(chair|seating)\b/.test(lower)) {
    const chairs = products.filter((p) => p.subcategory?.toLowerCase().includes("chair") || p.category === "sofas").slice(0, 5);
    if (chairs.length) return `🪑 Chairs & Seating:\n${chairs.map((p) => `• ${p.name} — ${formatPrice(p.price)}`).join("\n")}`;
  }

  // --- REVIEW queries ---
  if (/\b(review|rating|feedback|stars)\b/.test(lower)) {
    if (data.reviews.length === 0) return "No reviews yet. Be the first to review a product!";
    if (/\b(recent|latest|new)\b/.test(lower)) {
      const recent = data.reviews.slice(0, 5);
      return `📝 Recent Reviews:\n${recent.map((r) => {
        const p = products.find((pr) => pr.id === r.productId);
        return `• ${p?.name || "Product"} — ⭐${r.rating} by ${r.userName}: "${r.comment}"`;
      }).join("\n")}`;
    }
    return `We have ${data.reviews.length} reviews. You can add reviews on any product page. Top rated products have ⭐5 ratings!`;
  }

  // --- ACCOUNT queries ---
  if (/\b(account|login|log in|register|sign|profile|logged|my account)\b/.test(lower)) {
    if (data.isLoggedIn && data.userName) {
      return `✅ You're logged in as ${data.userName} (${data.userEmail}).\n\nVisit /profile to manage your account.`;
    }
    return "You're not logged in. Go to /login to sign in or /register to create a new account.";
  }

  // --- STATIC FAQ ---
  const faqData: { patterns: RegExp; answer: string }[] = [
    { patterns: /\b(deliver|shipping|ship|dispatch|kab milega)\b/, answer: "🚚 Free delivery on orders above ₹5,000. Standard: 4-7 business days. Express (₹999): 1-3 business days." },
    { patterns: /\b(return|refund|exchange|wapas)\b/, answer: "↩️ 14-day easy return policy. Items must be in original condition. Refunds processed within 5-7 business days." },
    { patterns: /\b(payment|pay|upi|card|cod|cash|gpay|paytm|phonepe)\b/, answer: "💳 We accept: UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and COD (for orders under ₹25,000)." },
    { patterns: /\b(warranty|guarantee)\b/, answer: "🛡️ Most furniture comes with a 10-year quality guarantee. Check individual product pages for details." },
    { patterns: /\b(cancel|cancellation)\b/, answer: "❌ Orders can be cancelled within 24 hours. Go to Profile → Orders → Cancel. After 24hrs, contact support." },
    { patterns: /\b(assembl|install)\b/, answer: "🔧 Assembly instructions included. Professional assembly available at ₹999/product — add during checkout." },
    { patterns: /\b(coupon|code|promo|discount code)\b/, answer: "🎟️ Use WELCOME10 for 10% off your first order! Use FLAT500 for ₹500 off." },
    { patterns: /\b(size|dimension|measure|fit)\b/, answer: "📐 All dimensions are listed on product pages. Measure your space before ordering!" },
    { patterns: /\b(contact|support|help|phone|email|call|customer care)\b/, answer: "📞 Call: 1800-XXX-XXXX (toll-free)\n📧 Email: support@virtualhome.in\n⏰ Mon-Sat, 9 AM - 9 PM IST" },
    { patterns: /\b(material|fabric|wood|quality|kya bana)\b/, answer: "🪵 We use premium solid wood, engineered wood, high-resilience foam, and durable fabrics. Details on each product page." },
    { patterns: /\b(checkout|buy|purchase|how to order|kaise kharide)\b/, answer: "🛒 To order:\n1. Browse /products & add to cart\n2. Go to /cart → Checkout\n3. Fill address, choose shipping & payment\n4. Confirm your order!\n\nYou need to be logged in." },
    { patterns: /\b(admin|dashboard)\b/, answer: "📊 The admin panel at /admin shows live data: revenue, orders, cart items, wishlist, reviews, and all products." },
    { patterns: /\b(about|who are you|what can you|kya kar sakte)\b/, answer: "I'm VirtualHome Assistant 🤖! I can answer questions about:\n• Your cart, orders & wishlist\n• Product details, prices & availability\n• Delivery, returns & payments\n• Account & profile\n\nJust ask!" },
  ];

  for (const faq of faqData) {
    if (faq.patterns.test(lower)) return faq.answer;
  }

  // --- Fallback ---
  return "I'm sorry, I couldn't find an answer to that. Try asking about:\n• \"What's in my cart?\"\n• \"Show my orders\"\n• \"Tell me about LANDSKRONA\"\n• \"Delivery info\" or \"Return policy\"\n• \"Show bestsellers\"\n\nOr contact support at 1800-XXX-XXXX 😊";
};
