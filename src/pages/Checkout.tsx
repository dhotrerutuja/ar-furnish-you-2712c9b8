import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, CreditCard, Smartphone, Banknote, Truck, MapPin } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/contexts/OrderContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive", icon: Banknote },
];

const Checkout = () => {
  const { items, totalPrice, gst, deliveryCharge, grandTotal, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<"address" | "payment" | "confirm">("address");
  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
    state: "Karnataka",
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  if (!isLoggedIn) {
    navigate("/login?redirect=checkout");
    return null;
  }

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      const addressStr = `${address.name}, ${address.street}, ${address.city} - ${address.pincode}, ${address.state}`;
      const orderId = placeOrder(items, grandTotal, paymentMethod, addressStr);
      clearCart();
      setProcessing(false);
      navigate(`/order-confirmation/${orderId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="bg-background border-b border-border">
        <div className="ikea-container py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/cart" className="hover:text-foreground">Cart</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-background border-b border-border">
        <div className="ikea-container py-4">
          <div className="flex items-center justify-center gap-4">
            {[
              { id: "address", label: "Address" },
              { id: "payment", label: "Payment" },
              { id: "confirm", label: "Confirm" },
            ].map((s, i) => (
              <React.Fragment key={s.id}>
                {i > 0 && <div className={`h-px w-12 ${["address"].indexOf(step) < i ? "bg-border" : "bg-primary"}`} />}
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s.id ? "bg-primary text-primary-foreground" :
                    ["address", "payment", "confirm"].indexOf(step) > ["address", "payment", "confirm"].indexOf(s.id)
                      ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-medium hidden sm:block ${step === s.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="ikea-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Address step */}
            {step === "address" && (
              <div className="bg-background rounded border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    <input
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                    <input
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Street Address</label>
                    <input
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">City</label>
                    <input
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">PIN Code</label>
                    <input
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">State</label>
                    <input
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep("payment")}
                  className="mt-6 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full hover:brightness-110 transition-all"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment step */}
            {step === "payment" && (
              <div className="bg-background rounded border border-border p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors ${
                        paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-primary"
                      />
                      <method.icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-foreground mb-1">UPI ID</label>
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Card Number</label>
                      <input placeholder="1234 5678 9012 3456" className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Expiry</label>
                        <input placeholder="MM/YY" className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">CVV</label>
                        <input placeholder="123" className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep("address")}
                    className="px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full hover:brightness-110 transition-all"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Confirm step */}
            {step === "confirm" && (
              <div className="space-y-4">
                <div className="bg-background rounded border border-border p-6">
                  <h2 className="text-lg font-bold text-foreground mb-3">Delivery Address</h2>
                  <p className="text-sm text-foreground">{address.name}</p>
                  <p className="text-sm text-muted-foreground">{address.street}</p>
                  <p className="text-sm text-muted-foreground">{address.city} - {address.pincode}, {address.state}</p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  <button onClick={() => setStep("address")} className="text-xs text-primary hover:underline mt-2">Edit</button>
                </div>

                <div className="bg-background rounded border border-border p-6">
                  <h2 className="text-lg font-bold text-foreground mb-3">Payment</h2>
                  <p className="text-sm text-foreground capitalize">
                    {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                  </p>
                  <button onClick={() => setStep("payment")} className="text-xs text-primary hover:underline mt-2">Edit</button>
                </div>

                <div className="bg-background rounded border border-border p-6">
                  <h2 className="text-lg font-bold text-foreground mb-3">Order Items</h2>
                  <div className="space-y-3">
                    {items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-12 w-12 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="flex-1 bg-secondary text-secondary-foreground font-bold py-3.5 px-8 rounded-full hover:brightness-95 transition-all disabled:opacity-50"
                  >
                    {processing ? "Processing Payment..." : `Place Order · ${formatPrice(grandTotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded border border-border p-6 sticky top-32">
              <h2 className="font-bold text-lg text-foreground mb-4">Order Summary</h2>
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
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={`font-medium ${deliveryCharge === 0 ? "text-success" : "text-foreground"}`}>
                    {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-black text-lg text-foreground">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                Estimated delivery: 4-7 business days
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
