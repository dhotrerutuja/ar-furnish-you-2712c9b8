import React from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const order = orderId ? getOrder(orderId) : undefined;

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

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="ikea-container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success banner */}
          <div className="bg-background rounded border border-border p-8 text-center mb-6">
            <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Your order <span className="font-bold text-foreground">{order.id}</span> has been placed successfully.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              A confirmation has been sent to your email.
            </p>
          </div>

          {/* Order details */}
          <div className="bg-background rounded border border-border p-6 mb-6">
            <h2 className="font-bold text-foreground mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-bold text-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment</p>
                <p className="font-medium text-foreground capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Delivery</p>
                <p className="font-medium text-foreground">{order.estimatedDelivery.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-background rounded border border-border p-6 mb-6">
            <h2 className="font-bold text-foreground mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="h-14 w-14 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/track-order?id=${order.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-full hover:brightness-110 transition-all"
            >
              <Truck className="h-4 w-4" /> Track Order
            </Link>
            <Link
              to="/products"
              className="flex-1 flex items-center justify-center gap-2 border border-border font-medium py-3 px-6 rounded-full hover:bg-muted transition-colors"
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
