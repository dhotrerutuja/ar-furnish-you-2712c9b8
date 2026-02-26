import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { useOrders, OrderStatus } from "@/contexts/OrderContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const statusConfig: Record<OrderStatus, { label: string; icon: typeof Package; color: string }> = {
  placed: { label: "Order Placed", icon: Package, color: "text-primary" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-primary" },
  shipped: { label: "Shipped", icon: Truck, color: "text-primary" },
  "out-for-delivery": { label: "Out for Delivery", icon: Truck, color: "text-warning" },
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Track Your Order</h1>
          <p className="text-center text-muted-foreground mb-8">Enter your order ID to see real-time delivery status</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Order ID (e.g., VH-XXXXX)"
              className="flex-1 border border-border rounded-full px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full hover:brightness-110 transition-all flex items-center gap-2">
              <Search className="h-4 w-4" /> Track
            </button>
          </form>

          {/* Tracked order */}
          {trackedOrder ? (
            <div className="space-y-6">
              {/* Status banner */}
              <div className="bg-background rounded border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-bold text-foreground text-lg">{trackedOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Est. Delivery</p>
                    <p className="font-medium text-foreground">
                      {trackedOrder.estimatedDelivery.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {trackedOrder.timeline.map((step, i) => {
                    const config = statusConfig[step.status];
                    const Icon = config.icon;
                    const isLast = i === trackedOrder.timeline.length - 1;

                    return (
                      <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 flex-1 mt-1 ${step.completed ? "bg-primary" : "bg-border"}`} />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className={`text-sm font-semibold ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {config.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.completed
                              ? step.date.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                              : "Pending"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order summary */}
              <div className="bg-background rounded border border-border p-6">
                <h2 className="font-bold text-foreground mb-3">Items</h2>
                <div className="space-y-3">
                  {trackedOrder.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-12 w-12 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-foreground">{formatPrice(product.price * quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-4 pt-4 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-black text-foreground">{formatPrice(trackedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-background rounded border border-border p-6">
                <h2 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Shipping Address
                </h2>
                <p className="text-sm text-muted-foreground">{trackedOrder.shippingAddress}</p>
              </div>
            </div>
          ) : trackingId && (
            <div className="bg-background rounded border border-border p-8 text-center">
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
                    onClick={() => {
                      setTrackingId(order.id);
                      setTrackedOrder(order);
                    }}
                    className="w-full flex items-center justify-between bg-background border border-border rounded p-4 hover:border-primary transition-colors"
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
