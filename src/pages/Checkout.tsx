import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, ChevronDown, CreditCard, Smartphone, Banknote, Truck, MapPin, Shield, Check, Tag, Building2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const paymentMethods = [
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: Building2 },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive", icon: Banknote },
];

const Checkout = () => {
  const { items, totalPrice, gst, deliveryCharge, grandTotal, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    apartment: "",
    city: "",
    pincode: "",
    state: "Karnataka",
  });
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Pre-fill address from user profile
  useEffect(() => {
    if (user) {
      setAddress({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ").slice(1).join(" ") || "",
        phone: user.phone || "",
        email: user.email || "",
        street: user.address || "",
        apartment: "",
        city: user.city || "",
        pincode: user.pincode || "",
        state: "Karnataka",
      });
    }
  }, [user]);

  // Redirect if cart empty or not logged in
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    } else if (!isLoggedIn) {
      navigate("/login?redirect=checkout");
    }
  }, [items.length, isLoggedIn, navigate]);

  if (items.length === 0 || !isLoggedIn) {
    return null;
  }

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setActiveStep(step + 1);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setCouponApplied(true);
      setCouponDiscount(Math.round(totalPrice * 0.1));
      toast({ title: "Coupon applied!", description: "10% discount applied to your order." });
    } else if (couponCode.toUpperCase() === "FLAT500") {
      setCouponApplied(true);
      setCouponDiscount(500);
      toast({ title: "Coupon applied!", description: "₹500 off your order." });
    } else {
      toast({ title: "Invalid coupon", description: "Please enter a valid coupon code.", variant: "destructive" });
    }
  };

  const shippingCost = shippingMethod === "express" ? 999 : deliveryCharge;
  const finalTotal = grandTotal + (shippingMethod === "express" ? 999 - deliveryCharge : 0) - couponDiscount;

  const handlePlaceOrder = () => {
    if (!agreedTerms) {
      toast({ title: "Please agree to Terms & Conditions", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const addressStr = `${address.firstName} ${address.lastName}, ${address.street}${address.apartment ? ", " + address.apartment : ""}, ${address.city} - ${address.pincode}, ${address.state}. Phone: ${address.phone}`;
      const orderId = placeOrder(items, finalTotal, paymentMethod, addressStr);
      clearCart();
      setProcessing(false);
      navigate(`/order-confirmation/${orderId}`);
    }, 2500);
  };

  const steps = [
    { num: 1, label: "Shipping address" },
    { num: 2, label: "Shipping method" },
    { num: 3, label: "Payment" },
    { num: 4, label: "Review & place order" },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-background border-b border-border">
        <div className="ikea-container py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/cart" className="hover:text-foreground">Cart</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>
      </div>

      {/* Header bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="ikea-container py-3 flex items-center justify-between text-sm">
          <h1 className="font-bold text-lg">Checkout</h1>
          <span className="text-primary-foreground/80">Order subtotal ({items.length} items): {formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className="ikea-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Steps */}
          <div className="lg:col-span-7 space-y-0">
            {steps.map((s) => {
              const isCompleted = completedSteps.includes(s.num);
              const isActive = activeStep === s.num;

              return (
                <div key={s.num} className="bg-background border border-border border-b-0 last:border-b first:rounded-t last:rounded-b overflow-hidden">
                  {/* Step header */}
                  <button
                    onClick={() => isCompleted && setActiveStep(s.num)}
                    className={`w-full flex items-center gap-4 p-5 text-left transition-colors ${isActive ? "bg-background" : "bg-muted/50 hover:bg-muted"}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isCompleted ? "bg-primary text-primary-foreground" :
                      isActive ? "bg-foreground text-background" : "bg-muted-foreground/20 text-muted-foreground"
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : s.num}
                    </div>
                    <span className={`font-semibold text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                    </span>
                    {isCompleted && !isActive && (
                      <span className="ml-auto text-xs text-primary font-medium">Edit</span>
                    )}
                    {isActive && <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />}
                  </button>

                  {/* Step content */}
                  {isActive && (
                    <div className="px-5 pb-6 pt-2">
                      {/* STEP 1: Shipping address */}
                      {s.num === 1 && (
                        <div className="space-y-4">
                          <p className="text-xs text-muted-foreground">* Indicates required field</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1 uppercase">First Name *</label>
                              <input value={address.firstName} onChange={(e) => setAddress({...address, firstName: e.target.value})}
                                className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1 uppercase">Last Name *</label>
                              <input value={address.lastName} onChange={(e) => setAddress({...address, lastName: e.target.value})}
                                className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1 uppercase">Street Address *</label>
                            <input value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})}
                              placeholder="House number and street name"
                              className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1 uppercase">Apt, Suite, Floor (optional)</label>
                            <input value={address.apartment} onChange={(e) => setAddress({...address, apartment: e.target.value})}
                              className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1 uppercase">City *</label>
                              <input value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})}
                                className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1 uppercase">PIN Code *</label>
                              <input value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})}
                                className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1 uppercase">State *</label>
                              <select value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})}
                                className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                                {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1 uppercase">Phone *</label>
                              <input value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})}
                                placeholder="+91 98765 43210"
                                className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1 uppercase">Email Address *</label>
                              <input value={address.email} onChange={(e) => setAddress({...address, email: e.target.value})}
                                className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                          </div>
                          <button onClick={() => completeStep(1)}
                            className="mt-2 bg-foreground text-background font-bold py-3 px-8 rounded text-sm hover:opacity-90 transition-opacity">
                            Continue to shipping method
                          </button>
                        </div>
                      )}

                      {/* STEP 2: Shipping method */}
                      {s.num === 2 && (
                        <div className="space-y-4">
                          <label className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors ${
                            shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}>
                            <input type="radio" name="shipping" checked={shippingMethod === "standard"} onChange={() => setShippingMethod("standard")} className="accent-primary" />
                            <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-foreground">Standard Delivery</p>
                              <p className="text-xs text-muted-foreground">5-7 business days</p>
                            </div>
                            <span className={`font-bold text-sm ${deliveryCharge === 0 ? "text-success" : "text-foreground"}`}>
                              {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                            </span>
                          </label>
                          <label className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors ${
                            shippingMethod === "express" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}>
                            <input type="radio" name="shipping" checked={shippingMethod === "express"} onChange={() => setShippingMethod("express")} className="accent-primary" />
                            <Truck className="h-5 w-5 text-secondary flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-foreground">Express Delivery</p>
                              <p className="text-xs text-muted-foreground">2-3 business days</p>
                            </div>
                            <span className="font-bold text-sm text-foreground">{formatPrice(999)}</span>
                          </label>
                          <button onClick={() => completeStep(2)}
                            className="mt-2 bg-foreground text-background font-bold py-3 px-8 rounded text-sm hover:opacity-90 transition-opacity">
                            Continue to payment
                          </button>
                        </div>
                      )}

                      {/* STEP 3: Payment */}
                      {s.num === 3 && (
                        <div className="space-y-4">
                          {paymentMethods.map((method) => (
                            <div key={method.id}>
                              <label className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors ${
                                paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                              }`}>
                                <input type="radio" name="payment" value={method.id}
                                  checked={paymentMethod === method.id}
                                  onChange={(e) => setPaymentMethod(e.target.value)} className="accent-primary" />
                                <method.icon className="h-5 w-5 text-primary flex-shrink-0" />
                                <div>
                                  <p className="font-semibold text-sm text-foreground">{method.label}</p>
                                  <p className="text-xs text-muted-foreground">{method.desc}</p>
                                </div>
                              </label>

                              {paymentMethod === "card" && method.id === "card" && (
                                <div className="mt-3 ml-12 space-y-3 border border-border rounded p-4 bg-muted/30">
                                  <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">Card Number *</label>
                                    <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                                      placeholder="•••• •••• •••• ••••"
                                      className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">Name on Card *</label>
                                    <input value={cardName} onChange={(e) => setCardName(e.target.value)}
                                      className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-foreground mb-1">Expiration (MM/YY) *</label>
                                      <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM / YY"
                                        className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-foreground mb-1">Card Security Code *</label>
                                      <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="CSC"
                                        className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                  </div>
                                </div>
                              )}

                              {paymentMethod === "upi" && method.id === "upi" && (
                                <div className="mt-3 ml-12 border border-border rounded p-4 bg-muted/30">
                                  <label className="block text-xs font-semibold text-foreground mb-1">UPI ID *</label>
                                  <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi"
                                    className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                              )}
                            </div>
                          ))}
                          <button onClick={() => completeStep(3)}
                            className="mt-2 bg-foreground text-background font-bold py-3 px-8 rounded text-sm hover:opacity-90 transition-opacity">
                            Review & place order
                          </button>
                        </div>
                      )}

                      {/* STEP 4: Review & place order */}
                      {s.num === 4 && (
                        <div className="space-y-5">
                          <div className="bg-muted/50 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-sm text-foreground">Delivery Address</h3>
                              <button onClick={() => setActiveStep(1)} className="text-xs text-primary hover:underline">Edit</button>
                            </div>
                            <p className="text-sm text-foreground">{address.firstName} {address.lastName}</p>
                            <p className="text-xs text-muted-foreground">{address.street}{address.apartment ? `, ${address.apartment}` : ""}</p>
                            <p className="text-xs text-muted-foreground">{address.city} - {address.pincode}, {address.state}</p>
                            <p className="text-xs text-muted-foreground">{address.phone} · {address.email}</p>
                          </div>

                          <div className="bg-muted/50 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-sm text-foreground">Payment Method</h3>
                              <button onClick={() => setActiveStep(3)} className="text-xs text-primary hover:underline">Edit</button>
                            </div>
                            <p className="text-sm text-foreground capitalize">{paymentMethods.find(m => m.id === paymentMethod)?.label}</p>
                          </div>

                          <div className="space-y-3">
                            {items.map(({ product, quantity }) => (
                              <div key={product.id} className="flex items-center gap-3">
                                <img src={product.image} alt={product.name} className="h-14 w-14 rounded object-cover border border-border" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">{product.color} · Qty: {quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                              </div>
                            ))}
                          </div>

                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)}
                              className="accent-primary mt-1" />
                            <span className="text-xs text-muted-foreground">
                              I have read and agree to the website <span className="text-primary underline">terms and conditions</span> *
                            </span>
                          </label>

                          <button onClick={handlePlaceOrder} disabled={processing}
                            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded text-sm hover:brightness-110 transition-all disabled:opacity-50 uppercase tracking-wide">
                            {processing ? "Processing Payment..." : `Place Order · ${formatPrice(finalTotal)}`}
                          </button>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                            <Shield className="h-4 w-4" /> 100% Secure Checkout · SSL Encrypted
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-background rounded border border-border p-6 sticky top-32">
              <h2 className="font-bold text-lg text-foreground mb-4">Summary</h2>

              {/* Coupon */}
              <div className="mb-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Tag className="h-4 w-4" /> Have a Coupon?
                </div>
                {!couponApplied ? (
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code"
                      className="flex-1 border border-border rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                    <button onClick={applyCoupon}
                      className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded text-xs uppercase hover:brightness-110 transition-all">
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-success/10 border border-success/30 rounded p-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">{couponCode.toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground ml-auto">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">Try: WELCOME10 or FLAT500</p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium text-foreground">{formatPrice(gst)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`font-medium ${shippingCost === 0 ? "text-success" : "text-foreground"}`}>
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-success">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground text-base">Total</span>
                  <span className="font-black text-lg text-foreground">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Cart items preview */}
              <div className="mt-6 border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  🛒 Cart ({items.length} Items)
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-14 w-14 rounded object-cover border border-border" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.color} · {product.material}</p>
                        <p className="text-xs text-muted-foreground">Quantity: {quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help */}
              <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Need help?</p>
                <p>Call us: <span className="text-primary">1800-419-4532</span></p>
                <p>Mon-Fri 9am-6pm IST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
