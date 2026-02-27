import React, { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Truck, ArrowRight, Download, Printer, MapPin, CreditCard, Calendar, FileText } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const order = orderId ? getOrder(orderId) : undefined;
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="ikea-container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const deliveryCharge = subtotal >= 5000 ? 0 : 499;

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="ikea-container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success banner */}
          <div className="bg-background rounded-lg border border-border p-8 text-center mb-6">
            <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">Thank you for your order</h1>
            <p className="text-muted-foreground">
              We've received your payment and here is a summary for the same
            </p>
          </div>

          {/* Invoice card */}
          <div ref={invoiceRef} className="bg-background rounded-lg border border-border overflow-hidden mb-6 print:shadow-none">
            {/* Invoice header */}
            <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Invoice</p>
                <p className="font-bold text-foreground text-lg">#{order.id}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary text-lg tracking-wider">VIRTUAL HOME</p>
                <p className="text-xs text-muted-foreground">Furniture & Home</p>
              </div>
            </div>

            {/* Customer & payment info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 py-5 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Customer:</p>
                <p className="font-bold text-sm text-foreground">{order.shippingAddress.split(",")[0]}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Payment method:</p>
                <p className="font-bold text-sm text-foreground capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date of payment:</p>
                <p className="font-bold text-sm text-foreground">
                  {order.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Estimated Delivery:</p>
                <p className="font-bold text-sm text-foreground">
                  {order.estimatedDelivery.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Items table */}
            <div className="px-6 py-5 border-b border-border">
              <div className="space-y-3">
                {order.items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={product.image} alt={product.name} className="h-12 w-12 rounded object-cover border border-border" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="px-6 py-4 space-y-2 text-sm border-b border-border">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="text-foreground">{formatPrice(gstAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={deliveryCharge === 0 ? "text-success font-medium" : "text-foreground"}>
                  {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="px-6 py-4 bg-primary/5 flex justify-between items-center">
              <span className="font-bold text-foreground text-base">Total amount paid</span>
              <span className="font-black text-primary text-xl">{formatPrice(order.totalAmount)}</span>
            </div>

            {/* Disclaimer */}
            <div className="px-6 py-4 bg-muted/50">
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> Attached is the invoice for the services provided by VIRTUAL HOME. For items not covered in this invoice, the outlet shall be responsible to issue an invoice directly to you.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 text-center border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">We appreciate your business.</p>
              <p className="font-bold text-foreground tracking-wider text-sm">VIRTUAL HOME</p>
              <p className="text-xs text-muted-foreground">Bangalore, Karnataka, India 560001</p>
              <p className="text-xs text-muted-foreground">+91 1800-419-4532</p>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-background rounded-lg border border-border p-6 mb-6">
            <h2 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Shipping Address
            </h2>
            <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/track-order?id=${order.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3.5 px-6 rounded-full hover:brightness-110 transition-all"
            >
              <Truck className="h-4 w-4" /> Track Order
            </Link>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-foreground text-foreground font-bold py-3.5 px-6 rounded-full hover:bg-foreground hover:text-background transition-colors"
            >
              <Printer className="h-4 w-4" /> Print Invoice
            </button>
            <Link
              to="/products"
              className="flex-1 flex items-center justify-center gap-2 border border-border font-medium py-3.5 px-6 rounded-full hover:bg-muted transition-colors"
            >
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
