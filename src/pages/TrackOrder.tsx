import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Calendar, CreditCard, Box } from "lucide-react";
import { useOrders, OrderStatus } from "@/contexts/OrderContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Package; color: string }> = {
  placed: { label: "Order Placed", icon: Package, color: "text-primary" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-primary" },
  shipped: { label: "Shipped", icon: Box, color: "text-primary" },
  "out-for-delivery": { label: "Out for Delivery", icon: Truck, color: "text-secondary" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-success" },
};

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const { orders, getOrder } = useOrders();
  const [trackingId, setTrackingId] = useState(searchParams.get("id") || "");
  const [trackedOrder, setTrackedOrder] = useState(
    searchParams.get("id") ? getOrder(searchParams.get("id")!) : undefined
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setTrackedOrder(getOrder(trackingId.trim()));
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />

      <div className="ikea-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Track Your Order</h1>
          <p className="text-center text-muted-foreground mb-8">Enter your order ID to see real-time delivery status</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl mx-auto">
            <input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Order ID (e.g., VH-XXXXX)"
              className="flex-1 border border-border rounded-full px-5 py-3.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-3.5 rounded-full hover:brightness-110 transition-all flex items-center gap-2">
              <Search className="h-4 w-4" /> Track
            </button>
          </form>

          {/* Tracked order */}
          {trackedOrder ? (
            <div className="space-y-6">
              {/* Order info banner */}
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                {/* Top bar with order details */}
                <div className="bg-primary text-primary-foreground px-6 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-primary-foreground/60 text-xs uppercase">Order Placed</p>
                      <p className="font-bold">{trackedOrder.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div>
                      <p className="text-primary-foreground/60 text-xs uppercase">Total</p>
                      <p className="font-bold">{formatPrice(trackedOrder.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-primary-foreground/60 text-xs uppercase">Ship To</p>
                      <p className="font-bold truncate">{trackedOrder.shippingAddress.split(",")[0]}</p>
                    </div>
                    <div>
                      <p className="text-primary-foreground/60 text-xs uppercase">Order</p>
                      <p className="font-bold">{trackedOrder.id}</p>
                    </div>
                  </div>
                </div>

                {/* Status text */}
                <div className="px-6 pt-6 pb-2 text-center">
                  <p className="text-lg font-bold text-foreground">
                    Order Status: <span className="text-primary capitalize">{trackedOrder.status.replace("-", " ")}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estimated Delivery Date: {trackedOrder.estimatedDelivery.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - {
                      new Date(trackedOrder.estimatedDelivery.getTime() + 48 * 3600000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                    }
                  </p>
                </div>

                {/* Horizontal timeline */}
                <div className="px-6 py-8">
                  <div className="relative flex items-start justify-between">
                    {/* Progress line background */}
                    <div className="absolute top-4 left-0 right-0 h-1 bg-border rounded-full" />
                    {/* Progress line filled */}
                    {(() => {
                      const completedCount = trackedOrder.timeline.filter(s => s.completed).length;
                      const pct = ((completedCount - 1) / (trackedOrder.timeline.length - 1)) * 100;
                      return <div className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />;
                    })()}

                    {trackedOrder.timeline.map((step, i) => {
                      const config = statusConfig[step.status];
                      const Icon = config.icon;
                      return (
                        <div key={step.status} className="flex flex-col items-center relative z-10" style={{ width: `${100 / trackedOrder.timeline.length}%` }}>
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 ${
                            step.completed
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background border-border text-muted-foreground"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className={`mt-2 text-xs font-semibold text-center ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {config.label}
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-0.5">
                            {step.completed
                              ? step.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                              : "Pending"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background rounded-lg border border-border p-6">
                  <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Shipping Information
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{trackedOrder.shippingAddress}</p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Payment:</span> {trackedOrder.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Delivery details */}
                <div className="bg-background rounded-lg border border-border p-6">
                  <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Delivery Details
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date</span>
                      <span className="text-foreground font-medium">{trackedOrder.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Delivery</span>
                      <span className="text-foreground font-medium">{trackedOrder.estimatedDelivery.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items</span>
                      <span className="text-foreground font-medium">{trackedOrder.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div className="bg-background rounded-lg border border-border p-6">
                <h2 className="font-bold text-foreground mb-4">Items in this Order</h2>
                <div className="space-y-3">
                  {trackedOrder.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <img src={product.image} alt={product.name} className="h-16 w-16 rounded object-cover border border-border" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.color} · {product.material}</p>
                        <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-4 pt-4 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-black text-foreground text-lg">{formatPrice(trackedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          ) : trackingId && (
            <div className="bg-background rounded-lg border border-border p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground mb-1">Order not found</p>
              <p className="text-sm text-muted-foreground">Please check your order ID and try again.</p>
            </div>
          )}

          {/* Recent orders */}
          {orders.length > 0 && !trackedOrder && (
            <div className="mt-8">
              <h2 className="font-bold text-foreground mb-4">Your Recent Orders</h2>
              <div className="space-y-3">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => { setTrackingId(order.id); setTrackedOrder(order); }}
                    className="w-full flex items-center justify-between bg-background border border-border rounded-lg p-5 hover:border-primary transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-bold text-sm text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.createdAt.toLocaleDateString("en-IN")} · {order.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-primary font-medium capitalize">{order.status.replace("-", " ")}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
