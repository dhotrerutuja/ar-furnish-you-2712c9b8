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
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
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
      const customer = {
        name: `${address.firstName} ${address.lastName}`.trim(),
        email: address.email,
        phone: address.phone,
      };
      const orderId = placeOrder(items, finalTotal, paymentMethod, addressStr, customer);
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
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-foreground mb-1">Expiry *</label>
                                      <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-foreground mb-1">CVV *</label>
                                      <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)}
                                        placeholder="•••" type="password"
                                        className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">Name on Card *</label>
                                    <input value={cardName} onChange={(e) => setCardName(e.target.value)}
                                      className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                  </div>
                                </div>
                              )}

                              {paymentMethod === "upi" && method.id === "upi" && (
                                <div className="mt-3 ml-12 space-y-3 border border-border rounded p-4 bg-muted/30">
                                  <div className="flex gap-3">
                                    {[
                                      { id: "gpay", label: "GPay" },
                                      { id: "phonepe", label: "PhonePe" },
                                      { id: "paytm", label: "Paytm" },
                                    ].map((app) => (
                                      <button key={app.id} type="button"
                                        onClick={() => setSelectedUpiApp(app.id)}
                                        className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                                          selectedUpiApp === app.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                                        }`}>{app.label}</button>
                                    ))}
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-foreground mb-1">UPI ID</label>
                                    <input value={upiId} onChange={(e) => setUpiId(e.target.value)}
                                      placeholder="yourname@upi"
                                      className="w-full border border-border rounded px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <button onClick={() => completeStep(3)}
                            className="mt-2 bg-foreground text-background font-bold py-3 px-8 rounded text-sm hover:opacity-90 transition-opacity">
                            Review order
                          </button>
                        </div>
                      )}

                      {/* STEP 4: Review */}
                      {s.num === 4 && (
                        <div className="space-y-4">
                          <div className="divide-y divide-border border border-border rounded">
                            {items.map((item) => (
                              <div key={item.product.id} className="flex items-center gap-3 p-3">
                                <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-foreground">{formatPrice(item.product.price * item.quantity)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="bg-muted/50 rounded p-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatPrice(gst)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Shipping ({shippingMethod})</span><span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span></div>
                            {couponApplied && <div className="flex justify-between text-success"><span>Coupon Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
                            <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2"><span>Total</span><span className="text-primary">{formatPrice(finalTotal)}</span></div>
                          </div>

                          {/* Coupon */}
                          {!couponApplied && (
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                                  placeholder="Enter coupon code"
                                  className="w-full border border-border rounded px-3 py-2.5 pl-9 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                              </div>
                              <button onClick={applyCoupon}
                                className="bg-foreground text-background font-bold py-2.5 px-5 rounded text-sm hover:opacity-90">Apply</button>
                            </div>
                          )}

                          {/* Terms */}
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="mt-1 accent-primary" />
                            <span className="text-xs text-muted-foreground">I agree to the Terms & Conditions and Privacy Policy. I confirm that the information provided is accurate.</span>
                          </label>

                          {/* Place order */}
                          <button onClick={handlePlaceOrder} disabled={processing}
                            className={`w-full font-bold py-4 rounded text-sm transition-all ${
                              processing ? "bg-muted text-muted-foreground cursor-wait" : "bg-primary text-primary-foreground hover:brightness-110"
                            }`}>
                            {processing ? (
                              <span className="flex items-center justify-center gap-2">
                                <span className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                                Processing payment...
                              </span>
                            ) : (
                              `Place Order — ${formatPrice(finalTotal)}`
                            )}
                          </button>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                            <Shield className="h-4 w-4" />
                            <span>Secure checkout. Your data is encrypted and protected.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Order summary sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-background rounded border border-border sticky top-4">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold text-foreground">Order Summary</h2>
              </div>
              <div className="p-4 space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded object-cover" />
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.product.subcategory}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">{formatPrice(gst)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className={shippingCost === 0 ? "text-success font-medium" : "text-foreground"}>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span></div>
                {couponApplied && <div className="flex justify-between text-success"><span>Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span className="text-foreground">Total</span><span className="text-primary">{formatPrice(finalTotal)}</span></div>
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>Free delivery on orders above ₹5,000</span>
                </div>
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
