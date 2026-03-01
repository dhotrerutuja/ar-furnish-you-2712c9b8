import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3, Package, ShoppingBag, Users, Star, TrendingUp, ArrowLeft,
  Eye, Edit, Trash2, IndianRupee, ChevronDown,
} from "lucide-react";
import { products, categories, formatPrice } from "@/data/products";
import { useOrders } from "@/contexts/OrderContext";
import { useReviews } from "@/contexts/ReviewContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Tab = "dashboard" | "products" | "orders" | "reviews";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { orders } = useOrders();
  const { reviews } = useReviews();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalReviews = reviews.length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  const categoryCounts = categories.map((c) => ({
    name: c.name,
    count: products.filter((p) => p.category === c.id).length,
  }));

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="ikea-container py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-black text-foreground">Admin Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-background rounded-lg border border-border p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors flex-shrink-0 ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Revenue", value: totalRevenue > 0 ? formatPrice(totalRevenue) : "₹0", icon: IndianRupee, color: "text-success" },
                { label: "Products", value: totalProducts.toString(), icon: Package, color: "text-primary" },
                { label: "Orders", value: totalOrders.toString(), icon: ShoppingBag, color: "text-secondary-foreground" },
                { label: "Avg Rating", value: avgRating, icon: Star, color: "text-secondary" },
              ].map((stat) => (
                <div key={stat.label} className="bg-background rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Category breakdown */}
            <div className="bg-background rounded-lg border border-border p-6 mb-6">
              <h3 className="font-bold text-foreground mb-4">Products by Category</h3>
              <div className="space-y-3">
                {categoryCounts.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-40 truncate">{c.name}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(c.count / totalProducts) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-8 text-right">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No orders yet. Orders will appear here once customers place them.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Order ID</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Items</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Amount</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-border last:border-0">
                          <td className="py-3 font-medium text-foreground">{order.id}</td>
                          <td className="py-3 text-muted-foreground">{order.items.length} items</td>
                          <td className="py-3 text-foreground">{formatPrice(order.totalAmount)}</td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              order.status === "delivered" ? "bg-success/10 text-success" :
                              order.status === "shipped" ? "bg-primary/10 text-primary" :
                              "bg-secondary/30 text-secondary-foreground"
                            }`}>
                              {order.status.replace(/-/g, " ").toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-muted-foreground">{order.createdAt.toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">All Products ({totalProducts})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 text-muted-foreground font-medium">Product</th>
                    <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Category</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Price</th>
                    <th className="text-left p-3 text-muted-foreground font-medium hidden md:table-cell">Rating</th>
                    <th className="text-left p-3 text-muted-foreground font-medium hidden lg:table-cell">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.subcategory}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell capitalize">{product.category}</td>
                      <td className="p-3 text-foreground font-medium">{formatPrice(product.price)}</td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-secondary text-secondary" />
                          <span className="text-foreground">{product.rating}</span>
                        </div>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-bold text-foreground">All Orders ({totalOrders})</h3>
            </div>
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No orders yet. Place an order from the shop to see it here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 text-muted-foreground font-medium">Order ID</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Items</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Total</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Payment</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                      <th className="text-left p-3 text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-primary">{order.id}</td>
                        <td className="p-3">
                          <div>
                            {order.items.map((item, i) => (
                              <p key={i} className="text-xs text-muted-foreground">{item.quantity}× {item.product.name}</p>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 font-medium text-foreground">{formatPrice(order.totalAmount)}</td>
                        <td className="p-3 text-muted-foreground capitalize">{order.paymentMethod.replace(/-/g, " ")}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            order.status === "delivered" ? "bg-success/10 text-success" :
                            order.status === "shipped" ? "bg-primary/10 text-primary" :
                            "bg-secondary/30 text-secondary-foreground"
                          }`}>
                            {order.status.replace(/-/g, " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">{order.createdAt.toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="bg-background rounded-lg border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">All Reviews ({totalReviews})</h3>
              <span className="text-sm text-muted-foreground">Avg: {avgRating} ★</span>
            </div>
            {reviews.length === 0 ? (
              <div className="p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No reviews yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {reviews.map((review) => {
                  const product = products.find((p) => p.id === review.productId);
                  return (
                    <div key={review.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {product && <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />}
                          <div>
                            <p className="text-sm font-medium text-foreground">{product?.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{review.userName} · {review.createdAt.toLocaleDateString("en-IN")}</p>
                            <div className="flex gap-0.5 my-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-secondary text-secondary" : "text-border"}`} />
                              ))}
                            </div>
                            <p className="text-sm text-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
